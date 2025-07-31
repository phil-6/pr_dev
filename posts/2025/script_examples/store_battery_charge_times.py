# python_scripts/store_battery_charge_times.py
# Processes next-day Octopus rates, stores cheapest slots, and returns change status

# Entity IDs and constants
EVENT_ENTITY = 'event.octopus_energy_electricity_xxx_xxx_next_day_rates'
SENSOR_ENTITY = 'sensor.scheduled_battery_charge_times'
CHARGING_SLOTS_COUNT = 6

# Prepare output dict for automation
output = {}

def get_rates_event():
    """Retrieve the rates event entity or log an error."""
    event = hass.states.get(EVENT_ENTITY)
    if not event:
        logger.error(f"Rates event '{EVENT_ENTITY}' not found")
    return event


def extract_raw_rates(event):
    """Extract raw 'rates' list from event attributes."""
    return event.attributes.get('rates', []) if event else []


def merge_consecutive_slots(slots):
    """
    Given a list of slots sorted by start time, merge any where
    one slot’s end == the next slot’s start, and set the merged
    slot’s price to the average of all merged slots’ prices.
    """
    merged = []
    current_group = []

    for slot in slots:
        if current_group and slot['start'] == current_group[-1]['end']:
            # still consecutive—add to current run
            current_group.append(slot)
        else:
            # break in sequence: flush previous run (if any)
            if current_group:
                # compute the merged slot for that run
                start = current_group[0]['start']
                end   = current_group[-1]['end']
                avg_price = sum(s['price'] for s in current_group) / len(current_group)
                rounded_avg = round(avg_price, 3)
                merged.append({'start': start, 'end': end, 'price': rounded_avg})
            # start a new run
            current_group = [slot]

    # flush the final run
    if current_group:
        start = current_group[0]['start']
        end   = current_group[-1]['end']
        avg_price = sum(s['price'] for s in current_group) / len(current_group)
        rounded_avg = round(avg_price, 3)
        merged.append({'start': start, 'end': end, 'price': rounded_avg})

    return merged


def build_charging_slots(raw_rates, count):
    """Sort raw rates by price and build list of cheapest slots."""
    sorted_rates = sorted(raw_rates, key=lambda r: r['value_inc_vat'])
    cheapest_six = [
        {
            'start': r['start'],
            'end':   r['end'],
            'price': round(r['value_inc_vat'] * 100, 2)
        }
        for r in sorted_rates[:count]
    ]
    cheapest_six.sort(key=lambda s: s['start'])
    return merge_consecutive_slots(cheapest_six)


def get_old_slots():
    """Retrieve existing slots from the sensor, or None if not present."""
    entity = hass.states.get(SENSOR_ENTITY)
    return entity.attributes.get('charge_times') if entity else None


def store_new_slots(new_slots):
    for slot in new_slots:
        if isinstance(slot['start'], datetime.datetime):
            slot['start'] = slot['start'].isoformat()
        if isinstance(slot['end'], datetime.datetime):
            slot['end'] = slot['end'].isoformat()

    hass.states.set(
        SENSOR_ENTITY,
        'ok',
        {'charge_times': new_slots}
    )


def previous_slots_in_progress(old_slots):
    if not old_slots:
        return False

    start_value = old_slots[0]['start']
    end_value = old_slots[-1]['end']

    start_dt = start_value if isinstance(start_value, datetime.datetime) else dt_util.parse_datetime(start_value)
    end_dt = end_value if isinstance(end_value, datetime.datetime) else dt_util.parse_datetime(end_value)

    now = dt_util.utcnow().astimezone(start_dt.tzinfo)
    return start_dt <= now < end_dt


def parse_slots(slots):
    parsed = []
    for s in slots or []:
        parsed.append({
            'start': dt_util.parse_datetime(s['start']),
            'end':   dt_util.parse_datetime(s['end']),
            'price': s['price']
        })
    return parsed


def main():
    # 1) Fetch and parse rates
    event = get_rates_event()
    raw_rates = extract_raw_rates(event)
    old_slots = get_old_slots()

    if raw_rates:
        output['rates_available'] = True
        # 2) Compute cheapest slots list
        new_slots = build_charging_slots(raw_rates, CHARGING_SLOTS_COUNT)
        old_slots_parsed = parse_slots(old_slots)

        # 3) Compare to old
        changed = (old_slots_parsed != new_slots)
        output['changed'] = changed
        output['new_slots'] = new_slots
        output['old_slots'] = old_slots

        if changed:
            # if no previous slots, or last-old end ≤ now, then store
            if (not old_slots) or (not previous_slots_in_progress(old_slots)):
                store_new_slots(new_slots)
                output['slots'] = new_slots
            else:
                # last old slot still in future → skip write/notification
                output['changed'] = False
                output['slots'] = old_slots
                output['old_slots_in_progress'] = previous_slots_in_progress(old_slots)
    else:
        output['rates_available'] = False
        output['changed'] = False
        output['old_slots_in_progress'] = previous_slots_in_progress(old_slots)


# Execute
main()
