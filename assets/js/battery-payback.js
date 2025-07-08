// Battery Payback Calculator JS
// This script processes a CSV file and computes battery savings/payback stats

// === Config (defaults, will be overwritten by form) ===
let CHEAP_RATE = 0.07;
let PEAK_RATE = 0.29;
let PEAK_START = {hour: 5, min: 30};
let PEAK_END = {hour: 23, min: 30};
let INVERTER_COST = 1270;
let EXTRAS_COST = 80;
let INSTALL_COST = 2000;
let FIXED_COSTS = INVERTER_COST + EXTRAS_COST + INSTALL_COST;
let BATTERY_USABLE_FACTOR = 0.9;
let INVERTER_LIMIT_KW = (5000 * 0.97) / 1000;
let ANNUAL_USAGE_GROWTH = 1; // percent, default
let BATTERIES = [
    {
        name: "16.1kWh @ £2450",
        capacity_kwh: 16.1,
        warranty_years: 10,
        battery_only_cost: 2450,
        rated_cycles: 8000
    },
    {
        name: "16.1kWh @ £1750",
        capacity_kwh: 16.1,
        warranty_years: 6,
        battery_only_cost: 1750,
        rated_cycles: 8000
    },
    {
        name: "32kWh @ £3500",
        capacity_kwh: 32.1,
        warranty_years: 10,
        battery_only_cost: 3500,
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
        {cap: 'BAT1_CAP', war: 'BAT1_WARRANTY', cost: 'BAT1_COST', cyc: 'BAT1_CYCLES'},
        {cap: 'BAT2_CAP', war: 'BAT2_WARRANTY', cost: 'BAT2_COST', cyc: 'BAT2_CYCLES'},
        {cap: 'BAT3_CAP', war: 'BAT3_WARRANTY', cost: 'BAT3_COST', cyc: 'BAT3_CYCLES'},
        {cap: 'BAT4_CAP', war: 'BAT4_WARRANTY', cost: 'BAT4_COST', cyc: 'BAT4_CYCLES'}
    ];
    return batFields.map((fields, idx) => {
        const capacity = parseFloat(document.getElementById(fields.cap).value);
        const warranty = parseInt(document.getElementById(fields.war).value);
        const cost = parseFloat(document.getElementById(fields.cost).value);
        const cycles = parseInt(document.getElementById(fields.cyc).value);
        if ([capacity, warranty, cost, cycles].some(value => isNaN(value) || value < 0)) return null;
        return {
            name: `${capacity}kWh @ £${cost}`,
            capacity_kwh: capacity,
            warranty_years: warranty,
            battery_only_cost: cost,
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

        INVERTER_COST = parseFloat(document.getElementById('INVERTER_COST').value);
        EXTRAS_COST = parseFloat(document.getElementById('EXTRAS_COST').value);
        INSTALL_COST = parseFloat(document.getElementById('INSTALL_COST').value);
        if ([INVERTER_COST, EXTRAS_COST, INSTALL_COST].some(value => isNaN(value) || value < 0)) throw new Error('Invalid fixed costs');
        FIXED_COSTS = INVERTER_COST + EXTRAS_COST + INSTALL_COST;

        const inverterLimitVA = parseFloat(document.getElementById('INVERTER_LIMIT_VA').value);
        const inverterEfficiency = parseFloat(document.getElementById('INVERTER_EFFICIENCY').value);
        if (isNaN(inverterLimitVA) || inverterLimitVA < 0 || isNaN(inverterEfficiency) || inverterEfficiency <= 0 || inverterEfficiency > 1) throw new Error('Invalid inverter limit/efficiency');
        INVERTER_LIMIT_KW = (inverterLimitVA * inverterEfficiency) / 1000;

        BATTERY_USABLE_FACTOR = parseFloat(document.getElementById('BATTERY_USABLE_FACTOR').value);
        if (isNaN(BATTERY_USABLE_FACTOR) || BATTERY_USABLE_FACTOR < 0 || BATTERY_USABLE_FACTOR > 1) throw new Error('Invalid battery usable factor');
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
    const totalBatteryCost = battery.battery_only_cost + FIXED_COSTS;
    const usableCapacity = +(battery.capacity_kwh * BATTERY_USABLE_FACTOR).toFixed(2);
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
    const usable = battery.capacity_kwh * BATTERY_USABLE_FACTOR;
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
    const usable = battery.capacity_kwh * BATTERY_USABLE_FACTOR;
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

function modelBatteryEconomics(batteries, data) {
    return batteries.map(battery => {
        const totalCost = battery.battery_only_cost + FIXED_COSTS;
        const savingStats = batterySavings(battery, data);
        const netSavingsWarranty = +(savingStats.savings_over_warranty - totalCost).toFixed(2);
        const annualBatteryEmptyDays = batteryEmptyDays(battery, data);
        const annualBatteryCycles = calculateBatteryCycles(battery, data);
        const savingsOverLifetime = annualBatteryCycles > 0 ? +((battery.rated_cycles / annualBatteryCycles) * savingStats.first_year_savings).toFixed(2) : 0;
        return {
            name: battery.name,
            total_cost: totalCost,
            first_year_savings: savingStats.first_year_savings,
            warranty_years: battery.warranty_years,
            savings_over_warranty: savingStats.savings_over_warranty,
            net_savings_warranty: netSavingsWarranty,
            payback_years: savingStats.payback_years,
            annual_battery_empty_days: annualBatteryEmptyDays,
            annual_battery_cycles: annualBatteryCycles,
            savings_over_lifetime: savingsOverLifetime
        };
    });
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
    let daysAbove5 = 0, daysAbove10 = 0, daysAbove15 = 0, daysAbove20 = 0;
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
    });
    const avgDaily = daysAnalysed ? totalUsage / daysAnalysed : 0;
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
        maxDaily: +maxDaily.toFixed(2),
        minDaily: +minDaily.toFixed(2)
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
    document.getElementById('usageStatsMaxDaily').textContent = stats.maxDaily + ' kWh';
    document.getElementById('usageStatsMinDaily').textContent = stats.minDaily + ' kWh';
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
        row.innerHTML = `
            <div class="results-cell">${result.name}</div>
            <div class="results-cell">£${result.total_cost}</div>
            <div class="results-cell">£${result.first_year_savings}</div>
            <div class="results-cell">${result.warranty_years}</div>
            <div class="results-cell">£${result.savings_over_warranty}</div>
            <div class="results-cell">£${result.net_savings_warranty}</div>
            <div class="results-cell">${result.payback_years}</div>
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
