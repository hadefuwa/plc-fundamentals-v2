let charts = {
    status: null,
    analogue: null
};
let lastEstopState = true; // Initialize to true since that's the normal state
let lastLedState = false;
let isChartPaused = false;
let acknowledgedFaults = new Set();
let lastConnectionStatus = null;
let lastStatus = null;
let chartUpdateInterval;

let initialized = false;  // Flag to prevent multiple initializations

let lastKnownStatus = localStorage.getItem('plcStatus') || 'Loading...';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, restoring last known status...');
    
    // Restore last known status
    const statusElement = document.getElementById('plc-data');
    if (statusElement && lastKnownStatus !== 'Loading...') {
        updateConnectionStatus(lastKnownStatus);
    }
    
    // Request current status from main process
    window.electron.requestStatus();

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

    window.electron.receiveData((data) => {
        try {
            //console.log('Received PLC data:', data);
            
            if (data && data.db1) {
                // LED Circle updates (Output A0)
                const ledCircle = document.getElementById('led-circle');
                if (ledCircle && !ledCircle.classList.contains('disconnected')) {
                    // Access the state using the correct path
                    const currentLedState = data.db1.outputs.a[0].state;
                    if (currentLedState !== lastLedState) {
                        addEvent('led', currentLedState, Date.now());
                        lastLedState = currentLedState;
                    }
                    ledCircle.classList.toggle('active', currentLedState);
                }
                
                // E-Stop updates (Input A0)
                const estopCircle = document.getElementById('estop-circle');
                if (estopCircle && !estopCircle.classList.contains('disconnected')) {
                    // Access the state using the correct path
                    const currentEstopState = data.db1.inputs.a[0].state;
                    
                    if (lastEstopState === true && currentEstopState === false) {
                        addEvent('estop', false, Date.now());
                    }
                    
                    if (currentEstopState) {
                        estopCircle.classList.add('active');
                        estopCircle.classList.remove('flashing');
                    } else {
                        estopCircle.classList.remove('active');
                        estopCircle.classList.add('flashing');
                    }

                    lastEstopState = currentEstopState;
                }

                // Analogue updates
                if (charts.analogue && !isChartPaused) {
                    const now = new Date();
                    
                    // Update digital displays
                    const analogueValue0 = document.getElementById('analogue-value-0');
                    const analogueValue1 = document.getElementById('analogue-value-1');
                    const ai0Grid = document.getElementById('ai0-value');
                    const ai1Grid = document.getElementById('ai1-value');

                    // Update displays if they exist
                    if (analogueValue0 && data.db1.analogue.ai0) {
                        analogueValue0.textContent = `${data.db1.analogue.ai0.scaled.toFixed(2)}V`;
                    }
                    if (analogueValue1 && data.db1.analogue.ai1) {
                        analogueValue1.textContent = `${data.db1.analogue.ai1.scaled.toFixed(2)}V`;
                    }
                    if (ai0Grid && data.db1.analogue.ai0) {
                        ai0Grid.textContent = `${data.db1.analogue.ai0.scaled.toFixed(2)}V`;
                    }
                    if (ai1Grid && data.db1.analogue.ai1) {
                        ai1Grid.textContent = `${data.db1.analogue.ai1.scaled.toFixed(2)}V`;
                    }

                    // Update chart if analogue data exists
                    if (data.db1.analogue.ai0 && data.db1.analogue.ai1) {
                        charts.analogue.data.datasets[0].data.push({
                            x: now,
                            y: data.db1.analogue.ai0.scaled
                        });
                        charts.analogue.data.datasets[1].data.push({
                            x: now,
                            y: data.db1.analogue.ai1.scaled
                        });

                        // Keep only last 30 seconds of data
                        const cutoff = now.getTime() - (30 * 1000);
                        charts.analogue.data.datasets.forEach(dataset => {
                            dataset.data = dataset.data.filter(point => point.x.getTime() > cutoff);
                        });

                        // Find the maximum value in both datasets
                        const maxValue = Math.max(
                            ...charts.analogue.data.datasets[0].data.map(point => point.y),
                            ...charts.analogue.data.datasets[1].data.map(point => point.y)
                        );
                        
                        // Update the Y axis max with some headroom
                        charts.analogue.options.scales.y.max = Math.ceil(maxValue * 1.1);
                        
                        charts.analogue.update('none');
                    }
                }
            }

            // Handle faults data
            if (data && data.faults) {
                handleFaultBanner(data.faults);
            }

        } catch (error) {
            console.error('Error processing PLC data:', error);
            console.error('Data structure:', data);
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
            //console.log('Attempting to connect to PLC at:', ip);
            
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

    // Existing motor button
    document.getElementById('write-btn').addEventListener('click', () => {
        window.electron.writePLC();
    });

    // New clear forcing button
    document.getElementById('clear-forcing-btn').addEventListener('click', () => {
        window.electron.clearForcing();
    });

    // New fault reset button
    document.getElementById('fault-reset-btn').addEventListener('click', () => {
        window.electron.faultReset();
    });

    // Add to your existing event listeners
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const dataType = item.getAttribute('data-type');
            window.location.href = 'plc-details.html';
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

    // Listen for DB1 data and send it to plc-details.html
    window.electron.receiveDB1Data((data) => {
        document.querySelector('#plc-tags-table').contentWindow.updatePLCTags(data);
    });


    // Add this alongside your other event listeners
    window.electron.receiveDB1Data((data) => {
        //console.log('Received DB1 data in renderer:', data); // Debug log
        updatePLCTags(data);
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
        // Separate function to handle fault banner
        function handleFaultBanner(faultsData) {
            //console.log('Processing faults data:', faultsData); // Debug log
    
            const faultBanner = document.getElementById('fault-banner');
            const faultMessage = document.getElementById('fault-message');
    
            if (!faultBanner || !faultMessage) {
                console.warn('Fault banner elements not found');
                return;
            }
    
            // Check if there are any active faults
            const activeFaults = faultsData.activeFaults || [];
            //console.log('Active faults:', activeFaults);
    
            if (activeFaults.length > 0) {
                // Format fault names for display
                const faultList = activeFaults.map(fault => 
                    fault.replace(/([A-Z])/g, ' $1').trim()
                ).join(', ');
    
                faultMessage.textContent = `Active Faults: ${faultList}`;
                faultBanner.classList.remove('hidden');
                //console.log('Showing fault banner with message:', faultList); // Debug log
            } else {
                faultBanner.classList.add('hidden');
                //console.log('Hiding fault banner - no active faults'); // Debug log
            }
        }
    
        // Acknowledge button handler
        const acknowledgeButton = document.getElementById('acknowledge-fault');
        if (acknowledgeButton) {
            acknowledgeButton.addEventListener('click', () => {
                const faultBanner = document.getElementById('fault-banner');
                if (faultBanner) {
                    faultBanner.classList.add('hidden');
                }
            });
        }

    startChartUpdates();
});

function initializeCharts() {
    console.log('Initializing charts...');
    
    // Initialize Status Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        if (charts.status) {
            charts.status.destroy();
        }
        charts.status = new Chart(statusCtx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'PLC Connection Status',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    fill: true
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
                            unit: 'second',
                            displayFormats: {
                                second: 'HH:mm:ss'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        min: -0.1,
                        max: 1.1,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                if(value === 0) return 'Disconnected';
                                if(value === 1) return 'Connected';
                                return '';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw.y === 1 ? 'Connected' : 'Disconnected';
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize Analogue Chart
    const analogueCtx = document.getElementById('analogueChart');
    if (analogueCtx) {
        if (charts.analogue) {
            charts.analogue.destroy();
        }
        charts.analogue = new Chart(analogueCtx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'AI0',
                        data: [],
                        borderColor: '#4BC0C0',  // Cyan color
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 2,
                        pointRadius: 2,          // Smaller points
                        pointBackgroundColor: '#4BC0C0',
                        pointBorderColor: '#4BC0C0',
                        tension: 0.3,            // Slight curve to lines
                        fill: true
                    },
                    {
                        label: 'AI1',
                        data: [],
                        borderColor: '#FF6B6B',  // Coral red color
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        pointRadius: 2,          // Smaller points
                        pointBackgroundColor: '#FF6B6B',
                        pointBorderColor: '#FF6B6B',
                        tension: 0.3,            // Slight curve to lines
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
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
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#aaa'
                        }
                    },
                    y: {
                        min: 0,
                        suggestedMax: 10,  // Initial max that will be updated dynamically
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#aaa',
                            callback: function(value) {
                                return value.toFixed(1) + 'V';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#fff',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }

    // Start updates for both charts
    startChartUpdates();
}

// Add page visibility handling
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('Page became visible, reinitializing charts...');
        initializeCharts();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (charts.status) {
        charts.status.destroy();
    }
    if (charts.analogue) {
        charts.analogue.destroy();
    }
    if (chartUpdateInterval) {
        clearInterval(chartUpdateInterval);
    }
});

function setupDataListeners() {
    window.electron.receiveStats((stats) => {
        if (charts.status && stats.connectionStats.connectionHistory) {
            // Convert connection history to chart data points
            const newData = stats.connectionStats.connectionHistory.map(item => ({
                x: new Date(item.time),
                y: item.connected ? 1 : 0
            }));

            // Update the chart with the new data
            charts.status.data.datasets[0].data = newData;
            charts.status.update('quiet');
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

function openPLCDetails() {
    window.location.href = 'plc-details.html';
}

window.electron.onConnectionChange((status) => {
    console.log('Connection status changed:', status);
    const statusElement = document.getElementById('plc-data');
    if (statusElement) {
        statusElement.textContent = status ? 'Connected' : 'Disconnected';
        statusElement.className = `status-value ${status ? 'connected' : 'disconnected'}`;
    }
    updateStatusChart(status);
});

function updateStatusChart(connected) {
    console.log('updateStatusChart called with:', connected);
    
    if (!charts.status) {
        console.error('Status chart not initialized!');
        return;
    }

    try {
        const now = new Date();
        const newDataPoint = {
            x: now,
            y: connected ? 1 : 0
        };
        console.log('Adding new data point:', newDataPoint);
        
        charts.status.data.datasets[0].data.push(newDataPoint);

        // Keep only last 30 seconds of data
        const cutoff = now.getTime() - (30 * 1000);
        const oldLength = charts.status.data.datasets[0].data.length;
        charts.status.data.datasets[0].data = charts.status.data.datasets[0].data
            .filter(point => point.x.getTime() > cutoff);
        console.log(`Filtered data points: ${oldLength} -> ${charts.status.data.datasets[0].data.length}`);

        charts.status.update('none');
        console.log('Chart updated successfully');
    } catch (error) {
        console.error('Error updating status chart:', error);
        console.error('Current chart state:', charts.status);
    }
}

// Add this debug function
function debugChartStatus() {
    console.log('Chart object exists:', charts !== null);
    console.log('Status chart exists:', charts?.status !== null);
    if (charts?.status) {
        console.log('Current chart data:', charts.status.data.datasets[0].data);
    }
    console.log('Canvas element exists:', document.getElementById('statusChart') !== null);
}

// Update your status handler
window.electron.onPlcStatus((status) => {
    console.log('Received PLC status update:', status);
    updateConnectionStatus(status);
});

function updateConnectionStatus(status) {
    const statusElement = document.getElementById('plc-data');
    if (statusElement) {
        statusElement.classList.remove('loading');
        statusElement.textContent = status;
        statusElement.className = `status-value ${status === 'Connected to PLC' ? 'connected' : 'disconnected'}`;
        
        lastKnownStatus = status;
        localStorage.setItem('plcStatus', status);
    }
}

function startChartUpdates() {
    if (chartUpdateInterval) {
        clearInterval(chartUpdateInterval);
    }

    chartUpdateInterval = setInterval(() => {
        if (!charts?.status) {
            console.error('Status chart not available for update');
            return;
        }

        try {
            const now = new Date();
            const currentStatus = document.getElementById('plc-data')?.textContent || 'Disconnected';
            const statusValue = currentStatus === 'Connected to PLC' ? 1 : 0;

            console.log('Adding regular status point:', { time: now, status: statusValue });
            
            charts.status.data.datasets[0].data.push({
                x: now,
                y: statusValue
            });

            // Keep last 2 minutes of data instead of 30 seconds
            const cutoff = now.getTime() - (120 * 1000);  // 120 seconds history
            charts.status.data.datasets[0].data = charts.status.data.datasets[0].data
                .filter(point => point.x.getTime() > cutoff);
            
            charts.status.update('none');
        } catch (error) {
            console.error('Error updating status chart:', error);
        }
    }, 1000);
}

// Clean up interval when window is closed
window.addEventListener('beforeunload', () => {
    if (chartUpdateInterval) {
        clearInterval(chartUpdateInterval);
    }
});
