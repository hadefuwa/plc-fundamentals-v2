// Chart.js configurations and pump simulation logic
let charts = {};
let simIntervals = {};

// Initialize all charts when the page loads
function initializePumpSimulation() {
    console.log('Initializing pump simulation...');

    // Destroy existing charts if they exist
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    charts = {};

    // Clear any existing intervals
    Object.values(simIntervals).forEach(interval => {
        clearInterval(interval);
    });
    simIntervals = {};

    // Common chart configuration
    const commonConfig = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Disable animation for smoother real-time updates
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#aaa',
                        font: {
                            size: 12
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#555',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    intersect: false,
                    mode: 'index'
                }
            }
        }
    };

    try {
        // Initialize Centrifugal Pump Chart
        const centrifugalCtx = document.getElementById('centrifugal-chart');
        if (!centrifugalCtx) {
            console.error('Centrifugal chart canvas not found!');
            return;
        }
        
        charts.centrifugal = new Chart(centrifugalCtx, Object.assign({}, commonConfig, {
            data: {
                datasets: [{
                    label: 'Flow Rate (L/min)',
                    data: [],
                    borderColor: '#4CAF50',  // Green for flow rate
                    tension: 0.4
                }, {
                    label: 'Pressure (bar)',
                    data: [],
                    borderColor: '#FF5722',  // Orange for pressure
                    tension: 0.4
                }]
            },
            options: {
                ...commonConfig.options,
                scales: {
                    x: {
                        type: 'linear',
                        display: true,
                        min: 0,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Time (s)',
                            color: '#aaa',
                            font: { size: 14 }
                        },
                        ticks: { color: '#aaa', maxTicksLimit: 8 },
                        grid: { color: '#333', drawBorder: false }
                    },
                    y: {
                        display: true,
                        min: 0,
                        max: 50,  // Adjusted to better show flow rate and low pressure
                        title: {
                            display: true,
                            text: 'Flow Rate (L/min) / Pressure (bar)',
                            color: '#aaa',
                            font: { size: 14 }
                        },
                        ticks: { color: '#aaa', padding: 10 },
                        grid: { color: '#333', drawBorder: false }
                    }
                }
            }
        }));

        // Initialize PD Pump Chart
        const pdCtx = document.getElementById('pd-chart');
        if (!pdCtx) {
            console.error('PD chart canvas not found!');
            return;
        }

        charts.pd = new Chart(pdCtx, Object.assign({}, commonConfig, {
            data: {
                datasets: [{
                    label: 'Flow Rate (L/min)',
                    data: [],
                    borderColor: '#4CAF50',  // Same green for flow rate
                    tension: 0.4
                }, {
                    label: 'Pressure (bar)',
                    data: [],
                    borderColor: '#FF5722',  // Same orange for pressure
                    tension: 0.4
                }]
            },
            options: {
                ...commonConfig.options,
                scales: {
                    x: {
                        type: 'linear',
                        display: true,
                        min: 0,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Time (s)',
                            color: '#aaa',
                            font: { size: 14 }
                        },
                        ticks: { color: '#aaa', maxTicksLimit: 8 },
                        grid: { color: '#333', drawBorder: false }
                    },
                    y: {
                        display: true,
                        min: 0,
                        max: 120,  // Adjusted to show high pressure
                        title: {
                            display: true,
                            text: 'Flow Rate (L/min) / Pressure (bar)',
                            color: '#aaa',
                            font: { size: 14 }
                        },
                        ticks: { color: '#aaa', padding: 10 },
                        grid: { color: '#333', drawBorder: false }
                    }
                }
            }
        }));

        // Initialize Leak Chart
        const leakCtx = document.getElementById('leak-chart');
        if (leakCtx) {
            charts.leak = new Chart(leakCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Flow Rate (L/min)',
                        data: [],
                        borderColor: '#FF5722',
                        tension: 0.4,
                        yAxisID: 'y-flow'
                    }, {
                        label: 'Power (kW)',
                        data: [],
                        borderColor: '#2196F3',
                        tension: 0.4,
                        yAxisID: 'y-power'
                    }]
                },
                options: {
                    ...commonConfig.options,
                    scales: {
                        x: {
                            type: 'linear',
                            display: true,
                            min: 0,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Time (s)',
                                color: '#aaa',
                                font: { size: 14 }
                            },
                            ticks: { color: '#aaa', maxTicksLimit: 8 },
                            grid: { color: '#333', drawBorder: false }
                        },
                        'y-flow': {
                            display: true,
                            min: 0,
                            max: 100,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Flow Rate (L/min)',
                                color: '#FF5722',
                                font: { size: 14 }
                            },
                            ticks: { 
                                color: '#aaa', 
                                padding: 10,
                                callback: function(value) {
                                    return value + ' L/min';
                                }
                            },
                            grid: { color: '#333', drawBorder: false }
                        },
                        'y-power': {
                            display: true,
                            min: 0,
                            max: 50,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Power (kW)',
                                color: '#2196F3',
                                font: { size: 14 }
                            },
                            ticks: { 
                                color: '#aaa', 
                                padding: 10,
                                callback: function(value) {
                                    return value + ' kW';
                                }
                            },
                            grid: { 
                                color: '#333', 
                                drawBorder: false,
                                drawOnChartArea: false // Only show grid lines for left axis
                            }
                        }
                    }
                }
            }));
        }

        // Initialize Cavitation Chart
        const cavitationCtx = document.getElementById('cavitation-chart');
        if (cavitationCtx) {
            charts.cavitation = new Chart(cavitationCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Pressure (bar)',
                        data: [],
                        borderColor: '#9C27B0',
                        tension: 0.4
                    }, {
                        label: 'Vibration (mm/s)',
                        data: [],
                        borderColor: '#FF9800',
                        tension: 0.4
                    }]
                },
                options: {
                    ...commonConfig.options,
                    scales: {
                        x: {
                            type: 'linear',
                            display: true,
                            min: 0,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Time (s)',
                                color: '#aaa',
                                font: { size: 14 }
                            },
                            ticks: { color: '#aaa', maxTicksLimit: 8 },
                            grid: { color: '#333', drawBorder: false }
                        },
                        y: {
                            display: true,
                            min: 0,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Pressure (bar) / Vibration (mm/s)',
                                color: '#aaa',
                                font: { size: 14 }
                            },
                            ticks: { color: '#aaa', padding: 10 },
                            grid: { color: '#333', drawBorder: false }
                        }
                    }
                }
            }));
        }

        // Initialize Overheat Chart
        const overheatCtx = document.getElementById('overheat-chart');
        if (overheatCtx) {
            charts.overheat = new Chart(overheatCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: [],
                        borderColor: '#F44336',
                        tension: 0.4,
                        yAxisID: 'y-temp'
                    }, {
                        label: 'Efficiency (%)',
                        data: [],
                        borderColor: '#4CAF50',
                        tension: 0.4,
                        yAxisID: 'y-efficiency'
                    }]
                },
                options: {
                    ...commonConfig.options,
                    scales: {
                        x: {
                            type: 'linear',
                            display: true,
                            min: 0,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Time (s)',
                                color: '#aaa',
                                font: { size: 14 }
                            },
                            ticks: { color: '#aaa', maxTicksLimit: 8 },
                            grid: { color: '#333', drawBorder: false }
                        },
                        'y-temp': {
                            display: true,
                            min: 0,
                            max: 140,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Temperature (°C)',
                                color: '#F44336',
                                font: { size: 14 }
                            },
                            ticks: { 
                                color: '#aaa', 
                                padding: 10,
                                callback: function(value) {
                                    return value + '°C';
                                }
                            },
                            grid: { color: '#333', drawBorder: false }
                        },
                        'y-efficiency': {
                            display: true,
                            min: 0,
                            max: 100,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Efficiency (%)',
                                color: '#4CAF50',
                                font: { size: 14 }
                            },
                            ticks: { 
                                color: '#aaa', 
                                padding: 10,
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            grid: { 
                                color: '#333', 
                                drawBorder: false,
                                drawOnChartArea: false // Only show grid lines for left axis
                            }
                        }
                    }
                }
            }));
        }

        // Set up event listeners
        setupEventListeners();
        console.log('Pump simulation initialized successfully!');
    } catch (error) {
        console.error('Error initializing pump simulation:', error);
    }
}

function setupEventListeners() {
    try {
        // Centrifugal Pump Controls
        const startCentrifugalBtn = document.getElementById('start-centrifugal');
        const stopCentrifugalBtn = document.getElementById('stop-centrifugal');
        if (startCentrifugalBtn && stopCentrifugalBtn) {
            startCentrifugalBtn.addEventListener('click', startCentrifugalPump);
            stopCentrifugalBtn.addEventListener('click', () => stopPump('centrifugal'));
        }

        // PD Pump Controls
        const startPdBtn = document.getElementById('start-pd');
        const stopPdBtn = document.getElementById('stop-pd');
        if (startPdBtn && stopPdBtn) {
            startPdBtn.addEventListener('click', startPDPump);
            stopPdBtn.addEventListener('click', () => stopPump('pd'));
        }

        // Issue Simulation Controls
        const startLeakBtn = document.getElementById('start-leak');
        const resetLeakBtn = document.getElementById('reset-leak');
        if (startLeakBtn && resetLeakBtn) {
            startLeakBtn.addEventListener('click', simulateLeak);
            resetLeakBtn.addEventListener('click', () => resetChart('leak'));
        }

        const startCavitationBtn = document.getElementById('start-cavitation');
        const resetCavitationBtn = document.getElementById('reset-cavitation');
        if (startCavitationBtn && resetCavitationBtn) {
            startCavitationBtn.addEventListener('click', simulateCavitation);
            resetCavitationBtn.addEventListener('click', () => resetChart('cavitation'));
        }

        const startOverheatBtn = document.getElementById('start-overheat');
        const resetOverheatBtn = document.getElementById('reset-overheat');
        if (startOverheatBtn && resetOverheatBtn) {
            startOverheatBtn.addEventListener('click', simulateOverheat);
            resetOverheatBtn.addEventListener('click', () => resetChart('overheat'));
        }

        console.log('Event listeners set up successfully!');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Pump simulation functions
function startCentrifugalPump() {
    clearInterval(simIntervals.centrifugal);
    resetChart('centrifugal');
    
    let time = 0;
    let flowRate = 0;
    let pressure = 0;
    const steadyStateFlowRate = 40;  // Set to 40 L/min
    const steadyStatePressure = 1;   // Set to 1 bar
    const timeStep = 0.1;

    simIntervals.centrifugal = setInterval(() => {
        time += timeStep;
        
        // Centrifugal pump characteristics
        if (flowRate < steadyStateFlowRate) {
            flowRate += 4 * timeStep;  // Adjusted for smoother ramp
        }
        if (pressure < steadyStatePressure) {
            pressure += 0.1 * timeStep;
        }
        
        // Slight inverse relationship between flow and pressure
        const adjustedFlow = flowRate * (1 - (pressure / 10));  // Reduced pressure impact

        updateChart('centrifugal', time, [adjustedFlow, pressure]);

        // Stop when steady state is reached
        if (Math.abs(flowRate - steadyStateFlowRate) < 0.1 && 
            Math.abs(pressure - steadyStatePressure) < 0.01) {
            clearInterval(simIntervals.centrifugal);
        }
    }, 100);
}

function startPDPump() {
    clearInterval(simIntervals.pd);
    resetChart('pd');
    
    let time = 0;
    let flowRate = 0;
    let pressure = 0;
    const steadyStateFlowRate = 40;  // Set to 40 L/min
    const steadyStatePressure = 100;  // Set to 100 bar
    const timeStep = 0.1;

    simIntervals.pd = setInterval(() => {
        time += timeStep;
        
        // PD pump characteristics: constant flow rate regardless of pressure
        if (flowRate < steadyStateFlowRate) {
            flowRate += 4 * timeStep;  // Adjusted for smoother ramp
        }
        if (pressure < steadyStatePressure) {
            pressure += 10 * timeStep;  // Adjusted for smoother pressure build
        }

        updateChart('pd', time, [flowRate, pressure]);

        // Stop when steady state is reached
        if (Math.abs(flowRate - steadyStateFlowRate) < 0.1 && 
            Math.abs(pressure - steadyStatePressure) < 1) {
            clearInterval(simIntervals.pd);
        }
    }, 100);
}

function simulateLeak() {
    clearInterval(simIntervals.leak);
    resetChart('leak');
    
    let time = 0;
    let flowRate = 80;
    let power = 15;  // Starting at normal power consumption
    const timeStep = 0.1;
    let leakOccurred = false;
    let criticalPhase = false;

    simIntervals.leak = setInterval(() => {
        time += timeStep;
        
        if (time >= 3 && !leakOccurred) {
            // Initial leak occurs at t=3s
            leakOccurred = true;
        }

        if (time >= 6 && !criticalPhase) {
            // Critical phase (severe leak) starts at t=6s
            criticalPhase = true;
        }

        if (criticalPhase) {
            // Severe leak phase: dramatic flow drop and power spike
            if (flowRate > 10) flowRate -= 3 * timeStep;  // Faster flow drop
            if (power < 45) power += 2 * timeStep;        // Much higher power spike
        } else if (leakOccurred) {
            // Initial leak phase
            if (flowRate > 40) flowRate -= 1.5 * timeStep;
            if (power < 25) power += 0.8 * timeStep;
        } else {
            // Normal operation before leak
            if (flowRate < 80) flowRate += 4 * timeStep;
            power = 15 + Math.sin(time) * 0.5;  // Small normal fluctuations
        }

        updateChart('leak', time, [flowRate, power]);

        // Stop when critical conditions are reached
        if (criticalPhase && 
            flowRate <= 10 && 
            power >= 45) {
            clearInterval(simIntervals.leak);
        }
    }, 100);
}

function simulateCavitation() {
    clearInterval(simIntervals.cavitation);
    resetChart('cavitation');
    
    let time = 0;
    let pressure = 3;
    let vibration = 0.2;
    const timeStep = 0.1;
    let cavitationStarted = false;
    
    simIntervals.cavitation = setInterval(() => {
        time += timeStep;
        
        if (time >= 3 && !cavitationStarted) {
            // Cavitation starts at t=3s
            cavitationStarted = true;
        }

        if (cavitationStarted) {
            // During cavitation: pressure fluctuates and vibration increases
            pressure = 3 + Math.sin(time * 8) * 1.5;
            if (vibration < 8) vibration += 0.4 * timeStep;
        } else {
            // Normal operation before cavitation
            pressure = 3 + Math.sin(time * 2) * 0.1;
            vibration = 0.2;
        }

        updateChart('cavitation', time, [pressure, vibration]);

        // Stop when vibration reaches maximum
        if (cavitationStarted && vibration >= 8) {
            clearInterval(simIntervals.cavitation);
        }
    }, 100);
}

function simulateOverheat() {
    clearInterval(simIntervals.overheat);
    resetChart('overheat');
    
    let time = 0;
    let temperature = 40;  // Starting at normal operating temperature
    let efficiency = 98;   // Starting at peak efficiency
    const timeStep = 0.1;
    let overheatStarted = false;
    let criticalPhase = false;

    simIntervals.overheat = setInterval(() => {
        time += timeStep;
        
        if (time >= 3 && !overheatStarted) {
            // Initial overheat condition starts at t=3s
            overheatStarted = true;
        }

        if (time >= 6 && !criticalPhase) {
            // Critical phase starts at t=6s
            criticalPhase = true;
        }

        if (criticalPhase) {
            // Rapid deterioration phase
            if (temperature < 120) {  // Much higher max temperature
                temperature += 1.2 * timeStep;  // Faster temperature rise
            }
            if (efficiency > 20) {    // Much lower final efficiency
                efficiency -= 1.5 * timeStep;   // Faster efficiency drop
            }
        } else if (overheatStarted) {
            // Initial overheating phase
            if (temperature < 85) {
                temperature += 0.6 * timeStep;
            }
            if (efficiency > 60) {
                efficiency -= 0.4 * timeStep;
            }
        } else {
            // Normal operation before overheat
            temperature = 40 + Math.sin(time) * 2;  // Small normal fluctuations
            efficiency = 98 + Math.sin(time) * 0.5; // Small normal fluctuations
        }

        updateChart('overheat', time, [temperature, efficiency]);

        // Stop when critical conditions are reached
        if (criticalPhase && 
            temperature >= 120 && 
            efficiency <= 20) {
            clearInterval(simIntervals.overheat);
        }
    }, 100);
}

// Helper functions
function updateChart(chartId, time, values) {
    try {
        const chart = charts[chartId];
        if (!chart) {
            console.error(`Chart ${chartId} not found!`);
            return;
        }

        // Add new data points
        values.forEach((value, index) => {
            chart.data.datasets[index].data.push({x: time, y: value});
        });

        chart.update('none'); // Update without animation for better performance
    } catch (error) {
        console.error(`Error updating chart ${chartId}:`, error);
    }
}

function stopPump(pumpType) {
    clearInterval(simIntervals[pumpType]);
}

function resetChart(chartId) {
    clearInterval(simIntervals[chartId]);
    if (charts[chartId]) {
        charts[chartId].data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        charts[chartId].update();
    }
}

// Initialize when the script loads
if (document.readyState === 'complete') {
    initializePumpSimulation();
} else {
    window.addEventListener('load', initializePumpSimulation);
} 