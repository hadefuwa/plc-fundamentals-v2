// Chart.js configurations and float switch simulation logic
let charts = {};
let simIntervals = {};
let tankState = {
    basic: {
        level: 0,
        filling: false,
        draining: false,
        highSwitch: false,  // 80%
        lowSwitch: false,   // 20%
        pumpStatus: 'IDLE'
    },
    advanced: {
        level: 0,
        filling: false,
        draining: false,
        highCutout: false,  // 90%
        highWarning: false, // 70%
        lowWarning: false,  // 30%
        lowCutout: false,   // 10%
        pumpStatus: 'IDLE',
        alerts: []
    }
};

// Initialize all charts when the page loads
function initializeFloatSwitchSimulation() {
    console.log('Initializing float switch simulation...');

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
                duration: 0
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#555',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Level: ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    };

    try {
        // Initialize Basic Tank Chart
        const basicCtx = document.getElementById('basic-tank-chart');
        if (basicCtx) {
            charts.basic = new Chart(basicCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Tank Level',
                        data: [],
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0.4,
                        fill: true
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
                            grid: {
                                color: '#333',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#aaa',
                                maxTicksLimit: 8
                            },
                            title: {
                                display: true,
                                text: 'Time (s)',
                                color: '#aaa',
                                font: { size: 14 }
                            }
                        },
                        y: {
                            display: true,
                            min: 0,
                            max: 100,
                            grid: {
                                color: '#333',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#aaa',
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            title: {
                                display: true,
                                text: 'Tank Level',
                                color: '#aaa',
                                font: { size: 14 }
                            }
                        }
                    }
                }
            }));

            // Add switch level indicators
            const basicSwitchPlugin = {
                id: 'basicSwitchLines',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    const yAxis = chart.scales.y;
                    
                    // High switch line (80%)
                    ctx.beginPath();
                    ctx.strokeStyle = '#FF5722';
                    ctx.setLineDash([5, 5]);
                    const highY = yAxis.getPixelForValue(80);
                    ctx.moveTo(chart.chartArea.left, highY);
                    ctx.lineTo(chart.chartArea.right, highY);
                    ctx.stroke();
                    
                    // Low switch line (20%)
                    ctx.beginPath();
                    ctx.strokeStyle = '#FF9800';
                    const lowY = yAxis.getPixelForValue(20);
                    ctx.moveTo(chart.chartArea.left, lowY);
                    ctx.lineTo(chart.chartArea.right, lowY);
                    ctx.stroke();
                    
                    ctx.setLineDash([]);
                }
            };
            charts.basic.options.plugins.basicSwitchLines = basicSwitchPlugin;
        }

        // Initialize Advanced Tank Chart
        const advCtx = document.getElementById('adv-tank-chart');
        if (advCtx) {
            charts.advanced = new Chart(advCtx, Object.assign({}, commonConfig, {
                data: {
                    datasets: [{
                        label: 'Tank Level',
                        data: [],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true
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
                            grid: {
                                color: '#333',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#aaa',
                                maxTicksLimit: 8
                            },
                            title: {
                                display: true,
                                text: 'Time (s)',
                                color: '#aaa',
                                font: { size: 14 }
                            }
                        },
                        y: {
                            display: true,
                            min: 0,
                            max: 100,
                            grid: {
                                color: '#333',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#aaa',
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            title: {
                                display: true,
                                text: 'Tank Level',
                                color: '#aaa',
                                font: { size: 14 }
                            }
                        }
                    }
                }
            }));

            // Add switch level indicators
            const advSwitchPlugin = {
                id: 'advSwitchLines',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    const yAxis = chart.scales.y;
                    
                    // High cutout line (90%)
                    ctx.beginPath();
                    ctx.strokeStyle = '#F44336';
                    ctx.setLineDash([5, 5]);
                    const highCutY = yAxis.getPixelForValue(90);
                    ctx.moveTo(chart.chartArea.left, highCutY);
                    ctx.lineTo(chart.chartArea.right, highCutY);
                    ctx.stroke();
                    
                    // High warning line (70%)
                    ctx.beginPath();
                    ctx.strokeStyle = '#FF9800';
                    const highWarnY = yAxis.getPixelForValue(70);
                    ctx.moveTo(chart.chartArea.left, highWarnY);
                    ctx.lineTo(chart.chartArea.right, highWarnY);
                    ctx.stroke();
                    
                    // Low warning line (30%)
                    ctx.beginPath();
                    ctx.strokeStyle = '#FF9800';
                    const lowWarnY = yAxis.getPixelForValue(30);
                    ctx.moveTo(chart.chartArea.left, lowWarnY);
                    ctx.lineTo(chart.chartArea.right, lowWarnY);
                    ctx.stroke();
                    
                    // Low cutout line (10%)
                    ctx.beginPath();
                    ctx.strokeStyle = '#F44336';
                    const lowCutY = yAxis.getPixelForValue(10);
                    ctx.moveTo(chart.chartArea.left, lowCutY);
                    ctx.lineTo(chart.chartArea.right, lowCutY);
                    ctx.stroke();
                    
                    ctx.setLineDash([]);
                }
            };
            charts.advanced.options.plugins.advSwitchLines = advSwitchPlugin;
        }

        // Set up event listeners
        setupEventListeners();
        console.log('Float switch simulation initialized successfully!');
    } catch (error) {
        console.error('Error initializing float switch simulation:', error);
    }
}

function setupEventListeners() {
    try {
        // Basic Tank Controls
        const basicFillBtn = document.getElementById('basic-fill');
        const basicDrainBtn = document.getElementById('basic-drain');
        if (basicFillBtn && basicDrainBtn) {
            basicFillBtn.addEventListener('click', () => toggleBasicFill());
            basicDrainBtn.addEventListener('click', () => toggleBasicDrain());
        }

        // Advanced Tank Controls
        const advFillBtn = document.getElementById('adv-fill');
        const advDrainBtn = document.getElementById('adv-drain');
        if (advFillBtn && advDrainBtn) {
            advFillBtn.addEventListener('click', () => toggleAdvancedFill());
            advDrainBtn.addEventListener('click', () => toggleAdvancedDrain());
        }

        console.log('Event listeners set up successfully!');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Basic Tank Functions
function toggleBasicFill() {
    const btn = document.getElementById('basic-fill');
    tankState.basic.filling = !tankState.basic.filling;
    
    // Update button state
    btn.textContent = tankState.basic.filling ? 'Stop Fill' : 'Start Fill';
    btn.style.background = tankState.basic.filling ? '#FF5722' : '#4CAF50';
    
    // Start/Stop simulation
    if (tankState.basic.filling) {
        tankState.basic.draining = false;
        document.getElementById('basic-drain').textContent = 'Start Drain';
        document.getElementById('basic-drain').style.background = '#FF5722';
        startBasicSimulation();
    }
    updateBasicStatus();
}

function toggleBasicDrain() {
    const btn = document.getElementById('basic-drain');
    tankState.basic.draining = !tankState.basic.draining;
    
    // Update button state
    btn.textContent = tankState.basic.draining ? 'Stop Drain' : 'Start Drain';
    btn.style.background = tankState.basic.draining ? '#FF5722' : '#FF5722';
    
    // Start/Stop simulation
    if (tankState.basic.draining) {
        tankState.basic.filling = false;
        document.getElementById('basic-fill').textContent = 'Start Fill';
        document.getElementById('basic-fill').style.background = '#4CAF50';
        startBasicSimulation();
    }
    updateBasicStatus();
}

function startBasicSimulation() {
    clearInterval(simIntervals.basic);
    let time = 0;
    const timeStep = 0.1;

    simIntervals.basic = setInterval(() => {
        time += timeStep;
        
        // Update level based on filling/draining
        if (tankState.basic.filling && !tankState.basic.highSwitch) {
            tankState.basic.level = Math.min(100, tankState.basic.level + 2 * timeStep);
        } else if (tankState.basic.draining && !tankState.basic.lowSwitch) {
            tankState.basic.level = Math.max(0, tankState.basic.level - 2 * timeStep);
        }
        
        // Update switch states
        tankState.basic.highSwitch = tankState.basic.level >= 80;
        tankState.basic.lowSwitch = tankState.basic.level <= 20;
        
        // Update chart
        updateChart('basic', time, [tankState.basic.level]);
        
        // Update status display
        updateBasicStatus();
        
        // Stop filling if high switch activated
        if (tankState.basic.highSwitch && tankState.basic.filling) {
            toggleBasicFill();
        }
        
        // Stop draining if low switch activated
        if (tankState.basic.lowSwitch && tankState.basic.draining) {
            toggleBasicDrain();
        }
        
        // Stop if neither filling nor draining
        if (!tankState.basic.filling && !tankState.basic.draining) {
            clearInterval(simIntervals.basic);
        }
    }, 100);
}

function updateBasicStatus() {
    const levelSpan = document.getElementById('basic-level');
    const highSpan = document.getElementById('basic-high');
    const lowSpan = document.getElementById('basic-low');
    const pumpSpan = document.getElementById('basic-pump');
    
    if (levelSpan) levelSpan.textContent = Math.round(tankState.basic.level) + '%';
    if (highSpan) {
        highSpan.textContent = tankState.basic.highSwitch ? 'ON' : 'OFF';
        highSpan.style.color = tankState.basic.highSwitch ? '#4CAF50' : '#FF5722';
    }
    if (lowSpan) {
        lowSpan.textContent = tankState.basic.lowSwitch ? 'ON' : 'OFF';
        lowSpan.style.color = tankState.basic.lowSwitch ? '#4CAF50' : '#FF5722';
    }
    if (pumpSpan) {
        let status = 'IDLE';
        if (tankState.basic.filling) status = 'FILLING';
        if (tankState.basic.draining) status = 'DRAINING';
        pumpSpan.textContent = status;
        pumpSpan.style.color = status === 'IDLE' ? '#666' : '#4CAF50';
    }
}

// Advanced Tank Functions
function toggleAdvancedFill() {
    const btn = document.getElementById('adv-fill');
    tankState.advanced.filling = !tankState.advanced.filling;
    
    // Update button state
    btn.textContent = tankState.advanced.filling ? 'Stop Fill' : 'Start Fill';
    btn.style.background = tankState.advanced.filling ? '#FF5722' : '#4CAF50';
    
    // Start/Stop simulation
    if (tankState.advanced.filling) {
        tankState.advanced.draining = false;
        document.getElementById('adv-drain').textContent = 'Start Drain';
        document.getElementById('adv-drain').style.background = '#FF5722';
        startAdvancedSimulation();
    }
    updateAdvancedStatus();
}

function toggleAdvancedDrain() {
    const btn = document.getElementById('adv-drain');
    tankState.advanced.draining = !tankState.advanced.draining;
    
    // Update button state
    btn.textContent = tankState.advanced.draining ? 'Stop Drain' : 'Start Drain';
    btn.style.background = tankState.advanced.draining ? '#FF5722' : '#FF5722';
    
    // Start/Stop simulation
    if (tankState.advanced.draining) {
        tankState.advanced.filling = false;
        document.getElementById('adv-fill').textContent = 'Start Fill';
        document.getElementById('adv-fill').style.background = '#4CAF50';
        startAdvancedSimulation();
    }
    updateAdvancedStatus();
}

function startAdvancedSimulation() {
    clearInterval(simIntervals.advanced);
    let time = 0;
    const timeStep = 0.1;

    simIntervals.advanced = setInterval(() => {
        time += timeStep;
        
        // Update level based on filling/draining
        if (tankState.advanced.filling && !tankState.advanced.highCutout) {
            tankState.advanced.level = Math.min(100, tankState.advanced.level + 2 * timeStep);
        } else if (tankState.advanced.draining && !tankState.advanced.lowCutout) {
            tankState.advanced.level = Math.max(0, tankState.advanced.level - 2 * timeStep);
        }
        
        // Update switch states
        tankState.advanced.highCutout = tankState.advanced.level >= 90;
        tankState.advanced.highWarning = tankState.advanced.level >= 70;
        tankState.advanced.lowWarning = tankState.advanced.level <= 30;
        tankState.advanced.lowCutout = tankState.advanced.level <= 10;
        
        // Update chart
        updateChart('advanced', time, [tankState.advanced.level]);
        
        // Update status and alerts
        updateAdvancedStatus();
        
        // Stop filling if high cutout activated
        if (tankState.advanced.highCutout && tankState.advanced.filling) {
            toggleAdvancedFill();
        }
        
        // Stop draining if low cutout activated
        if (tankState.advanced.lowCutout && tankState.advanced.draining) {
            toggleAdvancedDrain();
        }
        
        // Stop if neither filling nor draining
        if (!tankState.advanced.filling && !tankState.advanced.draining) {
            clearInterval(simIntervals.advanced);
        }
    }, 100);
}

function updateAdvancedStatus() {
    const levelSpan = document.getElementById('adv-level');
    const highCutSpan = document.getElementById('adv-high-cut');
    const highWarnSpan = document.getElementById('adv-high-warn');
    const lowWarnSpan = document.getElementById('adv-low-warn');
    const lowCutSpan = document.getElementById('adv-low-cut');
    const pumpSpan = document.getElementById('adv-pump');
    const alertsDiv = document.getElementById('adv-alerts');
    
    // Update level and switch states
    if (levelSpan) levelSpan.textContent = Math.round(tankState.advanced.level) + '%';
    if (highCutSpan) {
        highCutSpan.textContent = tankState.advanced.highCutout ? 'ON' : 'OFF';
        highCutSpan.style.color = tankState.advanced.highCutout ? '#4CAF50' : '#FF5722';
    }
    if (highWarnSpan) {
        highWarnSpan.textContent = tankState.advanced.highWarning ? 'ON' : 'OFF';
        highWarnSpan.style.color = tankState.advanced.highWarning ? '#4CAF50' : '#FF5722';
    }
    if (lowWarnSpan) {
        lowWarnSpan.textContent = tankState.advanced.lowWarning ? 'ON' : 'OFF';
        lowWarnSpan.style.color = tankState.advanced.lowWarning ? '#4CAF50' : '#FF5722';
    }
    if (lowCutSpan) {
        lowCutSpan.textContent = tankState.advanced.lowCutout ? 'ON' : 'OFF';
        lowCutSpan.style.color = tankState.advanced.lowCutout ? '#4CAF50' : '#FF5722';
    }
    if (pumpSpan) {
        let status = 'IDLE';
        if (tankState.advanced.filling) status = 'FILLING';
        if (tankState.advanced.draining) status = 'DRAINING';
        pumpSpan.textContent = status;
        pumpSpan.style.color = status === 'IDLE' ? '#666' : '#4CAF50';
    }
    
    // Update alerts
    if (alertsDiv) {
        const alerts = [];
        if (tankState.advanced.highCutout) alerts.push('HIGH LEVEL CUTOUT!');
        else if (tankState.advanced.highWarning) alerts.push('High Level Warning');
        if (tankState.advanced.lowCutout) alerts.push('LOW LEVEL CUTOUT!');
        else if (tankState.advanced.lowWarning) alerts.push('Low Level Warning');
        
        const alertsContent = alerts.length > 0 
            ? `<p style="margin: 0; color: #aaa;">Alerts: <span style="color: ${alerts[0].includes('CUTOUT') ? '#F44336' : '#FF9800'}">${alerts.join(', ')}</span></p>`
            : '<p style="margin: 0; color: #aaa;">Alerts: <span style="color: #4CAF50">None</span></p>';
        
        alertsDiv.innerHTML = alertsContent;
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
    initializeFloatSwitchSimulation();
} else {
    window.addEventListener('load', initializeFloatSwitchSimulation);
} 