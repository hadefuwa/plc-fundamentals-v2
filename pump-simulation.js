// Chart.js configurations and pump simulation logic
let charts = {};
let simIntervals = {};

// Common chart configuration
const commonConfig = {
    type: 'line',
    options: {
        responsive: true,
        animation: {
            duration: 0 // Disable animation for smoother real-time updates
        },
        scales: {
            x: {
                type: 'linear',
                display: true,
                title: {
                    display: true,
                    text: 'Time (s)',
                    color: '#aaa'
                },
                ticks: {
                    color: '#aaa'
                },
                grid: {
                    color: '#333'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Value',
                    color: '#aaa'
                },
                ticks: {
                    color: '#aaa'
                },
                grid: {
                    color: '#333'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#aaa'
                }
            }
        }
    }
};

// Initialize all charts when the page loads
function initializePumpSimulation() {
    // Initialize Centrifugal Pump Chart
    charts.centrifugal = new Chart(document.getElementById('centrifugal-chart'), {
        ...commonConfig,
        data: {
            datasets: [{
                label: 'Flow Rate (L/min)',
                data: [],
                borderColor: '#2196F3',
                tension: 0.4
            }, {
                label: 'Pressure (bar)',
                data: [],
                borderColor: '#FF5722',
                tension: 0.4
            }]
        }
    });

    // Initialize PD Pump Chart
    charts.pd = new Chart(document.getElementById('pd-chart'), {
        ...commonConfig,
        data: {
            datasets: [{
                label: 'Flow Rate (L/min)',
                data: [],
                borderColor: '#4CAF50',
                tension: 0.4
            }, {
                label: 'Pressure (bar)',
                data: [],
                borderColor: '#FF5722',
                tension: 0.4
            }]
        }
    });

    // Initialize Leak Chart
    charts.leak = new Chart(document.getElementById('leak-chart'), {
        ...commonConfig,
        data: {
            datasets: [{
                label: 'Flow Rate (L/min)',
                data: [],
                borderColor: '#FF5722',
                tension: 0.4
            }, {
                label: 'Power (kW)',
                data: [],
                borderColor: '#2196F3',
                tension: 0.4
            }]
        }
    });

    // Initialize Cavitation Chart
    charts.cavitation = new Chart(document.getElementById('cavitation-chart'), {
        ...commonConfig,
        data: {
            datasets: [{
                label: 'Pressure (bar)',
                data: [],
                borderColor: '#9C27B0',
                tension: 0.4
            }, {
                label: 'Vibration',
                data: [],
                borderColor: '#FF9800',
                tension: 0.4
            }]
        }
    });

    // Initialize Overheat Chart
    charts.overheat = new Chart(document.getElementById('overheat-chart'), {
        ...commonConfig,
        data: {
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: '#F44336',
                tension: 0.4
            }, {
                label: 'Efficiency (%)',
                data: [],
                borderColor: '#4CAF50',
                tension: 0.4
            }]
        }
    });

    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Centrifugal Pump Controls
    document.getElementById('start-centrifugal').addEventListener('click', startCentrifugalPump);
    document.getElementById('stop-centrifugal').addEventListener('click', () => stopPump('centrifugal'));

    // PD Pump Controls
    document.getElementById('start-pd').addEventListener('click', startPDPump);
    document.getElementById('stop-pd').addEventListener('click', () => stopPump('pd'));

    // Issue Simulation Controls
    document.getElementById('start-leak').addEventListener('click', simulateLeak);
    document.getElementById('reset-leak').addEventListener('click', () => resetIssue('leak'));

    document.getElementById('start-cavitation').addEventListener('click', simulateCavitation);
    document.getElementById('reset-cavitation').addEventListener('click', () => resetIssue('cavitation'));

    document.getElementById('start-overheat').addEventListener('click', simulateOverheat);
    document.getElementById('reset-overheat').addEventListener('click', () => resetIssue('overheat'));
}

// Pump simulation functions
function startCentrifugalPump() {
    clearInterval(simIntervals.centrifugal);
    let time = 0;
    let flowRate = 0;
    let pressure = 0;

    simIntervals.centrifugal = setInterval(() => {
        time += 0.1;
        
        // Centrifugal pump characteristics: flow rate decreases as pressure increases
        if (flowRate < 100) flowRate += 2;
        if (pressure < 3) pressure += 0.1;
        
        // Inverse relationship between flow and pressure
        const adjustedFlow = flowRate * (1 - (pressure / 10));

        updateChart('centrifugal', time, [adjustedFlow, pressure]);
    }, 100);
}

function startPDPump() {
    clearInterval(simIntervals.pd);
    let time = 0;
    let flowRate = 0;
    let pressure = 0;

    simIntervals.pd = setInterval(() => {
        time += 0.1;
        
        // PD pump characteristics: constant flow rate regardless of pressure
        if (flowRate < 50) flowRate += 1;
        if (pressure < 8) pressure += 0.2;

        updateChart('pd', time, [flowRate, pressure]);
    }, 100);
}

function simulateLeak() {
    clearInterval(simIntervals.leak);
    let time = 0;
    let flowRate = 100;
    let power = 2.5;

    simIntervals.leak = setInterval(() => {
        time += 0.1;
        
        // Simulate leak: flow rate decreases while power stays high
        if (flowRate > 40) flowRate -= 0.5;
        if (power < 3) power += 0.01;

        updateChart('leak', time, [flowRate, power]);
    }, 100);
}

function simulateCavitation() {
    clearInterval(simIntervals.cavitation);
    let time = 0;
    let pressure = 3;
    let vibration = 0.2;

    simIntervals.cavitation = setInterval(() => {
        time += 0.1;
        
        // Simulate cavitation: pressure fluctuations and increased vibration
        pressure = 3 + Math.sin(time * 2) * 0.5;
        if (vibration < 1) vibration += 0.01;

        updateChart('cavitation', time, [pressure, vibration]);
    }, 100);
}

function simulateOverheat() {
    clearInterval(simIntervals.overheat);
    let time = 0;
    let temperature = 40;
    let efficiency = 95;

    simIntervals.overheat = setInterval(() => {
        time += 0.1;
        
        // Simulate overheating: temperature rises, efficiency drops
        if (temperature < 85) temperature += 0.3;
        if (efficiency > 60) efficiency -= 0.2;

        updateChart('overheat', time, [temperature, efficiency]);
    }, 100);
}

// Helper functions
function updateChart(chartId, time, values) {
    const chart = charts[chartId];
    
    // Keep only last 50 data points for better performance
    if (chart.data.datasets[0].data.length > 50) {
        chart.data.datasets.forEach(dataset => {
            dataset.data.shift();
        });
    }

    // Add new data points
    values.forEach((value, index) => {
        chart.data.datasets[index].data.push({x: time, y: value});
    });

    chart.update('none'); // Update without animation for better performance
}

function stopPump(pumpType) {
    clearInterval(simIntervals[pumpType]);
}

function resetIssue(issueType) {
    clearInterval(simIntervals[issueType]);
    charts[issueType].data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    charts[issueType].update();
}

// Initialize when the script loads
if (document.readyState === 'complete') {
    initializePumpSimulation();
} else {
    window.addEventListener('load', initializePumpSimulation);
} 