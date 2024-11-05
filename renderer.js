let charts = {};

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
        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = status;
            statusText.style.color = status.includes('Connected') ? 'green' : 'red';
        }
    });

    // PLC data updates
    window.electron.receiveData((data) => {
        console.log('Received PLC data in renderer:', data);
        
        const ledCircle = document.getElementById('led-circle');
        const estopCircle = document.getElementById('estop-circle');
        
        if (ledCircle) {
            console.log('LED state:', data['Blue LED']);
            ledCircle.classList.toggle('active', data['Blue LED']);
        }
        
        if (estopCircle) {
            if (data['E-Stop']) {
                estopCircle.classList.add('active');
                estopCircle.classList.remove('flashing');
            } else {
                estopCircle.classList.remove('active');
                estopCircle.classList.add('flashing');
            }
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
            animation: false, // Disable animations for better performance
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

    // Update chart with connection status
    window.electron.receiveStatus((status) => {
        const isConnected = status === 'Connected to PLC';
        const now = new Date();
        
        if (charts.statusChart) {
            const currentData = charts.statusChart.data.datasets[0].data;
            currentData.push({
                x: now,
                y: isConnected ? 1 : 0
            });

            // Keep only last 60 seconds of data
            while (currentData.length > 0 && now - currentData[0].x > 60000) {
                currentData.shift();
            }

            charts.statusChart.update('quiet');
        }
    });
}

function setupDataListeners() {
    let lastUpdateTime = 0;
    const updateThreshold = 1000; // Minimum time between updates (1 second)

    window.electron.receiveStats((stats) => {
        const now = Date.now();
        if (now - lastUpdateTime < updateThreshold) {
            return; // Skip update if too soon
        }
        lastUpdateTime = now;

        if (charts.statusChart && stats.connectionStats.connectionHistory) {
            // Process connection history
            const newData = stats.connectionStats.connectionHistory
                .filter(item => item.time) // Ensure time exists
                .map(item => ({
                    x: new Date(item.time),
                    y: item.connected ? 1 : 0
                }));

            // Process error events
            const errorData = stats.connectionStats
                .filter(error => error.time) // Ensure time exists
                .map(error => ({
                    x: new Date(error.time),
                    y: 0 // Show at bottom of chart
                }));

            // Keep only last 60 data points (1 minute at 1-second intervals)
            if (newData.length > 60) {
                newData.splice(0, newData.length - 60);
            }

            charts.statusChart.data.datasets[0].data = newData;
            charts.statusChart.data.datasets[1].data = errorData;
            charts.statusChart.update('quiet');
        }

        // Add console log to verify data reception
        console.log('Received stats update:', stats);

        // Add console log to verify listener setup
        console.log('Data listeners set up');
    });
}
