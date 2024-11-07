let chart = null;
let isPaused = false;

document.addEventListener('DOMContentLoaded', () => {
    // Make sure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded!');
        return;
    }

    const ctx = document.getElementById('analogueChart');
    if (!ctx) {
        console.error('Canvas element not found!');
        return;
    }

    chart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'AI0',
                    data: [],
                    borderColor: '#4BC0C0',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'AI1',
                    data: [],
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
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
                            return value.toFixed(1) + 'V';
                        }
                    }
                }
            }
        }
    });

    // Add error handling for DOM element updates
    window.electron.receiveAnalogueData((data) => {
        if (!isPaused && data.analogueInputs) {
            const now = new Date();
            
            // Update the digital displays with error handling
            const value0El = document.getElementById('analogue-value-0');
            const value1El = document.getElementById('analogue-value-1');
            
            if (value0El) {
                value0El.textContent = `${data.analogueInputs[0].toFixed(2)}V`;
            }
            if (value1El) {
                value1El.textContent = `${data.analogueInputs[1].toFixed(2)}V`;
            }

            if (chart && chart.data) {
                // Update both datasets
                chart.data.datasets[0].data.push({
                    x: now,
                    y: data.analogueInputs[0]
                });
                chart.data.datasets[1].data.push({
                    x: now,
                    y: data.analogueInputs[1]
                });

                // Keep only last 30 seconds of data
                const cutoff = now.getTime() - (30 * 1000);
                chart.data.datasets.forEach(dataset => {
                    dataset.data = dataset.data.filter(point => point.x.getTime() > cutoff);
                });

                // Find the maximum value across both datasets
                const maxValue = Math.max(
                    ...chart.data.datasets[0].data.map(point => point.y),
                    ...chart.data.datasets[1].data.map(point => point.y)
                );
                
                // Update the Y axis max with some headroom
                chart.options.scales.y.max = Math.ceil(maxValue * 1.1); // 10% headroom
                
                chart.update('quiet');
            }
        }
    });

    // Add pause/resume functionality
    document.getElementById('pause-analogue').addEventListener('click', function() {
        isPaused = !isPaused;
        this.classList.toggle('paused');
    });
}); 