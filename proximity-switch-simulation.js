// Global variables
let chart = null;
let targetDistance = 20;
let sensorState = false;

// Initialize simulation
function initializeProximitySwitchSimulation() {
    console.log('Initializing proximity switch simulation...');
    
    try {
        // Setup initial detection zone
        const detectionZone = document.getElementById('detection-zone');
        if (detectionZone) {
            detectionZone.style.width = '120px'; // 40mm * 3px scale
            detectionZone.style.opacity = '0.1';
        }

        // Setup chart
        setupChart();
        
        // Setup distance slider
        const slider = document.getElementById('target-distance');
        if (slider) {
            slider.value = targetDistance;
            slider.addEventListener('input', (e) => {
                targetDistance = parseInt(e.target.value);
                updateDisplay();
            });
        }
        
        // Initial display update
        updateDisplay();
        
        // Start update loop
        setInterval(updateDisplay, 100);
        
        console.log('Proximity switch simulation initialized successfully!');
    } catch (error) {
        console.error('Simulation initialization error:', error);
    }
}

// Setup Chart.js chart
function setupChart() {
    const ctx = document.getElementById('detection-chart');
    if (!ctx) return;
    
    // Destroy existing chart if any
    if (chart) chart.destroy();
    
    // Create data arrays
    const labels = Array(50).fill('');
    const data = Array(50).fill(0);
    
    // Create new chart
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sensor State',
                data: data,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    min: -0.1,
                    max: 1.1,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            if (value <= 0) return 'OFF';
                            if (value >= 1) return 'ON';
                            return '';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update display elements
function updateDisplay() {
    // Update sensor state
    sensorState = targetDistance <= 40;
    
    // Update chart
    if (chart && chart.data && chart.data.datasets) {
        const data = chart.data.datasets[0].data;
        data.push(sensorState ? 1 : 0);
        data.shift();
        chart.update('none');
    }
    
    // Update visualization
    updateVisualization();
    
    // Update text displays
    const distanceValue = document.getElementById('distance-value');
    if (distanceValue) {
        distanceValue.textContent = targetDistance + 'mm';
    }
    
    const currentDistance = document.getElementById('current-distance');
    if (currentDistance) {
        currentDistance.textContent = targetDistance + 'mm';
    }
    
    const sensorStateElement = document.getElementById('sensor-state');
    if (sensorStateElement) {
        sensorStateElement.textContent = sensorState ? 'Detecting' : 'Not Detecting';
        sensorStateElement.style.color = sensorState ? '#4CAF50' : '#FF5722';
    }
}

// Update visualization
function updateVisualization() {
    const targetObject = document.getElementById('target-object');
    const detectionZone = document.getElementById('detection-zone');
    const sensorBody = document.getElementById('sensor-body');
    
    if (targetObject && detectionZone && sensorBody) {
        // Get sensor position
        const sensorLeft = sensorBody.offsetLeft;
        const sensorWidth = sensorBody.offsetWidth;
        const sensorRight = sensorLeft + sensorWidth;
        
        // Set detection zone position and size
        const detectionRangeInMM = 40; // 40mm detection range
        const pixelsPerMM = 3; // 3 pixels per mm
        const detectionZoneWidth = detectionRangeInMM * pixelsPerMM;
        
        // Position detection zone
        detectionZone.style.left = sensorRight + 'px';
        detectionZone.style.width = detectionZoneWidth + 'px';
        
        // Position target object
        const targetLeft = sensorRight + (targetDistance * pixelsPerMM);
        targetObject.style.left = targetLeft + 'px';
        
        // Update detection zone visibility
        detectionZone.style.opacity = sensorState ? '0.3' : '0.1';
        
        // Add glow effect to sensor when detecting
        const sensorFace = sensorBody.querySelector('#sensor-face');
        if (sensorFace) {
            sensorFace.style.boxShadow = sensorState ? 
                '0 0 10px rgba(33, 150, 243, 0.8)' : 
                '0 0 5px rgba(33, 150, 243, 0.3)';
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeProximitySwitchSimulation); 