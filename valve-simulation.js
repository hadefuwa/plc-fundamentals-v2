// Global state
let charts = {};
let simIntervals = {};
let valveState = {
    onOff: {
        pumpRunning: false,
        valveOpen: false,
        flowRate: 0,
        time: 0
    },
    proportional: {
        pumpRunning: false,
        position: 0,
        flowRate: 0,
        time: 0
    },
    sequence: {
        running: false,
        step: 0,
        valves: {
            v1: false,
            v2: false,
            v3: false,
            v4: false
        },
        cylinderPosition: 0
    }
};

// Initialize all charts when the page loads
function initializeValveSimulation() {
    console.log('Initializing valve simulation...');

    try {
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

        // Reset valve state
        valveState = {
            onOff: {
                pumpRunning: false,
                valveOpen: false,
                flowRate: 0,
                time: 0
            },
            proportional: {
                pumpRunning: false,
                position: 0,
                flowRate: 0,
                time: 0
            },
            sequence: {
                running: false,
                step: 0,
                valves: {
                    v1: false,
                    v2: false,
                    v3: false,
                    v4: false
                },
                cylinderPosition: 0
            }
        };

        // Common chart configuration
        const commonConfig = {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#aaa',
                            font: { size: 12 },
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

        // Initialize On/Off Valve Chart
        const onOffCtx = document.getElementById('onoff-valve-chart');
        if (onOffCtx) {
            charts.onOff = new Chart(onOffCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Flow Rate (L/min)',
                        data: [],
                        borderColor: '#2196F3',
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
                            max: 30,
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
                            max: 100,
                            title: {
                                display: true,
                                text: 'Flow Rate (L/min)',
                                color: '#2196F3',
                                font: { size: 14 }
                            },
                            ticks: { color: '#aaa', padding: 10 },
                            grid: { color: '#333', drawBorder: false }
                        }
                    }
                }
            }));
        }

        // Initialize Proportional Valve Chart
        const propCtx = document.getElementById('prop-valve-chart');
        if (propCtx) {
            charts.proportional = new Chart(propCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Flow Rate (L/min)',
                        data: [],
                        borderColor: '#4CAF50',
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
                            max: 30,
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
                            max: 100,
                            title: {
                                display: true,
                                text: 'Flow Rate (L/min)',
                                color: '#4CAF50',
                                font: { size: 14 }
                            },
                            ticks: { color: '#aaa', padding: 10 },
                            grid: { color: '#333', drawBorder: false }
                        }
                    }
                }
            }));
        }

        // Initialize Sequence Chart
        const sequenceCtx = document.getElementById('sequence-chart');
        if (sequenceCtx) {
            charts.sequence = new Chart(sequenceCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Cylinder Position (%)',
                        data: [],
                        borderColor: '#9C27B0',
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
                            max: 20,
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
                            max: 100,
                            title: {
                                display: true,
                                text: 'Cylinder Position (%)',
                                color: '#9C27B0',
                                font: { size: 14 }
                            },
                            ticks: { color: '#aaa', padding: 10 },
                            grid: { color: '#333', drawBorder: false }
                        }
                    }
                }
            }));
        }

        // Set up event listeners
        setupEventListeners();
        console.log('Valve simulation initialized successfully!');
    } catch (error) {
        console.error('Error initializing valve simulation:', error);
    }
}

function setupEventListeners() {
    try {
        // On/Off Valve Controls
        const startOnOffPumpBtn = document.getElementById('start-onoff-pump');
        const stopOnOffPumpBtn = document.getElementById('stop-onoff-pump');
        const toggleValveBtn = document.getElementById('toggle-valve');
        
        if (startOnOffPumpBtn && stopOnOffPumpBtn && toggleValveBtn) {
            startOnOffPumpBtn.addEventListener('click', () => startPump('onOff'));
            stopOnOffPumpBtn.addEventListener('click', () => stopPump('onOff'));
            toggleValveBtn.addEventListener('click', toggleValve);
        }

        // Proportional Valve Controls
        const startPropPumpBtn = document.getElementById('start-prop-pump');
        const stopPropPumpBtn = document.getElementById('stop-prop-pump');
        const valvePositionSlider = document.getElementById('valve-position');
        
        if (startPropPumpBtn && stopPropPumpBtn && valvePositionSlider) {
            startPropPumpBtn.addEventListener('click', () => startPump('proportional'));
            stopPropPumpBtn.addEventListener('click', () => stopPump('proportional'));
            valvePositionSlider.addEventListener('input', updateValvePosition);
        }

        // Sequence Controls
        const startSequenceBtn = document.getElementById('start-sequence');
        const resetSequenceBtn = document.getElementById('reset-sequence');
        if (startSequenceBtn && resetSequenceBtn) {
            startSequenceBtn.addEventListener('click', startSequence);
            resetSequenceBtn.addEventListener('click', resetSequence);
        }

        console.log('Event listeners set up successfully!');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Pump Control Functions
function startPump(type) {
    if (type === 'onOff') {
        valveState.onOff.pumpRunning = true;
        updatePumpState('pump-state', true);
        startOnOffSimulation();
    } else if (type === 'proportional') {
        valveState.proportional.pumpRunning = true;
        updatePumpState('prop-pump-state', true);
        startProportionalSimulation();
    }
}

function stopPump(type) {
    if (type === 'onOff') {
        valveState.onOff.pumpRunning = false;
        updatePumpState('pump-state', false);
        valveState.onOff.flowRate = 0;
        updateFlowRate('flow-rate', 0);
    } else if (type === 'proportional') {
        valveState.proportional.pumpRunning = false;
        updatePumpState('prop-pump-state', false);
        valveState.proportional.flowRate = 0;
        updateFlowRate('prop-flow-rate', 0);
    }
}

function updatePumpState(elementId, running) {
    const stateSpan = document.getElementById(elementId);
    if (stateSpan) {
        stateSpan.textContent = running ? 'Running' : 'Stopped';
        stateSpan.style.color = running ? '#4CAF50' : '#FF5722';
    }
}

// On/Off Valve Functions
function toggleValve() {
    const btn = document.getElementById('toggle-valve');
    const stateSpan = document.getElementById('valve-state');
    
    valveState.onOff.valveOpen = !valveState.onOff.valveOpen;
    
    // Update UI
    if (btn) {
        btn.textContent = valveState.onOff.valveOpen ? 'Close Valve' : 'Open Valve';
        btn.style.background = valveState.onOff.valveOpen ? '#FF5722' : '#2196F3';
    }
    if (stateSpan) {
        stateSpan.textContent = valveState.onOff.valveOpen ? 'Open' : 'Closed';
        stateSpan.style.color = valveState.onOff.valveOpen ? '#4CAF50' : '#FF5722';
    }
}

function startOnOffSimulation() {
    // Clear existing interval
    if (simIntervals.onOff) {
        clearInterval(simIntervals.onOff);
    }

    const timeStep = 0.1;
    simIntervals.onOff = setInterval(() => {
        if (!valveState.onOff.pumpRunning) {
            clearInterval(simIntervals.onOff);
            return;
        }

        valveState.onOff.time += timeStep;

        // Calculate target flow rate based on valve state
        const targetFlow = valveState.onOff.valveOpen ? 80 : 0;
        
        // Gradually adjust flow rate
        const flowDiff = targetFlow - valveState.onOff.flowRate;
        valveState.onOff.flowRate += flowDiff * 0.1;

        // Update flow rate display
        updateFlowRate('flow-rate', Math.round(valveState.onOff.flowRate));

        // Update chart
        updateChart('onOff', valveState.onOff.time, [valveState.onOff.flowRate]);

        // Manage chart window
        if (valveState.onOff.time > 30) {
            // Remove old data points
            const chart = charts.onOff;
            while (chart.data.datasets[0].data.length > 0 && 
                   chart.data.datasets[0].data[0].x < valveState.onOff.time - 30) {
                chart.data.datasets[0].data.shift();
            }
            // Update x-axis window
            chart.options.scales.x.min = valveState.onOff.time - 30;
            chart.options.scales.x.max = valveState.onOff.time;
        }
    }, 100);
}

// Proportional Valve Functions
function updateValvePosition(event) {
    const position = parseInt(event.target.value);
    valveState.proportional.position = position;
    
    // Update UI
    const positionValue = document.getElementById('position-value');
    const valveStateDisplay = document.getElementById('prop-valve-state');
    
    if (positionValue) positionValue.textContent = position + '%';
    if (valveStateDisplay) valveStateDisplay.textContent = position + '%';
    
    // Update slider background
    const slider = event.target;
    const percentage = (position / slider.max) * 100;
    slider.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percentage}%, #333 ${percentage}%, #333 100%)`;
}

function startProportionalSimulation() {
    // Clear existing interval
    if (simIntervals.proportional) {
        clearInterval(simIntervals.proportional);
    }

    const timeStep = 0.1;
    simIntervals.proportional = setInterval(() => {
        if (!valveState.proportional.pumpRunning) {
            clearInterval(simIntervals.proportional);
            return;
        }

        valveState.proportional.time += timeStep;

        // Calculate target flow rate based on valve position
        const targetFlow = valveState.proportional.position * 0.8; // Max flow 80 L/min at 100%
        
        // Gradually adjust flow rate
        const flowDiff = targetFlow - valveState.proportional.flowRate;
        valveState.proportional.flowRate += flowDiff * 0.1;

        // Update flow rate display
        updateFlowRate('prop-flow-rate', Math.round(valveState.proportional.flowRate));

        // Update chart
        updateChart('proportional', valveState.proportional.time, [valveState.proportional.flowRate]);

        // Manage chart window
        if (valveState.proportional.time > 30) {
            // Remove old data points
            const chart = charts.proportional;
            while (chart.data.datasets[0].data.length > 0 && 
                   chart.data.datasets[0].data[0].x < valveState.proportional.time - 30) {
                chart.data.datasets[0].data.shift();
            }
            // Update x-axis window
            chart.options.scales.x.min = valveState.proportional.time - 30;
            chart.options.scales.x.max = valveState.proportional.time;
        }
    }, 100);
}

// Sequence Functions
function startSequence() {
    if (valveState.sequence.running) return;
    
    valveState.sequence.running = true;
    valveState.sequence.step = 0;
    resetSequenceState();
    runSequence();
}

function resetSequence() {
    valveState.sequence.running = false;
    valveState.sequence.step = 0;
    resetSequenceState();
    resetChart('sequence');
    updateSequenceUI('Ready', 0);
}

function resetSequenceState() {
    valveState.sequence.valves = {
        v1: false,
        v2: false,
        v3: false,
        v4: false
    };
    valveState.sequence.cylinderPosition = 0;
    updateValveStates();
}

function runSequence() {
    clearInterval(simIntervals.sequence);
    resetChart('sequence');
    
    let time = 0;
    const timeStep = 0.1;
    let currentStep = 0;
    let stepStartTime = 0;

    simIntervals.sequence = setInterval(() => {
        if (!valveState.sequence.running) {
            clearInterval(simIntervals.sequence);
            return;
        }

        time += timeStep;

        // Sequence steps
        switch (currentStep) {
            case 0: // Extend fast
                if (time - stepStartTime < 0.5) {
                    valveState.sequence.valves = { v1: true, v2: false, v3: false, v4: false };
                    valveState.sequence.cylinderPosition += 8 * timeStep;
                    updateSequenceUI('Extending Fast', valveState.sequence.cylinderPosition);
                } else {
                    currentStep++;
                    stepStartTime = time;
                }
                break;

            case 1: // Extend slow
                if (valveState.sequence.cylinderPosition < 100) {
                    valveState.sequence.valves = { v1: false, v2: false, v3: true, v4: false };
                    valveState.sequence.cylinderPosition += 2 * timeStep;
                    updateSequenceUI('Extending Slow', valveState.sequence.cylinderPosition);
                } else {
                    currentStep++;
                    stepStartTime = time;
                }
                break;

            case 2: // Hold position
                if (time - stepStartTime < 2) {
                    valveState.sequence.valves = { v1: false, v2: false, v3: false, v4: false };
                    updateSequenceUI('Holding Position', valveState.sequence.cylinderPosition);
                } else {
                    currentStep++;
                    stepStartTime = time;
                }
                break;

            case 3: // Retract fast
                if (valveState.sequence.cylinderPosition > 0) {
                    valveState.sequence.valves = { v1: false, v2: true, v3: false, v4: false };
                    valveState.sequence.cylinderPosition -= 5 * timeStep;
                    updateSequenceUI('Retracting Fast', valveState.sequence.cylinderPosition);
                } else {
                    currentStep++;
                    stepStartTime = time;
                }
                break;

            default:
                valveState.sequence.running = false;
                clearInterval(simIntervals.sequence);
                updateSequenceUI('Complete', 0);
                break;
        }

        valveState.sequence.cylinderPosition = Math.max(0, Math.min(100, valveState.sequence.cylinderPosition));
        updateValveStates();
        updateChart('sequence', time, [valveState.sequence.cylinderPosition]);
    }, 100);
}

function updateSequenceUI(step, position) {
    const stepSpan = document.getElementById('sequence-step');
    const positionSpan = document.getElementById('cylinder-position');
    
    if (stepSpan) stepSpan.textContent = step;
    if (positionSpan) positionSpan.textContent = Math.round(position) + '%';
}

function updateValveStates() {
    Object.entries(valveState.sequence.valves).forEach(([valve, state]) => {
        const stateSpan = document.getElementById(`${valve}-state`);
        if (stateSpan) {
            stateSpan.textContent = state ? 'Open' : 'Closed';
            stateSpan.style.color = state ? '#4CAF50' : '#FF5722';
        }
    });
}

function updateFlowRate(elementId, value) {
    const flowSpan = document.getElementById(elementId);
    if (flowSpan) {
        flowSpan.textContent = value + ' L/min';
    }
}

function resetChart(chartId) {
    if (charts[chartId]) {
        charts[chartId].data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        charts[chartId].update();
    }
}

// Helper Functions
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

        chart.update('none');
    } catch (error) {
        console.error(`Error updating chart ${chartId}:`, error);
    }
}

// Initialize when the script loads
if (document.readyState === 'complete') {
    initializeValveSimulation();
} else {
    window.addEventListener('load', initializeValveSimulation);
} 