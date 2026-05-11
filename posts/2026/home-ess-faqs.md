# Home ESS — Frequently Asked Questions

Compiled from questions received since the original blog post was published.

---

## Wiring & Installation

### What size wiring do you have from the Victron back to the consumer unit, and what MCB?

10mm² cable — 12m open to air (with 10mm bond) inside the house, then 13m of 10mm armoured outside, joined at a junction box. It's on a 32A MCB (possibly 40A). The cable sizing was specced by Paul the electrician and verified with online cable calculators from electrical wholesalers. Worth running those numbers for your own install as cable length and installation method will affect things, but 10mm² over a reasonable run should be fine for the 8000.

### Do I have a separate DC isolator or fuse between the battery and inverter?

No. The Fogstar's internal BMS handles overcurrent protection on the DC side. That said, if your supplier (e.g. Bimble Solar) recommends one for your specific setup, go with their advice — having an additional DC isolation point doesn't do any harm and gives you an easy way to fully isolate the DC side if you ever need to work on anything.

### What cable connects the Fogstar battery to the GX device?

A VE.Can to CAN-bus Type-B cable. On my setup it connects to the VE.Can port on the CerboGX and the CAN-bus port on the Fogstar's BMS. If you have a MultiPlus-II with built-in GX rather than a separate Cerbo, double-check which port you need on the inverter side — but it should still be a CAN-bus Type-B connection on the Fogstar end.

**Important config step:** You need to change the connection type in Settings > Connectivity to "CAN-bus BMS LV (500 kbits/s)" for the GX to recognise the battery properly. This caught me out initially.

### Can I take the battery kit with me if I move house?

Yes. The battery, inverter and Cerbo GX are all portable — they come with you. The only things that stay behind are the wiring and consumer unit work, which is a relatively small part of the overall cost.

### How do I find a suitable electrician for this type of install?

This can be tricky — you want someone comfortable with Victron ESS installations specifically, not just a general electrician. Some suggestions:

- Victron has an installer/dealer network — check their website for someone in your area with ESS experience.
- Bimble Solar (bimblesolar.com) were brilliant for hardware and may be able to recommend an installer near you.
- The Victron Community forums (community.victronenergy.com) are really active and UK installers post there — worth asking.

---

## ET112 Sensors

### Are all three ET112 sensors necessary?

No. The only ET112 that's essential for the Victron ESS is the **grid meter** — installed immediately after the meter, before any loads. This is the control input that tells the ESS what's being imported and exported so it can manage charging and discharging.

My other two ET112s (feed to garage and EV charger) are just for monitoring visibility — nice to have on the dashboards but the ESS doesn't need them to function. I added them because I wasn't confident in what I was doing and wanted more data. I've actually doubled up more than the diagram shows — each ET112 also has a Shelly CT clamp monitoring the same feed. The values are always within a margin of error and both feed into Home Assistant.

### Where does the ET112 go in relation to the meter, loads and inverter?

This took me a while to figure out as the documentation isn't that clear:

- The ET112 needs to monitor the grid **immediately after the meter, before any loads**.
- The sense cables from the ET112 feed into the CerboGX.
- The CerboGX is the brain, which tells the inverter what to do.
- The ESS Assistant firmware gets installed on the MultiPlus, not the CerboGX — this confused me for a while too!

### Can I use multiple ET112s to measure different circuits?

Yes, but you only need one configured as the grid meter for the ESS. Additional ET112s can be configured in different roles (PV meter, AC meter, etc.) for monitoring purposes. For a setup where you want to measure the house and garage but exclude the EV charger, a single ET112 measuring the house + garage tail (excluding the EV charger feed) should work well.

### What is the ET112 on the EV charger for?

It's for monitoring, not for the ESS itself. The automation handles preventing the battery from discharging to charge the car — see the IOG dispatch slots question below. The ET112 on the EV charger circuit just gives me visibility of that load on the dashboards.

### What is the yellow CT clamp sensor near the EV charger in the diagram?

That's a CT clamp that feeds into the EV charger itself. This is required so the EVC can automatically reduce its draw if the overall household draw gets too high. Consider the (improbable but possible) worst case: 6.6kW MultiPlus + 7.4kW EVC + 7kW oven + kettle + microwave + washing machine + tumble dryer is an insane max load that you have to account for. Most EV chargers require this kind of current sensing.

---

## Battery Sizing & Charging

### How long does the battery take to charge?

From real-world data with my 16.1kWh Fogstar and the MP-II 48/8000 inverter:

- 16% → 100% in ~2.5 hours (23:32 to 02:00)
- 17% → 100% in ~2.5 hours (23:30 to 02:00)

That's roughly 13.5kWh in 2.5 hours, at approximately 105–110A — basically the MP-II 48/8000's full 110A charger rating. The Fogstar BMS doesn't seem to limit it significantly.

With the smaller MP-II 48/5000 (70A charger), the same battery would take closer to 4–4.5 hours.

For a 32kWh battery with the 8000 inverter, expect roughly double — around 5 hours. Check this fits within your tariff's off-peak window.

### How do I work out the right battery size for my usage?

Download your last 12 months of half-hourly readings from your Octopus account and run them through the [Battery Payback Calculator](/battery-payback). It calculates savings, payback period and charge time vs off-peak window based on your actual usage patterns.

As a rough guide: my average daily usage is ~13kWh and the 16.1kWh battery covers it most days. I only fully drain it on about 5% of days. If your daily usage is significantly higher (e.g. 25kWh+), a 16.1kWh battery will still save you money but won't offset all your peak usage.

### The calculator shows four batteries — do I need four?

No! The calculator lets you compare up to four different battery configurations side by side. The screenshot on the blog shows the Fogstar 16.1kWh with two different inverter options, the Fogstar 32kWh, and the MyEnergi 20kWh system — just for comparison purposes.

---

## Tariffs & Automation

### Do I need Home Assistant to run this on Intelligent Octopus Go?

No. IOG has a fixed off-peak window (23:30–05:30), which is much simpler than Octopus Agile's half-hourly variable rates. The Victron ESS has built-in scheduled charging that handles a fixed off-peak window without needing Home Assistant or any custom automation.

Victron also have Dynamic ESS (DESS), which optimises charge and discharge cycles based on your energy prices and usage patterns. It works with fixed tariffs like IOG as well as dynamic ones, and it's configured through the Victron VRM portal — no coding or home automation needed.

The complexity in the original blog post is mostly around automating Octopus Agile. For IOG, once it's configured it's straightforward to manage.

### Can the battery charge during IOG's extra dispatch slots (outside the normal off-peak window)?

Yes. The BottlecapDave Octopus Home Assistant integration exposes an `intelligent_dispatching` sensor that turns on during both the standard 23:30–05:30 off-peak window **and** any extra dispatch slots that Octopus assigns during the day.

**Important caveat:** The dispatching sensor can show as "on" during a dispatch slot even if the car isn't actually charging — and you won't get the cheap rate unless the car is genuinely drawing power. My automation checks both the dispatching state and whether the EV charger is actively charging before telling the battery to charge.

### How does the system prevent the battery from discharging to charge the EV?

This is handled by automation in Home Assistant rather than by the ET112 sensors. My automation monitors:

1. Whether the EV charger (Hypervolt) is actively charging
2. Whether an IOG intelligent dispatch slot is active
3. The current electricity rate

If the car is charging on a cheap dispatch slot → the battery charges too (cheap rate for both). If the car is charging outside a dispatch slot at expensive rates → it sends an alert. If nothing is charging and rates are normal → the ESS runs in optimised discharge mode.

### Can I get basic monitoring without going deep into Home Assistant?

Yes. The Victron VRM portal gives you energy flows, system performance and usage data out of the box as a web dashboard — no Home Assistant needed. HA is only necessary if you want custom automations or deeper integration.

---

## System & Inverter Choice

### Do you have solar panels?

No. We live in a conservation area, in a mid-terrace with a small south-facing roof space with a large gable end, and the garage roof isn't strong enough. Solar isn't an option for us.

### Victron vs alternatives (Solis, Luxpower, MyEnergi, GivEnergy)?

I can only speak to Victron + Fogstar, which has been great. I don't have experience with Solis, Luxpower or other inverter brands, so I can't compare directly. I chose Victron for the strong community support, depth of capability and solid Home Assistant integration. The more integrated systems (MyEnergi, GivEnergy) are designed to be simpler out of the box but cost more.

Victron's configuration has some complexity upfront, but once it's set up it's easy to manage — especially on a fixed tariff like IOG where the built-in ESS scheduled charging and DESS handle things without custom automation.

### Can I keep my existing solar inverters and add a Victron battery system?

Yes — AC-coupling existing solar inverters is the simplest approach. The Victron MPPT charge controllers are designed for lower-voltage DC-coupled solar, so if your existing panels are in higher-voltage strings they may not be a good fit for the MPPT. Keeping your current solar inverters feeding into one of the consumer units works well — the ESS will see the solar production as reduced grid import.

### Can I use the battery as a UPS for critical loads?

It depends on your layout. In my setup, the grid comes in at the front of the house and the inverter is in the garage (Grid > Load > Inverter), so using AC-OUT as a UPS for the house wasn't feasible. However, if your inverter is near critical loads (e.g. a server/network cabinet in the same garage), you could wire those loads off AC-OUT1. If the grid drops, the inverter keeps those loads running from the battery.

---

## Configuration & Troubleshooting

### My Cerbo GX reports "grid failure" even though the MultiPlus is connected to mains — what's wrong?

If the ESS Assistant shows mains frequency, voltage and current, the MP-II can see the grid — it's likely **rejecting** it rather than not seeing it. Common causes:

- **Grid code:** Check it's set to UK G99 in VEConfigure. Wrong country code = wrong frequency/voltage tolerances.
- **Firmware:** Make sure both the MP-II and Cerbo GX are on the latest firmware. Older versions have had bugs causing grid rejection.
- **Grid metering:** Check whether the ESS grid metering setting matches your setup — "External meter" if you have an ET112/CT sensor, "Inverter/Charger" if you don't.
- **LOM (Loss of Mains) detection:** This anti-islanding feature can falsely trip if cable impedance between the grid and MP-II is high (long or thin cables). For UK it should be on Type B. There's a "Weak AC input" option in VEConfigure that can help.

The Victron Community forums (community.victronenergy.com) are the best place for troubleshooting specific configuration issues — there are people who have seen and solved pretty much everything.

---

## Useful Resources

- [Battery Payback Calculator](/battery-payback) — compare battery options with your actual usage data
- [Victron Community Forums](https://community.victronenergy.com/) — invaluable for troubleshooting and design advice
- [Octopus Forum](https://forum.octopus.energy/) — tariff-specific questions and automation ideas
- [Bimble Solar](https://www.bimblesolar.com/) — great for Victron hardware and advice
- [BottlecapDave's Octopus HA Integration](https://bottlecapdave.github.io/HomeAssistant-OctopusEnergy/) — foundation for Octopus automations in Home Assistant
- [Victron + HA + EMHASS Guide](https://community.home-assistant.io/t/victron-integrated-with-ha-and-emhass-my-single-guide/449530) — comprehensive HA integration guide
- [Victron + Octopus IOG Scheduling via MQTT](https://community.home-assistant.io/t/victron-integration-with-octopus-energy-automatic-iog-scheduling-via-mqtt/897087) — tfboy's IOG automation approach
- [Dynamic ESS for UK Octopus Users](https://community.victronenergy.com/t/dynamic-ess-for-uk-octopus-users-now-on-regular-vrm/3942)
- [HA + Victron via Modbus TCP](https://community.home-assistant.io/t/home-assistant-and-victron-gx-multiplus-ii-managing-your-battery-using-modbus-tcp/724762)
- [Venus OS Wiki](https://github.com/victronenergy/venus/wiki)
- [ET112 Installation Guide](https://www.victronenergy.com/media/pg/Energy_Meter_ET112/en/installation-and-configuration.html)
- [Fogstar 16.1kWh Datasheet](https://cdn.shopify.com/s/files/1/1347/0997/files/FogstarEnergy_16.1kWh_Battery_compressed.pdf)