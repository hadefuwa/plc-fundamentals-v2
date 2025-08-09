// Flow Sensor Simulation
// Worksheet 10 - Flow Sensor System Maintenance

let flowSensorData = {
    flowRate: 50,          // L/min
    targetFlow: 50,        // L/min
    turbineSpeed: 0,       // RPM
    pulseFrequency: 0,     // Hz
    valvePosition: 100,    // % open
    pumpSpeed: 100,        // % speed
    calibrationOffset: 0,  // Calibration offset
    sensorHealth: 100,     // Health percentage
    blockageLevel: 0,      // % blocked
    faults: [],
    history: Array(50).fill({ time: 0, flow: 0 })
};

let chart = null;

function initializeFlowSensorSimulation() {
    console.log('Initializing Flow Sensor Simulation');
    
    const panel = document.getElementById('flow-sensor-panel');
    if (!panel) {
        console.error('Flow sensor panel not found');
        return;
    }
    
    panel.innerHTML = `
        <div class="simulation-header" style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2196F3; margin-top: 0;"><i class="fas fa-tachometer-alt"></i> Flow Sensor System</h3>
            <p style="color: #aaa; margin: 10px 0;">Interactive flow sensor maintenance and troubleshooting simulation</p>
            
            <div style="background: #23272b; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <h4 style="color: #4CAF50; margin-top: 0;">How to Use This Simulation:</h4>
                <ul style="color: #aaa; margin: 10px 0; padding-left: 20px; line-height: 1.4;">
                    <li><strong>Pump Speed Control:</strong> Adjusts the main pump output (0-100%). Higher speeds increase flow rate.</li>
                    <li><strong>Valve Position:</strong> Controls the manual valve opening (0-100%). Restricting the valve reduces flow.</li>
                    <li><strong>Flow Rate:</strong> Shows current flow in liters per minute (L/min). Normal range is 40-80 L/min.</li>
                    <li><strong>Turbine Speed:</strong> Indicates sensor turbine rotation speed. Should correlate with flow rate.</li>
                </ul>
                
                <h4 style="color: #4CAF50; margin: 15px 0 5px 0;">Maintenance Tools:</h4>
                <ul style="color: #aaa; margin: 10px 0; padding-left: 20px; line-height: 1.4;">
                    <li><strong>Clean Sensor:</strong> Removes blockages and improves sensor health</li>
                    <li><strong>Calibrate:</strong> Resets sensor offset to ensure accurate readings</li>
                    <li><strong>Inspect:</strong> Checks turbine condition and bearing health</li>
                    <li><strong>Verify:</strong> Tests sensor signal output and accuracy</li>
                </ul>
                
                <h4 style="color: #FF5722; margin: 15px 0 5px 0;">Common Issues:</h4>
                <ul style="color: #aaa; margin: 10px 0; padding-left: 20px; line-height: 1.4;">
                    <li><strong>Blockage:</strong> Reduces flow rate, may cause turbine sticking</li>
                    <li><strong>Calibration Drift:</strong> Causes inaccurate readings, needs recalibration</li>
                    <li><strong>Turbine Fault:</strong> Affects sensor response, may need cleaning or repair</li>
                </ul>
                
                <p style="color: #2196F3; margin: 15px 0 5px 0;">
                    <i class="fas fa-info-circle"></i> <strong>Tip:</strong> Watch the flow animation and chart to understand system behavior. 
                    The particles show actual flow movement, while the chart tracks historical flow rate.
                </p>
            </div>
        </div>
        
        <div class="simulation-grid">
            <div class="simulation-left">
                <!-- Flow Visualization -->
                <div class="flow-visualization" style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #2196F3; margin-top: 0;">Flow Measurement</h4>
                    
                    <!-- System Controls -->
                    <div style="background: #23272b; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #444;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <!-- Pump Speed Control -->
                            <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <label style="color: #4CAF50; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                                        <i class="fas fa-pump"></i> Pump Speed
                                    </label>
                                    <span style="color: #4CAF50; font-weight: bold;">
                                        <span id="pump-speed-value">100</span>%
                                    </span>
                                </div>
                                <div style="position: relative;">
                                    <input type="range" id="pump-speed" min="0" max="100" value="100" 
                                        style="width: 100%; height: 20px; -webkit-appearance: none; background: transparent; cursor: pointer;">
                                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 8px; background: linear-gradient(to right, #1B5E20, #4CAF50); border-radius: 4px; transform: translateY(-50%); pointer-events: none;"></div>
                                </div>
                            </div>
                            
                            <!-- Valve Position Control -->
                            <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <label style="color: #FF5722; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                                        <i class="fas fa-valve"></i> Valve Position
                                    </label>
                                    <span style="color: #FF5722; font-weight: bold;">
                                        <span id="valve-position-value">100</span>%
                                    </span>
                                </div>
                                <div style="position: relative;">
                                    <input type="range" id="valve-position" min="0" max="100" value="100" 
                                        style="width: 100%; height: 20px; -webkit-appearance: none; background: transparent; cursor: pointer;">
                                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 8px; background: linear-gradient(to right, #BF360C, #FF5722); border-radius: 4px; transform: translateY(-50%); pointer-events: none;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pipe System Visualization -->
                    <div class="pipe-system" style="position: relative; height: 300px; margin: 20px 0; background: #23272b; border-radius: 12px; overflow: hidden; border: 2px solid #333; box-shadow: inset 0 0 30px rgba(0,0,0,0.5);">
                        <!-- Component Labels -->
                        <div style="position: absolute; left: 40px; top: 30px; color: #4CAF50; font-weight: bold; font-size: 16px; text-shadow: 0 0 5px rgba(76,175,80,0.5);">Pump</div>
                        <div style="position: absolute; left: 50%; top: 30px; transform: translateX(-50%); color: #2196F3; font-weight: bold; font-size: 16px; text-shadow: 0 0 5px rgba(33,150,243,0.5);">Flow Sensor</div>
                        <div style="position: absolute; right: 40px; top: 30px; color: #FF5722; font-weight: bold; font-size: 16px; text-shadow: 0 0 5px rgba(255,87,34,0.5);">Control Valve</div>
                        
                        <!-- Flow Direction Arrows -->
                        <div style="position: absolute; left: 25%; top: 50%; transform: translateY(-50%); color: #666; font-size: 36px;">→</div>
                        <div style="position: absolute; right: 25%; top: 50%; transform: translateY(-50%); color: #666; font-size: 36px;">→</div>
                        
                        <!-- Circular Pump with enhanced visuals -->
                        <div id="pump" style="position: absolute; left: 40px; top: 50%; transform: translateY(-50%); width: 80px; height: 80px; background: linear-gradient(145deg, #2c2c2c, #1a1a1a); border: 3px solid #4CAF50; border-radius: 50%; box-shadow: 0 0 20px rgba(76,175,80,0.3);">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: linear-gradient(145deg, #388E3C, #2E7D32); border-radius: 50%; animation: pumpRotate 2s linear infinite;"></div>
                            <div id="pump-indicator" style="width: 30px; height: 30px; background: linear-gradient(145deg, #4CAF50, #388E3C); border-radius: 50%; position: absolute; right: -15px; top: 50%; transform: translateY(-50%); box-shadow: 0 0 15px #4CAF50;"></div>
                        </div>
                        
                        <!-- Enhanced Pipe -->
                        <div style="position: absolute; left: 120px; top: 50%; transform: translateY(-50%); right: 40px; height: 60px; background: linear-gradient(to bottom, #444, #333); border: 3px solid #555; border-radius: 30px; box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                            <!-- Flow Animation Container -->
                            <div id="flow-particles" style="position: absolute; top: 5px; left: 5px; right: 5px; bottom: 5px; overflow: hidden; border-radius: 25px;"></div>
                        </div>
                        
                        <!-- Enhanced Flow Sensor -->
                        <div id="flow-sensor" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -80%); width: 50px; height: 100px; background: linear-gradient(145deg, #1976D2, #2196F3); border: 3px solid #64B5F6; border-radius: 10px; box-shadow: 0 0 20px rgba(33,150,243,0.3);">
                            <div id="sensor-indicator" style="width: 30px; height: 30px; background: linear-gradient(145deg, #4CAF50, #388E3C); border-radius: 50%; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); box-shadow: 0 0 15px #4CAF50;"></div>
                        </div>
                        
                        <!-- Enhanced Valve -->
                        <div id="valve" style="position: absolute; right: 60px; top: 50%; transform: translateY(-80%); width: 40px; height: 100px; background: linear-gradient(145deg, #D84315, #FF5722); border: 3px solid #FF8A65; border-radius: 10px; box-shadow: 0 0 20px rgba(255,87,34,0.3);">
                            <div id="valve-handle" style="width: 60px; height: 20px; background: linear-gradient(145deg, #FFB74D, #FFA726); position: absolute; top: 25px; left: 50%; transform: translateX(-50%) rotate(0deg); transform-origin: center; border-radius: 5px; box-shadow: 0 0 15px rgba(255,167,38,0.5);"></div>
                        </div>
                        
                        <!-- Flow Direction Label -->
                        <div style="position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); color: #666; font-size: 16px; font-weight: bold;">Flow Direction</div>
                    </div>
                    
                    <!-- Flow Data Display -->
                    <div class="flow-data" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
                        <div style="background: #23272b; padding: 15px; border-radius: 8px;">
                            <div style="color: #aaa; font-size: 0.9em;">Flow Rate</div>
                            <div style="color: #2196F3; font-size: 1.5em; font-weight: bold;"><span id="flow-rate-value">50</span> L/min</div>
                        </div>
                        <div style="background: #23272b; padding: 15px; border-radius: 8px;">
                            <div style="color: #aaa; font-size: 0.9em;">Turbine Speed</div>
                            <div style="color: #2196F3; font-size: 1.5em; font-weight: bold;"><span id="turbine-speed-value">0</span> RPM</div>
                        </div>
                    </div>
                </div>
                
                <!-- Flow Chart -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #2196F3; margin-top: 0;">Flow History</h4>
                    <div style="height: 200px; position: relative;">
                        <canvas id="flow-chart"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <!-- Controls -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #333;">
                    <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-sliders-h"></i> System Controls
                    </h4>
                    <div style="display: grid; gap: 20px;">
                        <!-- Pump Speed Control -->
                        <div style="background: #23272b; padding: 15px; border-radius: 8px; border: 1px solid #444;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <label style="color: #4CAF50; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-pump"></i> Pump Speed
                                </label>
                                <span style="color: #4CAF50; font-weight: bold;">
                                    <span id="pump-speed-value">100</span>%
                                </span>
                            </div>
                            <div style="position: relative;">
                                <input type="range" id="pump-speed" min="0" max="100" value="100" 
                                    style="width: 100%; height: 20px; -webkit-appearance: none; background: transparent; cursor: pointer;">
                                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 8px; background: linear-gradient(to right, #1B5E20, #4CAF50); border-radius: 4px; transform: translateY(-50%); pointer-events: none;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                                <span style="color: #666;">Min</span>
                                <span style="color: #666;">Max</span>
                            </div>
                        </div>
                        
                        <!-- Valve Position Control -->
                        <div style="background: #23272b; padding: 15px; border-radius: 8px; border: 1px solid #444;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <label style="color: #FF5722; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-valve"></i> Valve Position
                                </label>
                                <span style="color: #FF5722; font-weight: bold;">
                                    <span id="valve-position-value">100</span>%
                                </span>
                            </div>
                            <div style="position: relative;">
                                <input type="range" id="valve-position" min="0" max="100" value="100" 
                                    style="width: 100%; height: 20px; -webkit-appearance: none; background: transparent; cursor: pointer;">
                                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 8px; background: linear-gradient(to right, #BF360C, #FF5722); border-radius: 4px; transform: translateY(-50%); pointer-events: none;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                                <span style="color: #666;">Closed</span>
                                <span style="color: #666;">Open</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Maintenance Tools -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #2196F3; margin-top: 0;">Maintenance Tools</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <button id="clean-sensor" class="maintenance-btn" style="background: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Clean Sensor</button>
                        <button id="calibrate-sensor" class="maintenance-btn" style="background: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Calibrate</button>
                        <button id="inspect-turbine" class="maintenance-btn" style="background: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Inspect</button>
                        <button id="verify-signals" class="maintenance-btn" style="background: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Verify</button>
                    </div>
                </div>
                
                <!-- Fault Injection -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #2196F3; margin-top: 0;">Fault Injection</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <button id="inject-blockage" class="fault-btn" style="background: #FF5722; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Blockage</button>
                        <button id="inject-calibration" class="fault-btn" style="background: #FF5722; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Calibration</button>
                        <button id="inject-turbine" class="fault-btn" style="background: #FF5722; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Turbine</button>
                        <button id="clear-faults" class="fault-btn" style="background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Clear All</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Diagnostic Log -->
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4 style="color: #2196F3; margin-top: 0;">Diagnostic Information</h4>
            <div id="diagnostic-log" style="background: #23272b; padding: 15px; border-radius: 5px; max-height: 150px; overflow-y: auto; font-family: monospace; color: #aaa;">
                <p>System initialized. Flow sensor ready for testing.</p>
            </div>
        </div>
    `;
    
    setupChart();
    initializeFlowSensorControls();
    startFlowSensorSimulation();
}

function setupChart() {
    const ctx = document.getElementById('flow-chart');
    if (!ctx) return;
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(50).fill(''),
            datasets: [{
                label: 'Flow Rate',
                data: Array(50).fill(0),
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
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#888'
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

function initializeFlowSensorControls() {
    // Pump speed control
    document.getElementById('pump-speed').addEventListener('input', function(e) {
        const value = parseInt(e.target.value);
        flowSensorData.pumpSpeed = value;
        document.getElementById('pump-speed-value').textContent = value;
        updateFlowCalculations();
        
        // Update pump visuals based on speed
        const pump = document.getElementById('pump');
        const pumpIndicator = document.getElementById('pump-indicator');
        if (pump && pumpIndicator) {
            // Update pump rotation speed
            const rotator = pump.querySelector('div');
            if (rotator) {
                const rotationDuration = value > 0 ? (3 - (value / 50)) : 0; // Faster rotation at higher speeds
                rotator.style.animation = value > 0 ? `pumpRotate ${rotationDuration}s linear infinite` : 'none';
            }
            
            // Update pump glow
            pumpIndicator.style.boxShadow = `0 0 ${value/5 + 5}px #4CAF50`;
            pump.style.boxShadow = `0 0 ${value/5 + 15}px rgba(76,175,80,0.3)`;
        }
    });
    
    // Valve position control
    document.getElementById('valve-position').addEventListener('input', function(e) {
        const value = parseInt(e.target.value);
        flowSensorData.valvePosition = value;
        document.getElementById('valve-position-value').textContent = value;
        updateFlowCalculations();
        updateValveVisual();
        
        // Update valve handle glow based on position
        const valveHandle = document.getElementById('valve-handle');
        if (valveHandle) {
            valveHandle.style.boxShadow = `0 0 ${value/5 + 5}px rgba(255,167,38,0.5)`;
        }
    });
    
    // Maintenance buttons
    document.getElementById('clean-sensor').addEventListener('click', cleanSensor);
    document.getElementById('calibrate-sensor').addEventListener('click', calibrateSensor);
    document.getElementById('inspect-turbine').addEventListener('click', inspectTurbine);
    document.getElementById('verify-signals').addEventListener('click', verifySignals);
    
    // Fault buttons
    document.getElementById('inject-blockage').addEventListener('click', injectBlockageFault);
    document.getElementById('inject-calibration').addEventListener('click', injectCalibrationFault);
    document.getElementById('inject-turbine').addEventListener('click', injectTurbineFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
}

function updateFlowCalculations() {
    // Calculate actual flow based on pump speed, valve position, and blockage
    const maxFlow = 100; // L/min
    const pumpFactor = flowSensorData.pumpSpeed / 100;
    const valveFactor = flowSensorData.valvePosition / 100;
    const blockageFactor = 1 - (flowSensorData.blockageLevel / 100);
    
    // Calculate target flow
    flowSensorData.targetFlow = maxFlow * pumpFactor * valveFactor;
    
    // Apply blockage and calibration effects
    flowSensorData.flowRate = flowSensorData.targetFlow * blockageFactor;
    flowSensorData.flowRate += flowSensorData.calibrationOffset;
    flowSensorData.flowRate = Math.max(0, Math.min(100, flowSensorData.flowRate));
    
    // Calculate turbine speed (RPM = flow rate * 20)
    flowSensorData.turbineSpeed = Math.round(flowSensorData.flowRate * 20);
    
    // Update displays
    updateVisualizations();
}

function updateVisualizations() {
    // Update numeric displays
    document.getElementById('flow-rate-value').textContent = Math.round(flowSensorData.flowRate);
    document.getElementById('turbine-speed-value').textContent = flowSensorData.turbineSpeed;
    
    // Update flow particles animation
    updateFlowAnimation();
    
    // Update sensor indicator
    const sensorIndicator = document.getElementById('sensor-indicator');
    if (sensorIndicator) {
        sensorIndicator.style.background = flowSensorData.flowRate > 0 ? '#4CAF50' : '#FF5722';
        sensorIndicator.style.boxShadow = flowSensorData.flowRate > 0 ? '0 0 10px #4CAF50' : 'none';
    }
    
    // Update chart
    if (chart && chart.data && chart.data.datasets) {
        const data = chart.data.datasets[0].data;
        data.push(flowSensorData.flowRate);
        data.shift();
        chart.update('none');
    }
}

function updateFlowAnimation() {
    const particles = document.getElementById('flow-particles');
    if (!particles) return;
    
    // Clear existing particles
    particles.innerHTML = '';
    
    if (flowSensorData.flowRate > 0) {
        // Create new particles based on flow rate
        const particleCount = Math.round(flowSensorData.flowRate / 3);
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 10 + 10; // Random size between 10-20px
            const yPos = Math.random() * 70 + 15; // Keep particles more centered in pipe
            const speed = 2.5 - (flowSensorData.flowRate / 100); // Slightly faster animation
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(145deg, #64B5F6, #2196F3);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${yPos}%;
                animation: flowParticle ${speed}s linear infinite;
                box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
                opacity: 0.9;
            `;
            particles.appendChild(particle);
        }
    }
}

function updateValveVisual() {
    const valveHandle = document.getElementById('valve-handle');
    if (valveHandle) {
        const rotation = (100 - flowSensorData.valvePosition) * 0.9;
        valveHandle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }
}

// Maintenance Functions
function cleanSensor() {
    const oldBlockage = flowSensorData.blockageLevel;
    const oldHealth = flowSensorData.sensorHealth;
    
    flowSensorData.blockageLevel = Math.max(0, flowSensorData.blockageLevel - 50);
    flowSensorData.sensorHealth = Math.min(100, flowSensorData.sensorHealth + 20);
    
    updateFlowCalculations();
    
    const blockageReduction = oldBlockage - flowSensorData.blockageLevel;
    const healthImprovement = flowSensorData.sensorHealth - oldHealth;
    
    logDiagnostic(`Sensor cleaning completed:
    • Blockage reduced by ${blockageReduction}% (now ${flowSensorData.blockageLevel}%)
    • Health improved by ${healthImprovement}% (now ${flowSensorData.sensorHealth}%)
    • Flow rate response: ${Math.round(flowSensorData.flowRate)} L/min`);
}

function calibrateSensor() {
    flowSensorData.calibrationOffset = 0;
    updateFlowCalculations();
    logDiagnostic('Sensor calibration completed - offset reset to zero');
}

function inspectTurbine() {
    const health = flowSensorData.sensorHealth;
    const status = health > 80 ? 'Excellent' : health > 50 ? 'Fair' : 'Poor';
    logDiagnostic(`Turbine inspection completed - Health: ${status} (${health}%)`);
}

function verifySignals() {
    const flowRate = Math.round(flowSensorData.flowRate);
    const turbineSpeed = flowSensorData.turbineSpeed;
    const expectedSpeed = flowRate * 20; // Expected relationship
    const speedError = Math.abs(turbineSpeed - expectedSpeed);
    const calibrationError = Math.abs(flowSensorData.calibrationOffset);
    
    let signalQuality = 'Good';
    let issues = [];
    
    if (flowRate === 0) {
        signalQuality = 'No Signal';
    } else if (speedError > 50) {
        signalQuality = 'Poor';
        issues.push('Turbine speed mismatch');
    } else if (calibrationError > 10) {
        signalQuality = 'Fair';
        issues.push('Calibration offset detected');
    }
    
    if (flowSensorData.blockageLevel > 20) {
        issues.push('Flow restriction detected');
    }
    
    logDiagnostic(`Signal verification completed:
    • Signal Quality: ${signalQuality}
    • Flow Rate: ${flowRate} L/min
    • Turbine Speed: ${turbineSpeed} RPM
    • Calibration Offset: ${Math.round(flowSensorData.calibrationOffset * 10) / 10}
    ${issues.length > 0 ? '• Issues Found: ' + issues.join(', ') : '• No issues detected'}`);
}

// Fault Injection Functions
function injectBlockageFault() {
    flowSensorData.blockageLevel = Math.min(100, flowSensorData.blockageLevel + 50);
    updateFlowCalculations();
    logDiagnostic('Blockage fault injected - flow restricted');
}

function injectCalibrationFault() {
    flowSensorData.calibrationOffset = (Math.random() - 0.5) * 20;
    updateFlowCalculations();
    logDiagnostic('Calibration fault injected - readings offset');
}

function injectTurbineFault() {
    flowSensorData.sensorHealth = Math.max(0, flowSensorData.sensorHealth - 30);
    updateFlowCalculations();
    logDiagnostic('Turbine fault injected - sensor health degraded');
}

function clearAllFaults() {
    flowSensorData.blockageLevel = 0;
    flowSensorData.calibrationOffset = 0;
    flowSensorData.sensorHealth = 100;
    flowSensorData.faults = [];
    updateFlowCalculations();
    logDiagnostic('All faults cleared - system restored to normal operation');
}

function logDiagnostic(message) {
    const log = document.getElementById('diagnostic-log');
    if (log) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('p');
        logEntry.innerHTML = `<span style="color: #666;">[${timestamp}]</span> ${message}`;
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
    }
}

function startFlowSensorSimulation() {
    // Add CSS for flow and pump animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flowParticle {
            from { transform: translateX(0) scale(0.8); opacity: 0; }
            10% { transform: translateX(10%) scale(1); opacity: 1; }
            90% { transform: translateX(90%) scale(1); opacity: 1; }
            to { transform: translateX(${document.querySelector('.pipe-system').offsetWidth}px) scale(0.8); opacity: 0; }
        }
        
        @keyframes pumpRotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Start simulation loop
    setInterval(() => {
        updateFlowCalculations();
    }, 100);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeFlowSensorSimulation); 