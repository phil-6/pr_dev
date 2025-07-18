// Battery Payback Calculator JS
// This script processes a CSV file and computes battery savings/payback stats

// === Config (defaults, will be overwritten by form) ===
let CHEAP_RATE = 0.07;
let PEAK_RATE = 0.29;
let PEAK_START = {hour: 5, min: 30};
let PEAK_END = {hour: 23, min: 30};
let ANNUAL_USAGE_GROWTH = 1; // percent, default
let BATTERIES = [
    {
        name: "16.1kWh @ £2450",
        capacity_kwh: 16.1,
        warranty_years: 10,
        battery_only_cost: 2450,
        extra_cost: 2800,
        rated_cycles: 8000
    },
    {
        name: "16.1kWh @ £1750",
        capacity_kwh: 16.1,
        warranty_years: 6,
        battery_only_cost: 1750,
        extra_cost: 2800,
        rated_cycles: 8000
    },
    {
        name: "32kWh @ £3500",
        capacity_kwh: 32.1,
        warranty_years: 10,
        battery_only_cost: 3500,
        extra_cost: 3500,
        rated_cycles: 6000
    }
];

// CSV parsing helper (simple, expects headers: Start, Consumption (kwh))
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(header => header.trim());
    if (!validateCSVHeaders(headers)) {
        throw new Error('Invalid CSV headers. Expected: "Consumption (kwh), Start"');
    }
    return lines.slice(1).map(line => {
        const columns = line.split(',');
        const row = {};
        headers.forEach((header, index) => row[header] = columns[index]);
        return row;
    }).filter(row => row['Start'].trimStart() && row['Consumption (kwh)'].trim() && !isNaN(parseFloat(row['Consumption (kwh)'])));
}

function validateCSVHeaders(headers) {
    const requiredHeaders = ['Consumption (kwh)', 'Start'];
    return requiredHeaders.every(requiredHeader => headers.includes(requiredHeader));
}

function parseTime(timeString) {
    const date = new Date(timeString);
    if (!isNaN(date)) return date;
    const [hour, minute] = timeString.split(':').map(Number);
    const now = new Date();
    now.setHours(hour, minute, 0, 0);
    return now;
}

function processCSV(fileContent) {
    try {
        const rows = parseCSV(fileContent);
        return rows.map(row => ({
            kwh: parseFloat(row['Consumption (kwh)'].trim()),
            timestamp: parseTime(row['Start'].trimStart())
        })).filter(row => !isNaN(row.kwh) && row.timestamp instanceof Date);
    } catch (error) {
        console.error('Error processing CSV:', error.message);
        throw new Error('Failed to process CSV file. Please check the format and data.');
    }
}

function parsePeakTime(timeString) {
    const [hour, minute] = timeString.split(":").map(Number);
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return {hour, min: minute};
}

function parseBatteriesFromForm() {
    const batFields = [
        {cap: 'BAT1_CAP', ah: 'BAT1_AH', chg: 'BAT1_CHG', dod: 'BAT1_DOD', war: 'BAT1_WARRANTY', cost: 'BAT1_COST', extra: 'BAT1_EXTRA', cyc: 'BAT1_CYCLES'},
        {cap: 'BAT2_CAP', ah: 'BAT2_AH', chg: 'BAT2_CHG', dod: 'BAT2_DOD', war: 'BAT2_WARRANTY', cost: 'BAT2_COST', extra: 'BAT2_EXTRA', cyc: 'BAT2_CYCLES'},
        {cap: 'BAT3_CAP', ah: 'BAT3_AH', chg: 'BAT3_CHG', dod: 'BAT3_DOD', war: 'BAT3_WARRANTY', cost: 'BAT3_COST', extra: 'BAT3_EXTRA', cyc: 'BAT3_CYCLES'},
        {cap: 'BAT4_CAP', ah: 'BAT4_AH', chg: 'BAT4_CHG', dod: 'BAT4_DOD', war: 'BAT4_WARRANTY', cost: 'BAT4_COST', extra: 'BAT4_EXTRA', cyc: 'BAT4_CYCLES'}
    ];
    return batFields.map((fields, idx) => {
        const capacity = parseFloat(document.getElementById(fields.cap).value);
        const capacity_ah = parseFloat(document.getElementById(fields.ah).value);
        const charger_rating = parseFloat(document.getElementById(fields.chg).value);
        const dod = parseFloat(document.getElementById(fields.dod).value) / 100;
        const warranty = parseInt(document.getElementById(fields.war).value);
        const cost = parseFloat(document.getElementById(fields.cost).value);
        const extra = parseFloat(document.getElementById(fields.extra).value);
        const cycles = parseInt(document.getElementById(fields.cyc).value);
        if ([capacity, capacity_ah, charger_rating, dod, warranty, cost, extra, cycles].some(value => isNaN(value) || value < 0)) return null;
        return {
            name: `${capacity}kWh @ £${cost}`,
            capacity_kwh: capacity,
            capacity_ah: capacity_ah,
            charger_rating: charger_rating,
            dod: dod,
            warranty_years: warranty,
            battery_only_cost: cost,
            extra_costs: extra,
            rated_cycles: cycles
        };
    }).filter(battery => battery);
}

function updateConstantsFromForm() {
    const errorElement = document.getElementById('formError');
    errorElement.textContent = '';
    try {
        CHEAP_RATE = parseFloat(document.getElementById('CHEAP_RATE').value);
        PEAK_RATE = parseFloat(document.getElementById('PEAK_RATE').value);
        if (isNaN(CHEAP_RATE) || isNaN(PEAK_RATE) || CHEAP_RATE < 0 || PEAK_RATE < 0) throw new Error('Invalid tariff rates');

        const peakStartString = document.getElementById('PEAK_START').value;
        const peakEndString = document.getElementById('PEAK_END').value;
        PEAK_START = parsePeakTime(peakStartString);
        PEAK_END = parsePeakTime(peakEndString);
        if (!PEAK_START || !PEAK_END) throw new Error('Invalid peak time format');

        const batteries = parseBatteriesFromForm();
        if (batteries.length === 0) throw new Error('Invalid battery configuration(s)');
        BATTERIES = batteries;

        ANNUAL_USAGE_GROWTH = parseFloat(document.getElementById('ANNUAL_USAGE_GROWTH').value);
        if (isNaN(ANNUAL_USAGE_GROWTH) || ANNUAL_USAGE_GROWTH < 0 || ANNUAL_USAGE_GROWTH > 20) throw new Error('Invalid annual usage growth');

        return true;
    } catch (error) {
        errorElement.textContent = error.message;
        displayError(error.message);
        return false;
    }
}

function displayError(message) {
    let errorDiv = document.getElementById('formErrorBottom');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'formErrorBottom';
        errorDiv.className = 'error';
        document.getElementById('constantsForm').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearError() {
    let errorDiv = document.getElementById('formErrorBottom');
    if (errorDiv) errorDiv.textContent = '';
}

function isPeakTime(date) {
    const hour = date.getHours(), minute = date.getMinutes();
    if (hour > PEAK_START.hour || (hour === PEAK_START.hour && minute >= PEAK_START.min)) {
        if (hour < PEAK_END.hour || (hour === PEAK_END.hour && minute < PEAK_END.min)) {
            return true;
        }
    }
    return false;
}

function adjustUsageData(data, year) {
    return data.map(entry => ({
        ...entry,
        kwh: entry.kwh * (1 + 0.01 * ANNUAL_USAGE_GROWTH * year)
    }));
}

function annualUsage(data, usable_battery_capacity) {
    // Group by date
    const byDay = {};
    data.forEach(entry => {
        const dateString = entry.timestamp.toISOString().slice(0, 10);
        if (!byDay[dateString]) byDay[dateString] = [];
        byDay[dateString].push(entry);
    });
    let batteryUsed = 0, gridPeak = 0, gridOffpeak = 0;
    Object.values(byDay).forEach(entries => {
        const peakKwh = entries.filter(entry => isPeakTime(entry.timestamp)).reduce((acc, entry) => acc + entry.kwh, 0);
        const offpeakKwh = entries.filter(entry => !isPeakTime(entry.timestamp)).reduce((acc, entry) => acc + entry.kwh, 0);
        const batteryDischarge = Math.min(peakKwh, usable_battery_capacity);
        gridPeak += peakKwh - batteryDischarge;
        gridOffpeak += offpeakKwh;
        batteryUsed += batteryDischarge;
    });
    return {
        battery_usage_kwh: +batteryUsed.toFixed(2),
        grid_peak_usage_kwh: +gridPeak.toFixed(2),
        grid_offpeak_usage_kwh: +gridOffpeak.toFixed(2)
    };
}

function baselineCost(data) {
    const peak = data.filter(entry => isPeakTime(entry.timestamp)).reduce((acc, entry) => acc + entry.kwh, 0);
    const offpeak = data.filter(entry => !isPeakTime(entry.timestamp)).reduce((acc, entry) => acc + entry.kwh, 0);
    return peak * PEAK_RATE + offpeak * CHEAP_RATE;
}

function batterySavings(battery, data) {
    const totalBatteryCost = battery.battery_only_cost + battery.extra_costs;
    const usableCapacity = +(battery.capacity_kwh * battery.dod).toFixed(2);
    let cumulativeSavings = 0, warrantySavings = 0, paybackYears = null, firstYearSavings = null;

    for (let year = 1; year <= battery.warranty_years || !paybackYears; year++) {
        const adjusted = adjustUsageData(data, year);
        const usage = annualUsage(adjusted, usableCapacity);
        const chargingCost = usage.battery_usage_kwh * CHEAP_RATE;
        const gridPeakCost = usage.grid_peak_usage_kwh * PEAK_RATE;
        const gridOffpeakCost = usage.grid_offpeak_usage_kwh * CHEAP_RATE;
        const totalRunCost = chargingCost + gridPeakCost + gridOffpeakCost;
        const baseCost = baselineCost(data);
        const annualSavings = baseCost - totalRunCost;
        if (year === 1) firstYearSavings = annualSavings;
        cumulativeSavings += annualSavings;
        if (year <= battery.warranty_years) warrantySavings = cumulativeSavings;
            console.log(`Battery Name: ${battery.name}, Year: ${year}, Annual Savings: £${annualSavings.toFixed(2)}, Cumulative Savings: £${cumulativeSavings.toFixed(2)}`);
        if (!paybackYears && cumulativeSavings >= totalBatteryCost) {
            const previous = cumulativeSavings - annualSavings;
            const fraction = (totalBatteryCost - previous) / annualSavings;
            paybackYears = year - 1 + fraction;
            if (year > battery.warranty_years) break;
        }
        if (year >= battery.warranty_years && paybackYears) break;
        if (year > 100) break;
    }
    return {
        payback_years: paybackYears ? +paybackYears.toFixed(2) : 'N/A',
        first_year_savings: +(firstYearSavings || 0).toFixed(2),
        savings_over_warranty: +warrantySavings.toFixed(2)
    };
}

function batteryEmptyDays(battery, data) {
    const usable = battery.capacity_kwh * battery.dod;
    // Group by day
    const byDay = {};
    data.forEach(entry => {
        const dateString = entry.timestamp.toISOString().slice(0, 10);
        if (!byDay[dateString]) byDay[dateString] = [];
        byDay[dateString].push(entry);
    });
    let count = 0;
    Object.values(byDay).forEach(entries => {
        const peakKwh = entries.filter(entry => isPeakTime(entry.timestamp)).reduce((acc, entry) => acc + entry.kwh, 0);
        if (peakKwh > usable) count++;
    });
    return count;
}

function calculateBatteryCycles(battery, data) {
    const usable = battery.capacity_kwh * battery.dod;
    let cumulative = 0, cycles = 0;
    data.forEach(entry => {
        if (!isPeakTime(entry.timestamp)) return;
        const discharge = Math.min(entry.kwh, usable - cumulative);
        cumulative += discharge;
        if (cumulative >= usable) {
            cycles++;
            cumulative -= usable;
        }
    });
    return cycles;
}

function calculateChargeTimeVsOffpeak(battery, peak_start, peak_end) {
    // Calculate charge time in hours (factoring DoD and 2.5% inefficiency)
    const ah = battery.capacity_ah;
    const charger_a = battery.charger_rating;
    const dod = battery.dod;
    if (!ah || !charger_a || charger_a === 0 || !dod) return {chargeTime: null, offpeakHours: null, warning: 'N/A'};
    const charge_time = (ah * dod) / charger_a / 0.975;
    // Calculate off-peak window duration in hours
    let start = peak_end.hour + peak_end.min / 60;
    let end = peak_start.hour + peak_start.min / 60;
    let offpeak_hours = (end > start) ? (24 - start + end) : (end - start);
    if (offpeak_hours <= 0) offpeak_hours += 24;
    // If offpeak window is 0, fallback to 0
    offpeak_hours = Math.round(offpeak_hours * 100) / 100;
    const warning = charge_time > offpeak_hours ? '⚠️ Too long for off-peak window' : '';
    return {
        chargeTime: Math.round(charge_time * 100) / 100,
        offpeakHours: offpeak_hours,
        warning
    };
}

function modelBatteryEconomics(batteries, data) {
    return batteries.map(battery => {
        const totalCost = battery.battery_only_cost + battery.extra_costs;
        const savingStats = batterySavings(battery, data);
        const netSavingsWarranty = +(savingStats.savings_over_warranty - totalCost).toFixed(2);
        const annualBatteryEmptyDays = batteryEmptyDays(battery, data);
        const annualBatteryCycles = calculateBatteryCycles(battery, data);
        const savingsOverLifetime = annualBatteryCycles > 0 ? +((battery.rated_cycles / annualBatteryCycles) * savingStats.first_year_savings).toFixed(2) : 0;
        const chargeInfo = calculateChargeTimeVsOffpeak(
            battery,
            PEAK_START,
            PEAK_END
        );
        return {
            name: battery.name,
            total_cost: totalCost,
            first_year_savings: savingStats.first_year_savings,
            warranty_years: battery.warranty_years,
            savings_over_warranty: savingStats.savings_over_warranty,
            net_savings_warranty: netSavingsWarranty,
            payback_years: savingStats.payback_years,
            charge_time_vs_offpeak: chargeInfo,
            annual_battery_empty_days: annualBatteryEmptyDays,
            annual_battery_cycles: annualBatteryCycles,
            savings_over_lifetime: savingsOverLifetime
        };
    });
}

function calculateMaxHourlyUsages(data) {
    // Group by day
    const byDay = {};
    data.forEach(entry => {
        const dateString = entry.timestamp.toISOString().slice(0, 10);
        if (!byDay[dateString]) byDay[dateString] = [];
        byDay[dateString].push(entry);
    });
    let hourlyUsages = [];
    Object.values(byDay).forEach(entries => {
        for (let i = 0; i < entries.length - 1; i++) {
            const sum = entries[i].kwh + entries[i + 1].kwh;
            hourlyUsages.push(+sum.toFixed(4));
        }
    });
    // Max hourly usage
    let maxHourly = hourlyUsages.length ? Math.max(...hourlyUsages) : 0;
    // Find the max hourly usage that occurs more than X times
    const freq = {};
    hourlyUsages.forEach(val => {
        freq[val] = (freq[val] || 0) + 1;
    });
    let maxHourly5 = 0, maxHourly10 = 0, maxHourly20 = 0;
    Object.entries(freq).forEach(([val, count]) => {
        if (count > 5 && +val > maxHourly5) maxHourly5 = +val;
        if (count > 10 && +val > maxHourly10) maxHourly10 = +val;
        if (count > 20 && +val > maxHourly20) maxHourly20 = +val;
    });
    return {
        maxHourly: +maxHourly.toFixed(3),
        maxHourly5: +maxHourly5.toFixed(3),
        maxHourly10: +maxHourly10.toFixed(3),
        maxHourly20: +maxHourly20.toFixed(3)
    };
}

function calculateUsageStats(data) {
    // Group by day
    const byDay = {};
    data.forEach(entry => {
        const dateString = entry.timestamp.toISOString().slice(0, 10);
        if (!byDay[dateString]) byDay[dateString] = [];
        byDay[dateString].push(entry);
    });
    const daysAnalysed = Object.keys(byDay).length;
    let totalUsage = 0, totalPeak = 0, totalOffpeak = 0;
    let maxDaily = -Infinity, minDaily = Infinity;
    let daysAbove5 = 0, daysAbove10 = 0, daysAbove15 = 0, daysAbove20 = 0, daysAbove30 = 0;
    Object.values(byDay).forEach(entries => {
        let dailyTotal = 0, dailyPeak = 0;
        entries.forEach(entry => {
            dailyTotal += entry.kwh;
            if (isPeakTime(entry.timestamp)) dailyPeak += entry.kwh;
        });
        const dailyOffpeak = dailyTotal - dailyPeak;
        totalUsage += dailyTotal;
        totalPeak += dailyPeak;
        totalOffpeak += dailyOffpeak;
        if (dailyTotal > maxDaily) maxDaily = dailyTotal;
        if (dailyTotal < minDaily) minDaily = dailyTotal;
        if (dailyPeak > 5) daysAbove5++;
        if (dailyPeak > 10) daysAbove10++;
        if (dailyPeak > 15) daysAbove15++;
        if (dailyPeak > 20) daysAbove20++;
        if (dailyTotal > 30) daysAbove30++;
    });
    const avgDaily = daysAnalysed ? totalUsage / daysAnalysed : 0;
    // Use the extracted function for max hourly usages
    const { maxHourly, maxHourly5, maxHourly10, maxHourly20 } = calculateMaxHourlyUsages(data);
    return {
        daysAnalysed,
        avgDaily: +avgDaily.toFixed(2),
        totalUsage: +totalUsage.toFixed(2),
        totalPeak: +totalPeak.toFixed(2),
        totalOffpeak: +totalOffpeak.toFixed(2),
        daysAbove5,
        daysAbove10,
        daysAbove15,
        daysAbove20,
        daysAbove30,
        maxDaily: +maxDaily.toFixed(2),
        minDaily: +minDaily.toFixed(2),
        maxHourly,
        maxHourly5,
        maxHourly10,
        maxHourly20
    };
}

function showUsageStats(stats) {
    const statsDiv = document.getElementById('usageStats');
    if (!statsDiv) return;
    statsDiv.classList.remove('hidden');
    document.getElementById('usageStatsDaysAnalysed').textContent = stats.daysAnalysed;
    document.getElementById('usageStatsAvgDaily').textContent = stats.avgDaily + ' kWh';
    document.getElementById('usageStatsTotalUsage').textContent = stats.totalUsage + ' kWh';
    document.getElementById('usageStatsTotalPeak').textContent = stats.totalPeak + ' kWh';
    document.getElementById('usageStatsTotalOffpeak').textContent = stats.totalOffpeak + ' kWh';
    document.getElementById('usageStatsDaysAbove5').textContent = stats.daysAbove5;
    document.getElementById('usageStatsDaysAbove10').textContent = stats.daysAbove10;
    document.getElementById('usageStatsDaysAbove15').textContent = stats.daysAbove15;
    document.getElementById('usageStatsDaysAbove20').textContent = stats.daysAbove20;
    document.getElementById('usageStatsDaysAbove30').textContent = stats.daysAbove30;
    document.getElementById('usageStatsMaxDaily').textContent = stats.maxDaily + ' kWh';
    document.getElementById('usageStatsMinDaily').textContent = stats.minDaily + ' kWh';
    document.getElementById('usageStatsMaxHourly').textContent = stats.maxHourly + ' kWh';
    if(document.getElementById('usageStatsMaxHourly5'))
      document.getElementById('usageStatsMaxHourly5').textContent = stats.maxHourly5 + ' kWh';
    if(document.getElementById('usageStatsMaxHourly10'))
      document.getElementById('usageStatsMaxHourly10').textContent = stats.maxHourly10 + ' kWh';
    document.getElementById('usageStatsMaxHourly20').textContent = stats.maxHourly20 + ' kWh';
}

function showResults(results, usageStats) {
    showUsageStats(usageStats);
    const resultsDiv = document.getElementById('results');
    const resultsBody = document.getElementById('resultsBody');
    const noResults = document.getElementById('noResults');
    const workingMsg = document.getElementById('workingMsg');
    // Hide working message
    if (!workingMsg.classList.contains('hidden')) workingMsg.classList.add('hidden');
    resultsBody.innerHTML = '';
    if (!results.length) {
        resultsDiv.classList.remove('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    if (!noResults.classList.contains('hidden')) noResults.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    results.forEach(result => {
        const row = document.createElement('div');
        row.className = 'results-row';
        let chargeCell = '';
        if (result.charge_time_vs_offpeak.chargeTime !== null) {
            chargeCell = `${result.charge_time_vs_offpeak.chargeTime}h <br>(off-peak: ${result.charge_time_vs_offpeak.offpeakHours}h) <span class="charge-warning">${result.charge_time_vs_offpeak.warning}</span>`;
        } else {
            chargeCell = '<span class="charge-warning">N/A</span>';
        }
        row.innerHTML = `
            <div class="results-cell">${result.name}</div>
            <div class="results-cell">£${result.total_cost}</div>
            <div class="results-cell">£${result.first_year_savings}</div>
            <div class="results-cell">${result.warranty_years}</div>
            <div class="results-cell">£${result.savings_over_warranty}</div>
            <div class="results-cell">£${result.net_savings_warranty}</div>
            <div class="results-cell">${result.payback_years}</div>
            <div class="results-cell">${chargeCell}</div>
            <div class="results-cell">${result.annual_battery_empty_days}</div>
            <div class="results-cell">${result.annual_battery_cycles}</div>
            <div class="results-cell">£${result.savings_over_lifetime}</div>
        `;
        resultsBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const constantsForm = document.getElementById('constantsForm');
    constantsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearError();
        const resultsDiv = document.getElementById('results');
        const workingMsg = document.getElementById('workingMsg');
        const noResults = document.getElementById('noResults');
        resultsDiv.classList.add('hidden');
        workingMsg.classList.add('hidden');
        noResults.classList.add('hidden');
        document.getElementById('resultsBody').innerHTML = '';
        if (!updateConstantsFromForm()) return;
        const fileInput = document.getElementById('csvFile');
        if (!fileInput.files || fileInput.files.length === 0) {
            displayError('Please select a usage CSV file.');
            return;
        }
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const rows = parseCSV(evt.target.result);
                const data = rows.map(row => ({
                    kwh: parseFloat(row['Consumption (kwh)'].trim()),
                    timestamp: parseTime(row['Start'].trimStart())
                })).filter(row => !isNaN(row.kwh) && row.timestamp instanceof Date);

                if (!data.length) {
                    throw new Error('No valid data found in CSV.');
                }

                window._batteryModelData = data;
                const usageStats = calculateUsageStats(data);
                const results = modelBatteryEconomics(BATTERIES, data);
                showResults(results, usageStats);
            } catch (error) {
                console.error('Error processing CSV:', error.message);
                console.error(parseCSV(evt.target.result)[0]);
                displayError(error.message);
            } finally {
                workingMsg.classList.add('hidden');
            }
        };
        reader.onerror = () => {
            displayError('Failed to read the CSV file.');
            workingMsg.classList.add('hidden');
        };
        workingMsg.classList.remove('hidden');
        reader.readAsText(file);
    });
});
