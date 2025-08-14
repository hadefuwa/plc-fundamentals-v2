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
        pumpStatus: 'IDLE',
        time: 0
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
        alerts: [],
        time: 0
    }
};

function initializeFloatSwitchSimulation() {
    console.log('Initializing float switch simulation...');
    
    // Reset tank state
    tankState = {
        basic: {
            level: 0,
            filling: false,
            draining: false,
            highSwitch: false,
            lowSwitch: false,
            pumpStatus: 'IDLE',
            time: 0
        },
        advanced: {
            level: 0,
            filling: false,
            draining: false,
            highCutout: false,
            highWarning: false,
            lowWarning: false,
            lowCutout: false,
            pumpStatus: 'IDLE',
            alerts: [],
            time: 0
        }
    };

    // Clear any existing intervals
    Object.values(simIntervals).forEach(interval => clearInterval(interval));
    simIntervals = {};

    // Initialize charts
    initializeCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial updates
    updateBasicVisualTank();
    updateBasicStatus();
    updateAdvancedVisualTank();
    updateAdvancedStatus();
    
    console.log('Float switch simulation initialized successfully!');
}

function initializeCharts() {
    // Destroy existing charts if they exist
    if (charts.basic) charts.basic.destroy();
    if (charts.advanced) charts.advanced.destroy();
    charts = {};

    const commonConfig = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    max: 30,
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#aaa'
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: '#333'
                    },
                    ticks: {
                        color: '#aaa',
                        callback: value => value + '%'
                    }
                }
            }
        }
    };

    // Initialize Basic Tank Chart
    const basicCtx = document.getElementById('basic-tank-chart');
    if (basicCtx) {
        charts.basic = new Chart(basicCtx, {
            ...commonConfig,
            data: {
                datasets: [{
                    data: [],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                }]
            }
        });
    }

    // Initialize Advanced Tank Chart
    const advCtx = document.getElementById('adv-tank-chart');
    if (advCtx) {
        charts.advanced = new Chart(advCtx, {
            ...commonConfig,
            data: {
                datasets: [{
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                }]
            }
        });
    }
}

function setupEventListeners() {
    // Basic Tank Controls
    const basicFillBtn = document.getElementById('basic-fill');
    const basicDrainBtn = document.getElementById('basic-drain');
    
    if (basicFillBtn) basicFillBtn.onclick = toggleBasicFill;
    if (basicDrainBtn) basicDrainBtn.onclick = toggleBasicDrain;

    // Advanced Tank Controls
    const advFillBtn = document.getElementById('adv-fill');
    const advDrainBtn = document.getElementById('adv-drain');
    
    if (advFillBtn) advFillBtn.onclick = toggleAdvancedFill;
    if (advDrainBtn) advDrainBtn.onclick = toggleAdvancedDrain;
}

// Basic Tank Functions
function toggleBasicFill() {
    tankState.basic.filling = !tankState.basic.filling;
    tankState.basic.draining = false;
    
    // Update button states
    const fillBtn = document.getElementById('basic-fill');
    const drainBtn = document.getElementById('basic-drain');
    
    if (fillBtn) {
        fillBtn.textContent = tankState.basic.filling ? 'Stop Fill' : 'Start Fill';
        fillBtn.style.background = tankState.basic.filling ? '#FF5722' : '#4CAF50';
    }
    if (drainBtn) {
        drainBtn.textContent = 'Start Drain';
        drainBtn.style.background = '#FF5722';
    }

    if (tankState.basic.filling) {
        startBasicSimulation();
    }
}

function toggleBasicDrain() {
    tankState.basic.draining = !tankState.basic.draining;
    tankState.basic.filling = false;
    
    // Update button states
    const fillBtn = document.getElementById('basic-fill');
    const drainBtn = document.getElementById('basic-drain');
    
    if (drainBtn) {
        drainBtn.textContent = tankState.basic.draining ? 'Stop Drain' : 'Start Drain';
        drainBtn.style.background = '#FF5722';
    }
    if (fillBtn) {
        fillBtn.textContent = 'Start Fill';
        fillBtn.style.background = '#4CAF50';
    }

    if (tankState.basic.draining) {
        startBasicSimulation();
    }
}

function startBasicSimulation() {
    // Clear existing interval
    if (simIntervals.basic) clearInterval(simIntervals.basic);
    
    simIntervals.basic = setInterval(() => {
        // Update time
        tankState.basic.time += 0.1;
        
        // Update level
        if (tankState.basic.filling && !tankState.basic.highSwitch) {
            tankState.basic.level = Math.min(100, tankState.basic.level + 1);
        } else if (tankState.basic.draining && !tankState.basic.lowSwitch) {
            tankState.basic.level = Math.max(0, tankState.basic.level - 1);
        }
        
        // Update switch states
        tankState.basic.highSwitch = tankState.basic.level >= 80;
        tankState.basic.lowSwitch = tankState.basic.level <= 20;
        
        // Update visuals
        updateBasicVisualTank();
        updateBasicStatus();
        updateChart('basic', tankState.basic.time, tankState.basic.level);
        
        // Stop conditions
        if (tankState.basic.highSwitch && tankState.basic.filling) {
            toggleBasicFill();
        }
        if (tankState.basic.lowSwitch && tankState.basic.draining) {
            toggleBasicDrain();
        }
        
        // Stop if neither filling nor draining
        if (!tankState.basic.filling && !tankState.basic.draining) {
            clearInterval(simIntervals.basic);
        }
    }, 100);
}

function updateBasicVisualTank() {
    const tankFill = document.getElementById('basic-tank-fill');
    const highIndicator = document.getElementById('basic-high-indicator');
    const lowIndicator = document.getElementById('basic-low-indicator');
    
    if (tankFill) tankFill.style.height = `${tankState.basic.level}%`;
    if (highIndicator) highIndicator.style.background = tankState.basic.highSwitch ? '#4CAF50' : '#FF5722';
    if (lowIndicator) lowIndicator.style.background = tankState.basic.lowSwitch ? '#4CAF50' : '#FF9800';
}

function updateBasicStatus() {
    const levelSpan = document.getElementById('basic-level');
    const highSpan = document.getElementById('basic-high');
    const lowSpan = document.getElementById('basic-low');
    const pumpSpan = document.getElementById('basic-pump');
    
    if (levelSpan) levelSpan.textContent = `${Math.round(tankState.basic.level)}%`;
    
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

function updateChart(chartId, time, level) {
    const chart = charts[chartId];
    if (!chart) return;

    // Add new data point
    chart.data.datasets[0].data.push({x: time, y: level});
    
    // Remove old data points if beyond 30 seconds
    if (time > 30) {
        while (chart.data.datasets[0].data.length > 0 && 
               chart.data.datasets[0].data[0].x < time - 30) {
            chart.data.datasets[0].data.shift();
        }
        chart.options.scales.x.min = time - 30;
        chart.options.scales.x.max = time;
    }
    
    chart.update('none');
}

// Advanced Tank Functions
function toggleAdvancedFill() {
    tankState.advanced.filling = !tankState.advanced.filling;
    tankState.advanced.draining = false;
    
    // Update button states
    const fillBtn = document.getElementById('adv-fill');
    const drainBtn = document.getElementById('adv-drain');
    
    if (fillBtn) {
        fillBtn.textContent = tankState.advanced.filling ? 'Stop Fill' : 'Start Fill';
        fillBtn.style.background = tankState.advanced.filling ? '#FF5722' : '#4CAF50';
    }
    if (drainBtn) {
        drainBtn.textContent = 'Start Drain';
        drainBtn.style.background = '#FF5722';
    }

    if (tankState.advanced.filling) {
        startAdvancedSimulation();
    }
}

function toggleAdvancedDrain() {
    tankState.advanced.draining = !tankState.advanced.draining;
    tankState.advanced.filling = false;
    
    // Update button states
    const fillBtn = document.getElementById('adv-fill');
    const drainBtn = document.getElementById('adv-drain');
    
    if (drainBtn) {
        drainBtn.textContent = tankState.advanced.draining ? 'Stop Drain' : 'Start Drain';
        drainBtn.style.background = '#FF5722';
    }
    if (fillBtn) {
        fillBtn.textContent = 'Start Fill';
        fillBtn.style.background = '#4CAF50';
    }

    if (tankState.advanced.draining) {
        startAdvancedSimulation();
    }
}

function startAdvancedSimulation() {
    // Clear existing interval
    if (simIntervals.advanced) clearInterval(simIntervals.advanced);
    
    simIntervals.advanced = setInterval(() => {
        // Update time
        tankState.advanced.time += 0.1;
        
        // Update level
        if (tankState.advanced.filling && !tankState.advanced.highCutout) {
            tankState.advanced.level = Math.min(100, tankState.advanced.level + 1);
        } else if (tankState.advanced.draining && !tankState.advanced.lowCutout) {
            tankState.advanced.level = Math.max(0, tankState.advanced.level - 1);
        }
        
        // Update switch states
        tankState.advanced.highCutout = tankState.advanced.level >= 90;
        tankState.advanced.highWarning = tankState.advanced.level >= 70;
        tankState.advanced.lowWarning = tankState.advanced.level <= 30;
        tankState.advanced.lowCutout = tankState.advanced.level <= 10;
        
        // Update visuals
        updateAdvancedVisualTank();
        updateAdvancedStatus();
        updateChart('advanced', tankState.advanced.time, tankState.advanced.level);
        
        // Stop conditions
        if (tankState.advanced.highCutout && tankState.advanced.filling) {
            toggleAdvancedFill();
        }
        if (tankState.advanced.lowCutout && tankState.advanced.draining) {
            toggleAdvancedDrain();
        }
        
        // Stop if neither filling nor draining
        if (!tankState.advanced.filling && !tankState.advanced.draining) {
            clearInterval(simIntervals.advanced);
        }
    }, 100);
}

function updateAdvancedVisualTank() {
    const tankFill = document.getElementById('adv-tank-fill');
    const highCutIndicator = document.getElementById('adv-high-cut-indicator');
    const highWarnIndicator = document.getElementById('adv-high-warn-indicator');
    const lowWarnIndicator = document.getElementById('adv-low-warn-indicator');
    const lowCutIndicator = document.getElementById('adv-low-cut-indicator');
    
    if (tankFill) tankFill.style.height = `${tankState.advanced.level}%`;
    
    if (highCutIndicator) highCutIndicator.style.background = tankState.advanced.highCutout ? '#4CAF50' : '#F44336';
    
    if (highWarnIndicator) highWarnIndicator.style.background = tankState.advanced.highWarning ? '#4CAF50' : '#FF9800';
    
    if (lowWarnIndicator) lowWarnIndicator.style.background = tankState.advanced.lowWarning ? '#4CAF50' : '#FF9800';
    
    if (lowCutIndicator) lowCutIndicator.style.background = tankState.advanced.lowCutout ? '#4CAF50' : '#F44336';
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
    if (levelSpan) levelSpan.textContent = `${Math.round(tankState.advanced.level)}%`;
    
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

// Advanced Tank Functions
function updateChart(chartId, time, level) {
    const chart = charts[chartId];
    if (!chart) return;

    // Add new data point
    chart.data.datasets[0].data.push({x: time, y: level});
    
    // Remove old data points if beyond 30 seconds
    if (time > 30) {
        while (chart.data.datasets[0].data.length > 0 && 
               chart.data.datasets[0].data[0].x < time - 30) {
            chart.data.datasets[0].data.shift();
        }
        chart.options.scales.x.min = time - 30;
        chart.options.scales.x.max = time;
    }
    
    chart.update('none');
}

// Initialize when the page loads
window.addEventListener('load', initializeFloatSwitchSimulation); 