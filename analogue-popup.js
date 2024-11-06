let chart;

document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    setupDataListeners();
});

function initializeChart() {
    const ctx = document.getElementById('analogueChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Analogue Input',
                data: [],
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
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
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9da5b1',
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                }
            }
        }
    });
}

function setupDataListeners() {
    // Listen for PLC data updates
    window.electron.receiveData((data) => {
        if (typeof data['Analogue Input'] === 'number') {
            const now = new Date();
            const value = data['Analogue Input'];
            
            // Update the digital display
            const analogueDisplay = document.getElementById('analogue-value');
            if (analogueDisplay) {
                analogueDisplay.textContent = value.toFixed(2);
            }

            // Update the chart
            chart.data.datasets[0].data.push({
                x: now,
                y: value
            });

            // Keep only last 30 seconds of data
            const cutoff = now.getTime() - (30 * 1000);
            chart.data.datasets[0].data = 
                chart.data.datasets[0].data.filter(point => point.x.getTime() > cutoff);

            // Find the maximum value in the current dataset
            const maxValue = Math.max(...chart.data.datasets[0].data.map(point => point.y));
            
            // Update the Y axis max with some headroom
            chart.options.scales.y.max = Math.ceil(maxValue * 1.1); // 10% headroom
            
            chart.update('quiet');
        }
    });
} 