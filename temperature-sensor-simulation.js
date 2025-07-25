// Temperature Sensor Simulation
// Worksheet 11 - Temperature Sensor System Maintenance

let temperatureSensorData = {
    temperature: 25,
    voltageOutput: 0,
    scaledTemperature: 0,
    offset: 0,
    drift: 0,
    sensorHealth: 100,
    faults: []
};

function initializeTemperatureSensorSimulation() {
    console.log('Initializing Temperature Sensor Simulation');
    
    const panel = document.getElementById('temperature-sensor-panel');
    if (!panel) {
        console.error('Temperature sensor panel not found');
        return;
    }
    
    panel.innerHTML = `
        <div class="simulation-header">
            <h3><i class="fas fa-thermometer-half"></i> Temperature Sensor System</h3>
            <p>Interactive temperature sensor maintenance and troubleshooting simulation</p>
        </div>
        
        <div class="simulation-grid">
            <div class="simulation-left">
                <div class="temperature-visualization">
                    <h4>Temperature Measurement</h4>
                    <div id="temp-display" class="temp-display">
                        <div id="temp-gauge" class="temp-gauge"></div>
                        <div class="temp-indicators">
                            <div class="temperature">Temperature: <span id="temp-value">25</span>°C</div>
                            <div class="voltage">Voltage Output: <span id="voltage-value">0</span>V</div>
                            <div class="scaled">Scaled Value: <span id="scaled-value">0</span>°C</div>
                        </div>
                    </div>
                    <div class="temp-controls">
                        <label>Temperature: <input type="range" id="temperature" min="-50" max="150" value="25"></label>
                        <label>Offset: <input type="range" id="offset" min="-20" max="20" value="0"></label>
                        <label>Drift: <input type="range" id="drift" min="0" max="10" value="0"></label>
                    </div>
                </div>
                
                <div class="sensor-status">
                    <h4>Sensor Status</h4>
                    <div class="status-indicators">
                        <div class="status-item">
                            <span class="status-label">Sensor Health:</span>
                            <span id="sensor-health" class="status-value">100%</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Calibration:</span>
                            <span id="calibration-status" class="status-value">Good</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Drift Level:</span>
                            <span id="drift-level" class="status-value">0°C</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <div class="maintenance-tools">
                    <h4>Maintenance Tools</h4>
                    <div class="tool-buttons">
                        <button id="calibrate-sensor" class="maintenance-btn">Calibrate Sensor</button>
                        <button id="reset-offset" class="maintenance-btn">Reset Offset</button>
                        <button id="check-drift" class="maintenance-btn">Check Drift</button>
                        <button id="verify-signals" class="maintenance-btn">Verify Signals</button>
                    </div>
                </div>
                
                <div class="fault-injection">
                    <h4>Fault Injection</h4>
                    <div class="fault-buttons">
                        <button id="inject-offset" class="fault-btn">Offset Fault</button>
                        <button id="inject-drift" class="fault-btn">Drift Fault</button>
                        <button id="inject-noise" class="fault-btn">Noise Fault</button>
                        <button id="clear-faults" class="fault-btn" style="background: #4CAF50;">Clear All Faults</button>
                    </div>
                </div>
                
                <div class="maintenance-tasks">
                    <h4>Maintenance Tasks</h4>
                    <div class="task-list">
                        <div class="task-item">
                            <input type="checkbox" id="task-calibrate">
                            <label for="task-calibrate">Calibrate temperature sensor</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-offset">
                            <label for="task-offset">Reset offset values</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-drift">
                            <label for="task-drift">Check for drift</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-verify">
                            <label for="task-verify">Verify signal accuracy</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="simulation-footer">
            <div class="diagnostic-info">
                <h4>Diagnostic Information</h4>
                <div id="diagnostic-log" class="diagnostic-log">
                    <p>System initialized. Temperature sensor ready for testing.</p>
                </div>
            </div>
        </div>
    `;
    
    initializeTemperatureSensorControls();
    updateTemperatureSensorDisplay();
    startTemperatureSensorSimulation();
}

function initializeTemperatureSensorControls() {
    // Temperature control
    document.getElementById('temperature').addEventListener('input', function() {
        temperatureSensorData.temperature = parseInt(this.value);
        updateTemperatureSensorDisplay();
    });
    
    // Offset control
    document.getElementById('offset').addEventListener('input', function() {
        temperatureSensorData.offset = parseInt(this.value);
        updateTemperatureSensorDisplay();
    });
    
    // Drift control
    document.getElementById('drift').addEventListener('input', function() {
        temperatureSensorData.drift = parseInt(this.value);
        updateTemperatureSensorDisplay();
    });
    
    // Maintenance buttons
    document.getElementById('calibrate-sensor').addEventListener('click', calibrateSensor);
    document.getElementById('reset-offset').addEventListener('click', resetOffset);
    document.getElementById('check-drift').addEventListener('click', checkDrift);
    document.getElementById('verify-signals').addEventListener('click', verifySignals);
    
    // Fault injection buttons
    document.getElementById('inject-offset').addEventListener('click', injectOffsetFault);
    document.getElementById('inject-drift').addEventListener('click', injectDriftFault);
    document.getElementById('inject-noise').addEventListener('click', injectNoiseFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function updateTemperatureSensorDisplay() {
    // Calculate voltage output (4-20mA equivalent as 0-10V)
    temperatureSensorData.voltageOutput = ((temperatureSensorData.temperature + 50) / 200) * 10;
    
    // Calculate scaled temperature with offset and drift
    temperatureSensorData.scaledTemperature = temperatureSensorData.temperature + 
                                             temperatureSensorData.offset + 
                                             temperatureSensorData.drift;
    
    // Update displays
    document.getElementById('temp-value').textContent = temperatureSensorData.temperature;
    document.getElementById('voltage-value').textContent = temperatureSensorData.voltageOutput.toFixed(2);
    document.getElementById('scaled-value').textContent = temperatureSensorData.scaledTemperature.toFixed(1);
    
    // Update status displays
    updateStatusDisplays();
}

function updateStatusDisplays() {
    const sensorHealth = document.getElementById('sensor-health');
    const calibrationStatus = document.getElementById('calibration-status');
    const driftLevel = document.getElementById('drift-level');
    
    if (sensorHealth) {
        sensorHealth.textContent = temperatureSensorData.sensorHealth + '%';
        sensorHealth.className = 'status-value ' + (temperatureSensorData.sensorHealth > 80 ? 'good' : temperatureSensorData.sensorHealth > 50 ? 'fair' : 'poor');
    }
    
    if (calibrationStatus) {
        const calibration = Math.abs(temperatureSensorData.offset) < 2 ? 'Good' : 'Needs Calibration';
        calibrationStatus.textContent = calibration;
        calibrationStatus.className = 'status-value ' + (calibration === 'Good' ? 'good' : 'poor');
    }
    
    if (driftLevel) {
        driftLevel.textContent = temperatureSensorData.drift + '°C';
        driftLevel.className = 'status-value ' + (temperatureSensorData.drift < 2 ? 'good' : 'poor');
    }
}

function calibrateSensor() {
    temperatureSensorData.offset = 0;
    temperatureSensorData.drift = 0;
    document.getElementById('offset').value = 0;
    document.getElementById('drift').value = 0;
    updateTemperatureSensorDisplay();
    logDiagnostic('Sensor calibration completed - offset and drift reset');
}

function resetOffset() {
    temperatureSensorData.offset = 0;
    document.getElementById('offset').value = 0;
    updateTemperatureSensorDisplay();
    logDiagnostic('Offset reset completed');
}

function checkDrift() {
    if (temperatureSensorData.drift > 0) {
        logDiagnostic('Drift detected: ' + temperatureSensorData.drift + '°C - calibration recommended');
    } else {
        logDiagnostic('No significant drift detected');
    }
}

function verifySignals() {
    const accuracy = Math.abs(temperatureSensorData.temperature - temperatureSensorData.scaledTemperature);
    const signalQuality = accuracy < 2 ? 'Good' : 'Needs Attention';
    logDiagnostic('Signal verification completed - ' + signalQuality + ' accuracy');
}

function injectOffsetFault() {
    temperatureSensorData.faults.push('offset');
    temperatureSensorData.offset = Math.random() * 40 - 20;
    document.getElementById('offset').value = temperatureSensorData.offset;
    updateTemperatureSensorDisplay();
    logDiagnostic('Offset fault injected');
}

function injectDriftFault() {
    temperatureSensorData.faults.push('drift');
    temperatureSensorData.drift = Math.random() * 10;
    document.getElementById('drift').value = temperatureSensorData.drift;
    updateTemperatureSensorDisplay();
    logDiagnostic('Drift fault injected');
}

function injectNoiseFault() {
    temperatureSensorData.faults.push('noise');
    temperatureSensorData.sensorHealth = Math.max(0, temperatureSensorData.sensorHealth - 20);
    updateTemperatureSensorDisplay();
    logDiagnostic('Noise fault injected - sensor health degraded');
}

function clearAllFaults() {
    temperatureSensorData.faults = [];
    temperatureSensorData.offset = 0;
    temperatureSensorData.drift = 0;
    temperatureSensorData.sensorHealth = 100;
    
    document.getElementById('offset').value = 0;
    document.getElementById('drift').value = 0;
    updateTemperatureSensorDisplay();
    logDiagnostic('All faults cleared - system restored to normal operation');
}

function updateMaintenanceStatus() {
    const tasks = document.querySelectorAll('.task-item input[type="checkbox"]:checked');
    logDiagnostic('Maintenance tasks completed: ' + tasks.length + '/4');
    
    if (tasks.length === 4) {
        logDiagnostic('All maintenance tasks completed - system optimized');
    }
}

function logDiagnostic(message) {
    const log = document.getElementById('diagnostic-log');
    if (log) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('p');
        logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
    }
}

function startTemperatureSensorSimulation() {
    logDiagnostic('Temperature sensor simulation started');
    
    // Periodic updates
    setInterval(() => {
        if (temperatureSensorData.faults.length > 0) {
            // Simulate fault effects
            if (temperatureSensorData.faults.includes('drift')) {
                temperatureSensorData.drift += 0.1;
                document.getElementById('drift').value = temperatureSensorData.drift;
                updateTemperatureSensorDisplay();
            }
        }
    }, 5000);
}

// Auto-initialize if function exists
if (typeof initializeTemperatureSensorSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeTemperatureSensorSimulation, 1000);
    });
} 