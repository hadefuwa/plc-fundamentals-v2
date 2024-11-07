let charts = {
    statusChart: null,
    analogueChart: null
};
let lastEstopState = true; // Initialize to true since that's the normal state
let lastLedState = false;
let isChartPaused = false;

document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupDataListeners();

    const ipInput = document.getElementById('plc-ip');
    const connectBtn = document.getElementById('connect-btn');

    // Update config panel toggle functionality
    const configHeader = document.querySelector('.config-header');
    const configPanel = document.getElementById('config-panel');

    function toggleConfig() {
        configPanel.classList.toggle('collapsed');
        configHeader.classList.toggle('open');
    }

    configHeader.addEventListener('click', toggleConfig);

    // Status updates
    window.electron.receiveStatus((status) => {
        const plcData = document.getElementById('plc-data');
        if (plcData) {
            // Remove loading state
            plcData.classList.remove('loading');
            
            // Update status as before
            plcData.textContent = status;
            plcData.classList.toggle('disconnected', !status.includes('Connected'));
        }

        const isConnected = status === 'Connected to PLC';
        const ledCircle = document.getElementById('led-circle');
        const estopCircle = document.getElementById('estop-circle');

        // Update circles connection state
        if (ledCircle) {
            if (!isConnected) {
                ledCircle.classList.add('disconnected');
            } else {
                ledCircle.classList.remove('disconnected');
            }
        }

        if (estopCircle) {
            if (!isConnected) {
                estopCircle.classList.add('disconnected');
                estopCircle.classList.remove('flashing');  // Stop flashing when disconnected
            } else {
                estopCircle.classList.remove('disconnected');
            }
        }

        // Update the status value display
        const statusValue = document.getElementById('status-value');
        if (statusValue) {
            const isConnected = status === 'Connected to PLC';
            statusValue.textContent = isConnected ? 'Connected' : 'Disconnected';
            statusValue.className = `status-value ${isConnected ? 'connected' : 'disconnected'}`;
        }
    });

  // PLC data updates
  window.electron.receiveData((data) => {
    
    const ledCircle = document.getElementById('led-circle');
    const estopCircle = document.getElementById('estop-circle');
    
    // Only update circles if we have a connection
    if (ledCircle && !ledCircle.classList.contains('disconnected')) {
        const currentLedState = data.outputs.a[0].state;
        
        // Check for LED state changes
        if (currentLedState !== lastLedState) {
            addEvent('led', currentLedState, Date.now());
            lastLedState = currentLedState;
        }
        
        ledCircle.classList.toggle('active', currentLedState);
    }
    
    if (estopCircle && !estopCircle.classList.contains('disconnected')) {
        const currentEstopState = data.inputs.a[0].state;
        
        // Check for falling edge (true to false transition)
        if (lastEstopState === true && currentEstopState === false) {
            addEvent('estop', false, Date.now());
        }
        
        // Update E-Stop circle state
        if (currentEstopState) {
            estopCircle.classList.add('active');
            estopCircle.classList.remove('flashing');
        } else {
            estopCircle.classList.remove('active');
            estopCircle.classList.add('flashing');
        }

        // Update last known state
        lastEstopState = currentEstopState;
    }

    // Update Analogue Input handling
    if (charts.analogueChart && !isChartPaused) {
        const now = new Date();
        
        // Update the digital displays
        const analogueValue0 = document.getElementById('analogue-value-0');
        const analogueValue1 = document.getElementById('analogue-value-1');
        const ai0Grid = document.getElementById('ai0-value');
        const ai1Grid = document.getElementById('ai1-value');

        if (analogueValue0) analogueValue0.textContent = `${data.analogue.ai0.scaled.toFixed(2)}V`;
        if (analogueValue1) analogueValue1.textContent = `${data.analogue.ai1.scaled.toFixed(2)}V`;
        if (ai0Grid) ai0Grid.textContent = `${data.analogue.ai0.scaled.toFixed(2)}V`;
        if (ai1Grid) ai1Grid.textContent = `${data.analogue.ai1.scaled.toFixed(2)}V`;

        // Update chart data
        charts.analogueChart.data.datasets[0].data.push({
            x: now,
            y: data.analogue.ai0.scaled
        });
        charts.analogueChart.data.datasets[1].data.push({
            x: now,
            y: data.analogue.ai1.scaled
        });

        // Keep only last 30 seconds of data
        const cutoff = now.getTime() - (30 * 1000);
        charts.analogueChart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.filter(point => point.x.getTime() > cutoff);
        });

        // Find the maximum value in both datasets
        const maxValue = Math.max(
            ...charts.analogueChart.data.datasets[0].data.map(point => point.y),
            ...charts.analogueChart.data.datasets[1].data.map(point => point.y)
        );
        
        // Update the Y axis max with some headroom
        charts.analogueChart.options.scales.y.max = Math.ceil(maxValue * 1.1);
        
        charts.analogueChart.update('none'); // Use 'none' mode for better performance
    }
});

    // IP address validation
    function isValidIP(ip) {
        const pattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!pattern.test(ip)) return false;
        return ip.split('.').every(num => parseInt(num) >= 0 && parseInt(num) <= 255);
    }

    ipInput.addEventListener('input', (e) => {
        const ip = e.target.value;
        if (isValidIP(ip)) {
            ipInput.style.borderColor = '#4a4f55';
            connectBtn.disabled = false;
        } else {
            ipInput.style.borderColor = '#ff4444';
            connectBtn.disabled = true;
        }
    });

    connectBtn.addEventListener('click', () => {
        const ip = ipInput.value;
        if (isValidIP(ip)) {
            connectBtn.disabled = true;
            window.electron.updatePLCAddress(ip);
            window.electron.connectPLC();
            console.log('Attempting to connect to PLC at:', ip);
            
            // Optional: collapse the config panel after connecting
            configPanel.classList.add('collapsed');
            configHeader.classList.remove('open');
        }
    });

    // Add click handler for the analogue chart
    const analogueChart = document.querySelector('.dashboard-item:has(#analogueChart)');
    if (analogueChart) {
        analogueChart.style.cursor = 'pointer';
        analogueChart.addEventListener('click', () => {
            window.electron.openAnalogueWindow();
        });
    }

    const writeBtn = document.getElementById('write-btn');
    if (writeBtn) {
        writeBtn.addEventListener('click', () => {
            window.electron.writePLC();
        });
    }

    // Add to your existing event listeners
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const dataType = item.getAttribute('data-type');
            window.electron.openDetails(dataType);
        });
    });

    // Add to your data update function
    function updatePLCData(data) {
        // Update Digital Inputs A
        const dinAStatus = document.getElementById('din-a-status');
        if (dinAStatus) {
            const states = data.Static.CPU.Inputs.Digitals.A.map(d => d.State.MonitorValue).join('');
            dinAStatus.textContent = states;
        }

        // Similar updates for other values...
    }

    // Add this alongside your other event listeners
    window.electron.receiveDB1Data((data) => {
        // Throttle logging to every 5 seconds to avoid console spam
        const now = Date.now();
        if (!window.lastDB1Log || now - window.lastDB1Log >= 5000) {
            console.log('DB1 Data:', data);
            window.lastDB1Log = now;
        }
    });

    // Update the analogue chart click handler
    const analogueGridItem = document.querySelector('.grid-item[data-type="analogue"]');
    if (analogueGridItem) {
        analogueGridItem.addEventListener('click', () => {
            window.electron.openAnalogueWindow();
        });
    }

    // Add pause button handler
    const pauseButton = document.getElementById('pause-analogue');
    if (pauseButton) {
        pauseButton.addEventListener('click', (e) => {
            // Prevent event from bubbling up
            e.stopPropagation();
            
            isChartPaused = !isChartPaused;
            pauseButton.classList.toggle('paused');
            // Update button text
            pauseButton.textContent = isChartPaused ? 'Resume' : 'Pause';
        });
    }

    // If you have a separate handler for the analogue popup, 
    // make sure it's attached to a different element
    const analogueSection = document.querySelector('.dashboard-item[data-type="analogue"]');
    if (analogueSection) {
        analogueSection.addEventListener('click', (e) => {
            // Only trigger if not clicking the pause button
            if (!e.target.closest('#pause-analogue')) {
                window.electron.openAnalogueWindow();
            }
        });
    }
});

function initializeCharts() {
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    charts.statusChart = new Chart(statusCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Connection Status',
                data: [],
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                stepped: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#9da5b1'
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9da5b1'
                    }
                },
                y: {
                    min: -0.1,
                    max: 1.1,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9da5b1',
                        callback: function(value) {
                            if(value === 0) return 'Disconnected';
                            if(value === 1) return 'Connected';
                            return '';
                        }
                    }
                }
            }
        }
    });

    const analogueCtx = document.getElementById('analogueChart');
    if (analogueCtx) {
        charts.analogueChart = new Chart(analogueCtx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'AI0',
                    data: [],
                    borderColor: '#4BC0C0',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'AI1',
                    data: [],
                    borderColor: '#FF6384',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'second'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        suggestedMax: 10,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

function setupDataListeners() {
    window.electron.receiveStats((stats) => {
        if (charts.statusChart && stats.connectionStats.connectionHistory) {
            // Convert connection history to chart data points
            const newData = stats.connectionStats.connectionHistory.map(item => ({
                x: new Date(item.time),
                y: item.connected ? 1 : 0
            }));

            // Update the chart with the new data
            charts.statusChart.data.datasets[0].data = newData;
            charts.statusChart.update('quiet');
        }
    });
}

function addEvent(type, state, timestamp) {
    const listId = type === 'estop' ? 'estop-events-list' : 'led-events-list';
    const eventsList = document.getElementById(listId);
    if (!eventsList) return;

    const li = document.createElement('li');
    li.className = `${type}-event`;
    const date = new Date(timestamp);
    
    const message = type === 'estop' 
        ? 'E-Stop Triggered'
        : (state ? 'LED Turned ON' : 'LED Turned OFF');

    li.innerHTML = `
        <span class="event-message">${message}</span>
        <span class="event-time">${date.toLocaleTimeString()}</span>
    `;

    // Add to the beginning of the list
    eventsList.insertBefore(li, eventsList.firstChild);

    // Keep only the last 50 events
    while (eventsList.children.length > 50) {
        eventsList.removeChild(eventsList.lastChild);
    }
}

window.electron.receive('plc-data', (data) => {
    console.log('Received analogue data:', {
        AI0: data['DB1,REAL32'],
        AI1: data['DB1,REAL46']
    });

    // Update analogue value displays
    const analogueValue0 = document.getElementById('analogue-value-0');
    const analogueValue1 = document.getElementById('analogue-value-1');
    const ai0Grid = document.getElementById('ai0-value');
    const ai1Grid = document.getElementById('ai1-value');

    // Get the values using correct addresses
    const ai0Value = Number(data['DB1,REAL32']) || 0;
    const ai1Value = Number(data['DB1,REAL46']) || 0;

    // Update displays
    analogueValue0.textContent = `${ai0Value.toFixed(2)}V`;
    analogueValue1.textContent = `${ai1Value.toFixed(2)}V`;
    ai0Grid.textContent = `${ai0Value.toFixed(2)}V`;
    ai1Grid.textContent = `${ai1Value.toFixed(2)}V`;

    // Update chart
    if (analogueChart) {
        const now = new Date();
        
        // Add new data points
        analogueChart.data.labels.push(now);
        analogueChart.data.datasets[0].data.push(ai0Value);
        analogueChart.data.datasets[1].data.push(ai1Value);

        // Keep only last 50 points
        if (analogueChart.data.labels.length > 50) {
            analogueChart.data.labels.shift();
            analogueChart.data.datasets[0].data.shift();
            analogueChart.data.datasets[1].data.shift();
        }

        // Update the chart
        analogueChart.update('none'); // Use 'none' mode for better performance
    }
});
