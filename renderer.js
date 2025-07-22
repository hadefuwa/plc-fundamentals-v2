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

let connectionHistoryBuffer = [];
const MAX_HISTORY_POINTS = 120; // 2 minutes worth of data at 1-second intervals

function addConnectionDataPoint(connected) {
    const now = new Date();
    connectionHistoryBuffer.push({
        x: now,
        y: connected ? 1 : 0
    });

    // Keep only last 2 minutes of data
    const cutoff = now.getTime() - (120 * 1000);
    connectionHistoryBuffer = connectionHistoryBuffer.filter(point => 
        point.x.getTime() > cutoff
    );
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, restoring last known status...');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Toggle icon between bars and times (x)
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });

        // Close menu when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });

        // Close menu when clicking a nav link
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }
    
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

    if (configHeader) {
        configHeader.addEventListener('click', toggleConfig);
    }

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
                // Store the DB1 data globally for use in the modal
                plcData = data.db1;

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

                // Analogue updates - only if we're still on the PLC controls page
                if (charts.analogue && !isChartPaused && charts.analogue.data && charts.analogue.data.datasets && 
                    document.getElementById('analogueChart') && document.getElementById('statusChart')) {
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
                        try {
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
                            if (charts.analogue.options && charts.analogue.options.scales && charts.analogue.options.scales.y) {
                                charts.analogue.options.scales.y.max = Math.ceil(maxValue * 1.1);
                            }
                            
                            // Only update if chart is still valid
                            if (charts.analogue && typeof charts.analogue.update === 'function') {
                                charts.analogue.update('none');
                            }
                        } catch (chartError) {
                            console.warn('Chart update error:', chartError);
                            // If chart is broken, reinitialize it
                            setTimeout(() => {
                                if (document.getElementById('analogueChart')) {
                                    initializeCharts();
                                }
                            }, 1000);
                        }
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

    if (ipInput) {
        ipInput.addEventListener('input', (e) => {
            const ip = e.target.value;
            if (isValidIP(ip)) {
                ipInput.style.borderColor = '#4a4f55';
                if (connectBtn) connectBtn.disabled = false;
            } else {
                ipInput.style.borderColor = '#ff4444';
                if (connectBtn) connectBtn.disabled = true;
            }
        });
    }

    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            const ip = ipInput ? ipInput.value : '';
            if (isValidIP(ip)) {
                connectBtn.disabled = true;
                window.electron.updatePLCAddress(ip);
                window.electron.connectPLC();
                //console.log('Attempting to connect to PLC at:', ip);
                
                // Optional: collapse the config panel after connecting
                if (configPanel) configPanel.classList.add('collapsed');
                if (configHeader) configHeader.classList.remove('open');
            }
        });
    }

    // Existing motor button
    const writeBtn = document.getElementById('write-btn');
    if (writeBtn) {
        writeBtn.addEventListener('click', () => {
            window.electron.writePLC();
        });
    }

    // New clear forcing button
    const clearForcingBtn = document.getElementById('clear-forcing-btn');
    if (clearForcingBtn) {
        clearForcingBtn.addEventListener('click', () => {
            window.electron.clearForcing();
        });
    }

    // New fault reset button
    const faultResetBtn = document.getElementById('fault-reset-btn');
    if (faultResetBtn) {
        faultResetBtn.addEventListener('click', () => {
            window.electron.faultReset();
        });
    }

    // Add to your existing event listeners
    document.querySelectorAll('.grid-item').forEach(item => {
        console.log('Setting up event listener for grid item:', item.textContent);
        item.addEventListener('click', () => {
            console.log('Grid item clicked:', item.textContent);
            const dataType = item.getAttribute('data-type');
            
            // Clean up charts before navigation
            if (charts.status) {
                try {
                    charts.status.destroy();
                    charts.status = null;
                } catch (error) {
                    console.warn('Error destroying status chart:', error);
                }
            }
            if (charts.analogue) {
                try {
                    charts.analogue.destroy();
                    charts.analogue = null;
                } catch (error) {
                    console.warn('Error destroying analogue chart:', error);
                }
            }
            
            // Clear any intervals
            if (chartUpdateInterval) {
                clearInterval(chartUpdateInterval);
                chartUpdateInterval = null;
            }
            
            console.log('Navigating to plc-details.html');
            window.location.href = 'plc-details.html';
        });
    });
    
    // (No event listeners or navigation code for the View All PLC Tags button)

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
    
    try {
        // Initialize Status Chart
        const statusCtx = document.getElementById('statusChart');
        if (statusCtx) {
            if (charts.status) {
                try {
                    charts.status.destroy();
                } catch (destroyError) {
                    console.warn('Error destroying status chart:', destroyError);
                }
            }
            charts.status = new Chart(statusCtx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'PLC Connection Status',
                    data: [...connectionHistoryBuffer],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#4CAF50',
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
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        min: -0.1,
                        max: 1.1,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'white',
                            callback: function(value) {
                                if(value === 0) return 'Disconnected';
                                if(value === 1) return 'Connected';
                                return '';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    },
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
                try {
                    charts.analogue.destroy();
                } catch (destroyError) {
                    console.warn('Error destroying analogue chart:', destroyError);
                }
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
                        pointRadius: 2,
                        pointBackgroundColor: '#4BC0C0',
                        pointBorderColor: '#4BC0C0',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'AI1',
                        data: [],
                        borderColor: '#FF6B6B',  // Coral red color
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        pointRadius: 2,
                        pointBackgroundColor: '#FF6B6B',
                        pointBorderColor: '#FF6B6B',
                        tension: 0.3,
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
                            color: 'white'
                        }
                    },
                    y: {
                        min: 0,
                        suggestedMax: 10,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'white',
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
                            color: 'white',
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
    
    } catch (error) {
        console.error('Error initializing charts:', error);
        // Try to reinitialize after a delay
        setTimeout(() => {
            if (document.getElementById('statusChart') || document.getElementById('analogueChart')) {
                console.log('Retrying chart initialization...');
                initializeCharts();
            }
        }, 2000);
    }
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
        if (charts.status && charts.status.data && charts.status.data.datasets && stats.connectionStats.connectionHistory && 
            document.getElementById('statusChart')) {
            try {
                // Convert connection history to chart data points
                const newData = stats.connectionStats.connectionHistory.map(item => ({
                    x: new Date(item.time),
                    y: item.connected ? 1 : 0
                }));

                // Update the chart with the new data
                charts.status.data.datasets[0].data = newData;
                
                // Only update if chart is still valid
                if (charts.status && typeof charts.status.update === 'function') {
                    charts.status.update('quiet');
                }
            } catch (chartError) {
                console.warn('Status chart update error:', chartError);
                // If chart is broken, reinitialize it
                setTimeout(() => {
                    if (document.getElementById('statusChart')) {
                        initializeCharts();
                    }
                }, 1000);
            }
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
    addConnectionDataPoint(connected);
    
    if (charts.status && charts.status.data && charts.status.data.datasets && document.getElementById('statusChart')) {
        try {
            charts.status.data.datasets[0].data = [...connectionHistoryBuffer];
            
            // Only update if chart is still valid
            if (charts.status && typeof charts.status.update === 'function') {
                charts.status.update('none');
            }
        } catch (chartError) {
            console.warn('Status chart update error:', chartError);
            // If chart is broken, reinitialize it
            setTimeout(() => {
                if (document.getElementById('statusChart')) {
                    initializeCharts();
                }
            }, 1000);
        }
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
        const currentStatus = document.getElementById('plc-data')?.textContent || 'Disconnected';
        const statusValue = currentStatus === 'Connected to PLC' ? 1 : 0;
        
        addConnectionDataPoint(statusValue);
        
        if (charts.status && charts.status.data && charts.status.data.datasets && document.getElementById('statusChart')) {
            try {
                charts.status.data.datasets[0].data = [...connectionHistoryBuffer];
                
                // Only update if chart is still valid
                if (charts.status && typeof charts.status.update === 'function') {
                    charts.status.update('none');
                }
            } catch (chartError) {
                console.warn('Status chart update error:', chartError);
                // If chart is broken, reinitialize it
                setTimeout(() => {
                    if (document.getElementById('statusChart')) {
                        initializeCharts();
                    }
                }, 1000);
            }
        }
    }, 1000);
}

// Clean up interval when window is closed
window.addEventListener('beforeunload', () => {
    if (chartUpdateInterval) {
        clearInterval(chartUpdateInterval);
    }
});

// Optional: Save buffer to localStorage when window is hidden
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        localStorage.setItem('connectionHistory', JSON.stringify(connectionHistoryBuffer));
    }
});

// Optional: Restore buffer from localStorage when page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedHistory = localStorage.getItem('connectionHistory');
    if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        connectionHistoryBuffer = parsedHistory.map(point => ({
            x: new Date(point.x),
            y: point.y
        }));
        // Remove any stale data
        const cutoff = Date.now() - (120 * 1000);
        connectionHistoryBuffer = connectionHistoryBuffer.filter(point => 
            new Date(point.x).getTime() > cutoff
        );
    }
});

// Add this function to handle the modal interaction
window.modifyValue = function(type, channel) {
    const modal = document.getElementById('modify-modal');
    const input = document.getElementById('value-input');
    const saveBtn = document.getElementById('modal-save');
    const cancelBtn = document.getElementById('modal-cancel');
    const titleElement = document.getElementById('modal-title');
    
    // Set the title based on what's being modified
    titleElement.textContent = `Modify ${type} for AI${channel}`;
    
    // Get current value from plcData
    const currentValue = type === 'offset' 
        ? plcData.analogue[`ai${channel}`].offset 
        : plcData.analogue[`ai${channel}`].scalar;
    
    input.value = currentValue;
    modal.style.display = 'block';
    input.focus();

    // Handle save
    const handleSave = () => {
        const newValue = parseFloat(input.value);
        if (!isNaN(newValue)) {
            window.electron.modifyAnalogue(channel, type, newValue);
            console.log(`Sending ${type} modification for AI${channel}: ${newValue}`);
        }
        modal.style.display = 'none';
        cleanup();
    };

    // Handle cancel
    const handleCancel = () => {
        modal.style.display = 'none';
        cleanup();
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    // Set up event listeners
    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', handleCancel);
    input.addEventListener('keyup', handleKeyPress);
    
    // Cleanup function
    const cleanup = () => {
        saveBtn.removeEventListener('click', handleSave);
        cancelBtn.removeEventListener('click', handleCancel);
        input.removeEventListener('keyup', handleKeyPress);
    };
};

// Add this event listener for the print button
const printAnalogueBtn = document.getElementById('print-analogue');
if (printAnalogueBtn) {
    printAnalogueBtn.addEventListener('click', async function() {
    try {
        // Get the original chart instance
        const originalChart = Chart.getChart(document.getElementById('analogueChart'));
        
        // Create a temporary canvas with larger dimensions for better print quality
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = originalChart.canvas.width * 2;  // Double the size for better quality
        tempCanvas.height = originalChart.canvas.height * 2;
        
        const ctx = tempCanvas.getContext('2d');
        ctx.scale(2, 2);  // Scale up for better resolution
        
        const tempChart = new Chart(ctx, {
            type: originalChart.config.type,
            data: originalChart.data,
            options: {
                ...originalChart.config.options,
                animation: false,
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ...originalChart.config.options.scales.x,
                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
                        ticks: { color: 'black', font: { size: 11 } }
                    },
                    y: {
                        ...originalChart.config.options.scales.y,
                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
                        ticks: { color: 'black', font: { size: 11 } }
                    }
                },
                plugins: {
                    legend: {
                        labels: { 
                            color: 'black',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });

        // Wait for the chart to render
        await new Promise(resolve => setTimeout(resolve, 200));

        // Get the base64 image
        const chartImage = tempCanvas.toDataURL('image/png', 1.0);
        
        // Clean up
        tempChart.destroy();

        // Send to main process for printing
        const htmlContent = `
            <html>
                <head>
                    <title>Analogue Inputs Chart</title>
                    <style>
                        @page {
                            size: landscape;
                            margin: 1cm;
                        }
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                        }
                        .chart-container {
                            width: 90%;
                            margin: 0 auto;
                        }
                        img {
                            width: 100%;
                            max-height: 70vh;
                            object-fit: contain;
                        }
                        h2 {
                            color: black;
                            margin-bottom: 20px;
                        }
                        .timestamp {
                            margin-top: 20px;
                            color: black;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="chart-container">
                        <h2>Analogue Inputs Chart</h2>
                        <img src="${chartImage}" />
                        <div class="timestamp">
                            Printed: ${new Date().toLocaleString()}
                        </div>
                    </div>
                </body>
            </html>
        `;

        window.electron.printChart(htmlContent);

    } catch (error) {
        console.error('Error preparing chart for print:', error);
    }
    });
}

// HMI Webview Functionality
document.addEventListener('DOMContentLoaded', function() {
    // HMI Interface Controls
    const hmiWebview = document.getElementById('hmi-webview');
    const hmiStatus = document.getElementById('hmi-status');
    const refreshHmiBtn = document.getElementById('refresh-hmi');
    const zoomInHmiBtn = document.getElementById('zoom-in-hmi');
    const zoomOutHmiBtn = document.getElementById('zoom-out-hmi');
    const resetZoomHmiBtn = document.getElementById('reset-zoom-hmi');

    let currentZoomLevel = 0; // 0 = 100%

    // Show status message
    function showHmiStatus(message, duration = 2000) {
        if (hmiStatus) {
            hmiStatus.textContent = message;
            hmiStatus.classList.remove('hidden');
            setTimeout(() => {
                hmiStatus.classList.add('hidden');
            }, duration);
        }
    }

    // HMI Offline Overlay Functions
    function showHmiOfflineOverlay() {
        let overlay = document.getElementById('hmi-offline-overlay');
        if (!overlay) {
            overlay = createHmiOfflineOverlay();
        }
        overlay.classList.remove('hidden');
    }

    function hideHmiOfflineOverlay() {
        const overlay = document.getElementById('hmi-offline-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    function createHmiOfflineOverlay() {
        const hmiContainer = document.getElementById('hmi-container');
        if (!hmiContainer) return null;

        const overlay = document.createElement('div');
        overlay.id = 'hmi-offline-overlay';
        overlay.className = 'hmi-offline-overlay';
        overlay.innerHTML = `
            <div class="hmi-offline-content">
                <div class="hmi-offline-icon">
                    <i class="fas fa-wifi-slash"></i>
                </div>
                <h3>No HMI Available</h3>
                <p>Unable to connect to HMI server</p>
                <div class="hmi-offline-details">
                    <p><strong>Server:</strong> https://192.168.7.101/device/WebRH</p>
                    <p><strong>Status:</strong> Connection Timeout</p>
                </div>
                <button id="refresh-hmi-connection" class="hmi-refresh-btn">
                    <i class="fas fa-sync-alt"></i> Refresh Connection
                </button>
            </div>
        `;

        // Add click event to refresh button
        overlay.querySelector('#refresh-hmi-connection').addEventListener('click', function() {
            showHmiStatus('Attempting to reconnect...');
            if (hmiWebview) {
                hmiWebview.reload();
            }
        });

        hmiContainer.appendChild(overlay);
        return overlay;
    }

    // Webview event listeners
    if (hmiWebview) {
        // Set initial zoom level
        const setDefaultZoom = async () => {
            try {
                // Get saved settings
                const settings = await window.electron.getSettings();
                // Set zoom from settings
                currentZoomLevel = Math.log(settings.hmiZoomLevel / 100) / Math.log(1.2);
                hmiWebview.setZoomLevel(currentZoomLevel);
                const zoomPercent = Math.round(Math.pow(1.2, currentZoomLevel) * 100);
                console.log('Setting default zoom level:', currentZoomLevel, 'Zoom:', zoomPercent + '%');
                showHmiStatus(`HMI Interface Ready - Zoom: ${zoomPercent}%`);
            } catch (error) {
                console.warn('Failed to set zoom level:', error);
            }
        };

        // Set zoom when webview is ready
        hmiWebview.addEventListener('dom-ready', function() {
            console.log('HMI interface loaded successfully');
            setDefaultZoom();
            // Set zoom again after a short delay to ensure it sticks
            setTimeout(setDefaultZoom, 500);
            hideHmiOfflineOverlay();
            
            // Clear any existing timeout since the page loaded successfully
            if (window.hmiTimeoutId) {
                clearTimeout(window.hmiTimeoutId);
                window.hmiTimeoutId = null;
            }
        });

        hmiWebview.addEventListener('did-start-loading', function() {
            console.log('HMI interface loading...');
            showHmiStatus('Loading HMI Interface...', 5000);
            hideHmiOfflineOverlay();
            
            // Clear any existing timeout before setting a new one
            if (window.hmiTimeoutId) {
                clearTimeout(window.hmiTimeoutId);
            }
            
            // Set a timeout to show offline overlay if connection takes too long
            // Give users 60 seconds to enter login credentials
            window.hmiTimeoutId = setTimeout(() => {
                // Check if the webview is still loading and hasn't completed
                if (hmiWebview.isLoading && hmiWebview.isLoading()) {
                    console.log('HMI still loading after 60 seconds, showing offline overlay');
                    showHmiStatus('HMI taking longer than expected - check connection', 3000);
                    showHmiOfflineOverlay();
                }
                window.hmiTimeoutId = null;
            }, 60000); // 60 second timeout - enough time for login
        });

        hmiWebview.addEventListener('did-fail-load', function(event) {
            console.error('HMI interface failed to load:', event.errorDescription);
            showHmiStatus('Failed to load HMI Interface', 5000);
            showHmiOfflineOverlay();
            
            // Clear any existing timeout since the page failed to load
            if (window.hmiTimeoutId) {
                clearTimeout(window.hmiTimeoutId);
                window.hmiTimeoutId = null;
            }
        });
    }

    // Control button events
    if (refreshHmiBtn) {
        refreshHmiBtn.addEventListener('click', function() {
            console.log('Refreshing HMI interface');
            showHmiStatus('Refreshing...');
            hideHmiOfflineOverlay();
            if (hmiWebview) {
                hmiWebview.reload();
            }
        });
    }

    if (zoomOutHmiBtn) {
        zoomOutHmiBtn.addEventListener('click', async function() {
            if (hmiWebview) {
                currentZoomLevel -= 0.1;  // Smaller increments for finer control
                if (currentZoomLevel < -2) currentZoomLevel = -2;
                hmiWebview.setZoomLevel(currentZoomLevel);
                const zoomPercent = Math.round(Math.pow(1.2, currentZoomLevel) * 100);
                console.log('Zoom OUT - Level:', currentZoomLevel, 'Percent:', zoomPercent + '%');
                showHmiStatus(`Zoom: ${zoomPercent}%`, 1000);
                
                // Save the new zoom level
                const settings = await window.electron.getSettings();
                settings.hmiZoomLevel = zoomPercent;
                await window.electron.saveSettings(settings);
            }
        });
    }

    if (zoomInHmiBtn) {
        zoomInHmiBtn.addEventListener('click', async function() {
            if (hmiWebview) {
                currentZoomLevel += 0.1;  // Smaller increments for finer control
                if (currentZoomLevel > 2) currentZoomLevel = 2;
                hmiWebview.setZoomLevel(currentZoomLevel);
                const zoomPercent = Math.round(Math.pow(1.2, currentZoomLevel) * 100);
                console.log('Zoom IN - Level:', currentZoomLevel, 'Percent:', zoomPercent + '%');
                showHmiStatus(`Zoom: ${zoomPercent}%`, 1000);
                
                // Save the new zoom level
                const settings = await window.electron.getSettings();
                settings.hmiZoomLevel = zoomPercent;
                await window.electron.saveSettings(settings);
            }
        });
    }

    if (resetZoomHmiBtn) {
        resetZoomHmiBtn.addEventListener('click', async function() {
            if (hmiWebview) {
                const settings = await window.electron.getSettings();
                currentZoomLevel = Math.log(settings.hmiZoomLevel / 100) / Math.log(1.2);
                hmiWebview.setZoomLevel(currentZoomLevel);
                const zoomPercent = settings.hmiZoomLevel;
                console.log('Reset zoom to saved default:', zoomPercent + '%');
                showHmiStatus(`Zoom: ${zoomPercent}%`, 1000);
            }
        });
    }
});

// PDF Integration Functions
function openPDF(pdfPath) {
    try {
        console.log('Attempting to open PDF:', pdfPath);
        // Use the exposed openPDF function from preload.js
        window.electron.openPDF(pdfPath);
        console.log('PDF open request sent successfully');
    } catch (error) {
        console.error('Error in openPDF function:', error);
    }
}

// Alias showPDF to openPDF for compatibility
const showPDF = openPDF;

// Add hover effects for PDF buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add PDF button hover effects
    function addPDFButtonEffects() {
        const pdfButtons = document.querySelectorAll('.pdf-button');
        pdfButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.background = '#555';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.background = '#444';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // Call after a short delay to ensure elements are rendered
    setTimeout(addPDFButtonEffects, 100);
});

// Settings Management
const defaultSettings = {
    hmiIpAddress: '192.168.0.1',
    hmiZoomLevel: 116,
    autoRefreshInterval: 0
};

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('appSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
        console.error('Error loading settings:', error);
        return defaultSettings;
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Initialize settings page if we're on it
document.addEventListener('DOMContentLoaded', function() {
    const isSettingsPage = document.getElementById('settings-btn');
    if (isSettingsPage) {
        const settings = loadSettings();
        
        // Initialize input values
        document.getElementById('hmi-ip').value = settings.hmiIpAddress;
        document.getElementById('hmi-zoom').value = settings.hmiZoomLevel;
        document.getElementById('auto-refresh').value = settings.autoRefreshInterval;

        // Save settings button
        document.getElementById('save-settings').addEventListener('click', function() {
            const newSettings = {
                hmiIpAddress: document.getElementById('hmi-ip').value,
                hmiZoomLevel: parseInt(document.getElementById('hmi-zoom').value),
                autoRefreshInterval: parseInt(document.getElementById('auto-refresh').value)
            };

            if (saveSettings(newSettings)) {
                showInlineNotification('Settings saved successfully! The page will reload to apply changes.', 'success');
                // Reload the page to apply new settings after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showInlineNotification('Failed to save settings. Please try again.', 'error');
            }
        });

        // Reset settings button
        document.getElementById('reset-settings').addEventListener('click', function() {
            showInlineConfirm(
                'Are you sure you want to reset all settings to default values? This action cannot be undone.',
                function() {
                    // On confirm
                    saveSettings(defaultSettings);
                    window.location.reload();
                },
                function() {
                    // On cancel - do nothing
                }
            );
        });
    }
});

// Update HMI webview initialization to use settings
const hmiWebview = document.querySelector('webview#hmi-interface');
if (hmiWebview) {
    const settings = loadSettings();
    
    // Set initial zoom level from settings
    const setDefaultZoom = () => {
        try {
            // Set zoom from settings
            currentZoomLevel = Math.log(settings.hmiZoomLevel / 100) / Math.log(1.2);
            hmiWebview.setZoomLevel(currentZoomLevel);
            const zoomPercent = Math.round(Math.pow(1.2, currentZoomLevel) * 100);
            console.log('Setting default zoom level:', currentZoomLevel, 'Zoom:', zoomPercent + '%');
            showHmiStatus(`HMI Interface Ready - Zoom: ${zoomPercent}%`);
        } catch (error) {
            console.warn('Failed to set zoom level:', error);
        }
    };

    // Auto-refresh timer
    let autoRefreshTimer = null;
    const startAutoRefresh = () => {
        if (settings.autoRefreshInterval > 0) {
            autoRefreshTimer = setInterval(() => {
                if (hmiWebview) {
                    console.log('Auto-refreshing HMI interface');
                    hmiWebview.reload();
                }
            }, settings.autoRefreshInterval * 1000);
        }
    };

    // Clear existing timer if any
    if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
    }

    // Set zoom when webview is ready
    hmiWebview.addEventListener('dom-ready', function() {
        console.log('HMI interface loaded successfully');
        setDefaultZoom();
        startAutoRefresh();
    });
}

// Function to open worksheets
function openWorksheet(number) {
    const pdfPath = `docs/worksheets/worksheet${number}.pdf`;
    window.electron.openPDF(pdfPath);
}

// Make the function available globally
window.openWorksheet = openWorksheet;

// Inline Notification System - No Popups, No Focus Issues
// Shows notifications directly in the UI without stealing focus

function showInlineNotification(message, type = 'info', duration = 4000) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.inline-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `inline-notification ${type}`;
    
    // Set notification content
    notification.innerHTML = `
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

function showInlineConfirm(message, onConfirm = null, onCancel = null) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.inline-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'inline-notification warning';
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-message">${message}</div>
        <div style="margin-top: 10px; text-align: right;">
            <button style="background: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;" onclick="handleInlineCancel()">Cancel</button>
            <button style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;" onclick="handleInlineConfirm()">Confirm</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Store callbacks
    window.inlineNotificationCallbacks = {
        onConfirm: onConfirm,
        onCancel: onCancel
    };
}

function handleInlineConfirm() {
    const callbacks = window.inlineNotificationCallbacks;
    const notification = document.querySelector('.inline-notification');
    if (notification) {
        notification.remove();
    }
    
    if (callbacks && callbacks.onConfirm) {
        callbacks.onConfirm();
    }
    
    // Clear callbacks
    if (window.inlineNotificationCallbacks) {
        delete window.inlineNotificationCallbacks;
    }
}

function handleInlineCancel() {
    const callbacks = window.inlineNotificationCallbacks;
    const notification = document.querySelector('.inline-notification');
    if (notification) {
        notification.remove();
    }
    
    if (callbacks && callbacks.onCancel) {
        callbacks.onCancel();
    }
    
    // Clear callbacks
    if (window.inlineNotificationCallbacks) {
        delete window.inlineNotificationCallbacks;
    }
}


