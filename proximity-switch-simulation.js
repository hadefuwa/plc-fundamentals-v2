// Chart.js configurations and proximity switch simulation logic
let chart;
let targetDistance = 50;
let detectionHistory = [];
let learningState = {
    step1Complete: false,
    step2Complete: false,
    step3Complete: false,
    hasDetected: false,
    hasTestedRange: false,
    hasObservedHysteresis: false,
    lastState: false
};

// Initialize simulation when the page loads
function initializeProximitySwitchSimulation() {
    console.log('Initializing proximity switch simulation...');

    try {
        // Initialize Detection Graph
        const ctx = document.getElementById('detection-chart');
        if (!ctx) {
            console.error('Detection chart canvas not found!');
            return;
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Detection State',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true,
                    stepped: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
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
                        ticks: {
                            color: '#aaa'
                        },
                        grid: {
                            color: '#333'
                        }
                    },
                    y: {
                        display: true,
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Sensor State',
                            color: '#aaa',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#aaa',
                            callback: function(value) {
                                return value === 1 ? 'ON' : 'OFF';
                            }
                        },
                        grid: {
                            color: '#333'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y === 1 ? 'Sensor: ON' : 'Sensor: OFF';
                            }
                        }
                    }
                }
            }
        });

        // Set up event listeners
        setupEventListeners();
        
        // Start simulation loop
        startSimulation();
        
        console.log('Proximity switch simulation initialized successfully!');
    } catch (error) {
        console.error('Error initializing proximity switch simulation:', error);
    }
}

function setupEventListeners() {
    try {
        // Target distance slider
        const distanceSlider = document.getElementById('target-distance');
        if (distanceSlider) {
            distanceSlider.addEventListener('input', (e) => {
                targetDistance = parseInt(e.target.value);
                updateDistanceDisplay();
                updateVisualization();
                checkLearningProgress();
            });
        }

        console.log('Event listeners set up successfully!');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function startSimulation() {
    let time = 0;
    const timeStep = 0.1;

    setInterval(() => {
        time += timeStep;
        
        // Calculate sensor state with hysteresis
        const detecting = isDetecting(targetDistance);
        
        // Update detection history
        if (detectionHistory.length > 300) { // Keep last 30 seconds
            detectionHistory.shift();
        }
        detectionHistory.push({
            x: time,
            y: detecting ? 1 : 0
        });

        // Update chart
        updateChart(time);
        
        // Check for learning progress
        checkLearningProgress();
    }, 100);
}

function isDetecting(distance) {
    const detectionRange = 40;  // mm
    const hysteresis = 2;       // mm
    
    if (!learningState.lastState) {
        // When currently OFF, use standard range
        learningState.lastState = distance <= detectionRange;
    } else {
        // When currently ON, use hysteresis
        learningState.lastState = distance <= (detectionRange + hysteresis);
    }
    
    return learningState.lastState;
}

function updateChart(time) {
    if (!chart) return;

    chart.data.datasets[0].data = detectionHistory.map(point => ({
        x: point.x,
        y: point.y
    }));

    // Update x-axis window to show last 30 seconds
    const minX = Math.max(0, time - 30);
    chart.options.scales.x.min = minX;
    chart.options.scales.x.max = time;

    chart.update('none');
}

function updateDistanceDisplay() {
    // Update distance value display
    const distanceValue = document.getElementById('distance-value');
    if (distanceValue) {
        distanceValue.textContent = targetDistance + 'mm';
    }

    // Update current distance display
    const currentDistance = document.getElementById('current-distance');
    if (currentDistance) {
        currentDistance.textContent = targetDistance + 'mm';
    }

    // Update sensor state display
    const sensorState = document.getElementById('sensor-state');
    if (sensorState) {
        const detecting = isDetecting(targetDistance);
        sensorState.textContent = detecting ? 'Detecting' : 'Not Detecting';
        sensorState.style.color = detecting ? '#4CAF50' : '#FF5722';
    }
}

function updateVisualization() {
    const targetObject = document.getElementById('target-object');
    if (targetObject) {
        // Convert distance to pixels (100mm = 300px)
        const pixelDistance = 60 + (targetDistance * 3);
        targetObject.style.left = pixelDistance + 'px';
    }

    const detectionZone = document.getElementById('detection-zone');
    if (detectionZone) {
        detectionZone.style.opacity = isDetecting(targetDistance) ? '0.3' : '0.1';
    }
}

function checkLearningProgress() {
    // Step 1: Basic Detection
    if (!learningState.step1Complete && 
        detectionHistory.some(point => point.y === 1) && 
        detectionHistory.some(point => point.y === 0)) {
        learningState.step1Complete = true;
        updateStepCompletion(1);
        updateTaskDescription('Now test the sensor at different distances within the range.');
    }

    // Step 2: Range Testing
    if (learningState.step1Complete && !learningState.step2Complete) {
        const hasTestedNear = detectionHistory.some(point => targetDistance < 20);
        const hasTestedFar = detectionHistory.some(point => targetDistance > 30);
        if (hasTestedNear && hasTestedFar) {
            learningState.step2Complete = true;
            updateStepCompletion(2);
            updateTaskDescription('Move the target slowly around the 40mm point to observe hysteresis.');
        }
    }

    // Step 3: Hysteresis
    if (learningState.step2Complete && !learningState.step3Complete) {
        const recentHistory = detectionHistory.slice(-50);
        const hasTransitioned = recentHistory.some((point, i) => 
            i > 0 && point.y !== recentHistory[i-1].y
        );
        if (hasTransitioned && targetDistance > 38 && targetDistance < 44) {
            learningState.step3Complete = true;
            updateStepCompletion(3);
            updateTaskDescription('Great job! You\'ve completed all learning objectives.');
        }
    }
}

function updateStepCompletion(step) {
    const stepComplete = document.getElementById(`step${step}-complete`);
    if (stepComplete) {
        stepComplete.textContent = '✓';
        stepComplete.style.color = '#4CAF50';
    }
}

function updateTaskDescription(text) {
    const taskDescription = document.getElementById('task-description');
    if (taskDescription) {
        taskDescription.textContent = text;
    }
}

// Initialize when the script loads
if (document.readyState === 'complete') {
    initializeProximitySwitchSimulation();
} else {
    window.addEventListener('load', initializeProximitySwitchSimulation);
} 