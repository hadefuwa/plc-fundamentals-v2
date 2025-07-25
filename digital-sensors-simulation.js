// Digital Sensors Simulation
// Worksheet 12 - Digital Sensors System Maintenance

let digitalSensorsData = {
    sensors: {
        sensor1: { state: false, type: 'NO', health: 100 },
        sensor2: { state: false, type: 'NC', health: 100 },
        sensor3: { state: false, type: 'NO', health: 100 }
    },
    plcInputs: [false, false, false],
    wiringStatus: [true, true, true],
    faults: []
};

function initializeDigitalSensorsSimulation() {
    console.log('Initializing Digital Sensors Simulation');
    
    const panel = document.getElementById('digital-sensors-panel');
    if (!panel) {
        console.error('Digital sensors panel not found');
        return;
    }
    
    panel.innerHTML = `
        <div class="simulation-header">
            <h3><i class="fas fa-toggle-on"></i> Digital Sensors System</h3>
            <p>Interactive digital sensors maintenance and troubleshooting simulation</p>
        </div>
        
        <div class="simulation-grid">
            <div class="simulation-left">
                <div class="sensors-visualization">
                    <h4>Digital Sensors Status</h4>
                    <div id="sensors-display" class="sensors-display">
                        <div class="sensor-item">
                            <span class="sensor-label">Sensor 1 (NO):</span>
                            <div id="sensor1-indicator" class="sensor-indicator off"></div>
                            <button id="toggle-sensor1" class="toggle-btn">Toggle</button>
                        </div>
                        <div class="sensor-item">
                            <span class="sensor-label">Sensor 2 (NC):</span>
                            <div id="sensor2-indicator" class="sensor-indicator off"></div>
                            <button id="toggle-sensor2" class="toggle-btn">Toggle</button>
                        </div>
                        <div class="sensor-item">
                            <span class="sensor-label">Sensor 3 (NO):</span>
                            <div id="sensor3-indicator" class="sensor-indicator off"></div>
                            <button id="toggle-sensor3" class="toggle-btn">Toggle</button>
                        </div>
                    </div>
                </div>
                
                <div class="plc-status">
                    <h4>PLC Input Status</h4>
                    <div class="plc-indicators">
                        <div class="plc-input">
                            <span class="input-label">Input 1:</span>
                            <div id="plc-input1" class="plc-indicator off"></div>
                        </div>
                        <div class="plc-input">
                            <span class="input-label">Input 2:</span>
                            <div id="plc-input2" class="plc-indicator off"></div>
                        </div>
                        <div class="plc-input">
                            <span class="input-label">Input 3:</span>
                            <div id="plc-input3" class="plc-indicator off"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <div class="maintenance-tools">
                    <h4>Maintenance Tools</h4>
                    <div class="tool-buttons">
                        <button id="test-continuity" class="maintenance-btn">Test Continuity</button>
                        <button id="check-wiring" class="maintenance-btn">Check Wiring</button>
                        <button id="verify-logic" class="maintenance-btn">Verify Logic</button>
                        <button id="reset-sensors" class="maintenance-btn">Reset Sensors</button>
                    </div>
                </div>
                
                <div class="fault-injection">
                    <h4>Fault Injection</h4>
                    <div class="fault-buttons">
                        <button id="inject-wiring" class="fault-btn">Wiring Fault</button>
                        <button id="inject-sensor" class="fault-btn">Sensor Fault</button>
                        <button id="inject-logic" class="fault-btn">Logic Fault</button>
                        <button id="clear-faults" class="fault-btn" style="background: #4CAF50;">Clear All Faults</button>
                    </div>
                </div>
                
                <div class="maintenance-tasks">
                    <h4>Maintenance Tasks</h4>
                    <div class="task-list">
                        <div class="task-item">
                            <input type="checkbox" id="task-continuity">
                            <label for="task-continuity">Test wire continuity</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-wiring">
                            <label for="task-wiring">Check terminal connections</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-logic">
                            <label for="task-logic">Verify NO/NC logic</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-interface">
                            <label for="task-interface">Test interface requirements</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="simulation-footer">
            <div class="diagnostic-info">
                <h4>Diagnostic Information</h4>
                <div id="diagnostic-log" class="diagnostic-log">
                    <p>System initialized. Digital sensors ready for testing.</p>
                </div>
            </div>
        </div>
    `;
    
    initializeDigitalSensorsControls();
    updateDigitalSensorsDisplay();
    startDigitalSensorsSimulation();
}

function initializeDigitalSensorsControls() {
    // Sensor toggle buttons
    document.getElementById('toggle-sensor1').addEventListener('click', () => toggleSensor('sensor1'));
    document.getElementById('toggle-sensor2').addEventListener('click', () => toggleSensor('sensor2'));
    document.getElementById('toggle-sensor3').addEventListener('click', () => toggleSensor('sensor3'));
    
    // Maintenance buttons
    document.getElementById('test-continuity').addEventListener('click', testContinuity);
    document.getElementById('check-wiring').addEventListener('click', checkWiring);
    document.getElementById('verify-logic').addEventListener('click', verifyLogic);
    document.getElementById('reset-sensors').addEventListener('click', resetSensors);
    
    // Fault injection buttons
    document.getElementById('inject-wiring').addEventListener('click', injectWiringFault);
    document.getElementById('inject-sensor').addEventListener('click', injectSensorFault);
    document.getElementById('inject-logic').addEventListener('click', injectLogicFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function toggleSensor(sensorId) {
    digitalSensorsData.sensors[sensorId].state = !digitalSensorsData.sensors[sensorId].state;
    updateDigitalSensorsDisplay();
    logDiagnostic('Sensor ' + sensorId + ' toggled to ' + (digitalSensorsData.sensors[sensorId].state ? 'ON' : 'OFF'));
}

function updateDigitalSensorsDisplay() {
    // Update sensor indicators
    Object.keys(digitalSensorsData.sensors).forEach((sensorId, index) => {
        const sensor = digitalSensorsData.sensors[sensorId];
        const indicator = document.getElementById(sensorId + '-indicator');
        const plcIndicator = document.getElementById('plc-input' + (index + 1));
        
        if (indicator) {
            indicator.className = 'sensor-indicator ' + (sensor.state ? 'on' : 'off');
        }
        
        // Calculate PLC input based on sensor type and state
        let plcInput = sensor.state;
        if (sensor.type === 'NC') {
            plcInput = !sensor.state; // NC is inverted
        }
        
        // Apply wiring faults
        if (!digitalSensorsData.wiringStatus[index]) {
            plcInput = false; // Wiring fault forces input to false
        }
        
        digitalSensorsData.plcInputs[index] = plcInput;
        
        if (plcIndicator) {
            plcIndicator.className = 'plc-indicator ' + (plcInput ? 'on' : 'off');
        }
    });
}

function testContinuity() {
    const continuityResults = digitalSensorsData.wiringStatus.map((status, index) => {
        return 'Input ' + (index + 1) + ': ' + (status ? 'Good' : 'Open Circuit');
    });
    
    logDiagnostic('Continuity test results: ' + continuityResults.join(', '));
}

function checkWiring() {
    const wiringIssues = digitalSensorsData.wiringStatus.filter(status => !status).length;
    if (wiringIssues > 0) {
        logDiagnostic('Wiring check completed - ' + wiringIssues + ' connection issues found');
    } else {
        logDiagnostic('Wiring check completed - all connections good');
    }
}

function verifyLogic() {
    Object.keys(digitalSensorsData.sensors).forEach((sensorId, index) => {
        const sensor = digitalSensorsData.sensors[sensorId];
        const expectedPlcInput = sensor.type === 'NC' ? !sensor.state : sensor.state;
        const actualPlcInput = digitalSensorsData.plcInputs[index];
        
        if (expectedPlcInput !== actualPlcInput) {
            logDiagnostic('Logic verification failed for ' + sensorId + ' - wiring fault detected');
        }
    });
}

function resetSensors() {
    Object.keys(digitalSensorsData.sensors).forEach(sensorId => {
        digitalSensorsData.sensors[sensorId].state = false;
    });
    updateDigitalSensorsDisplay();
    logDiagnostic('All sensors reset to OFF state');
}

function injectWiringFault() {
    digitalSensorsData.faults.push('wiring');
    const randomIndex = Math.floor(Math.random() * 3);
    digitalSensorsData.wiringStatus[randomIndex] = false;
    updateDigitalSensorsDisplay();
    logDiagnostic('Wiring fault injected on input ' + (randomIndex + 1));
}

function injectSensorFault() {
    digitalSensorsData.faults.push('sensor');
    const randomSensor = Object.keys(digitalSensorsData.sensors)[Math.floor(Math.random() * 3)];
    digitalSensorsData.sensors[randomSensor].health = Math.max(0, digitalSensorsData.sensors[randomSensor].health - 30);
    logDiagnostic('Sensor fault injected on ' + randomSensor);
}

function injectLogicFault() {
    digitalSensorsData.faults.push('logic');
    const randomSensor = Object.keys(digitalSensorsData.sensors)[Math.floor(Math.random() * 3)];
    digitalSensorsData.sensors[randomSensor].type = digitalSensorsData.sensors[randomSensor].type === 'NO' ? 'NC' : 'NO';
    updateDigitalSensorsDisplay();
    logDiagnostic('Logic fault injected - ' + randomSensor + ' type changed');
}

function clearAllFaults() {
    digitalSensorsData.faults = [];
    digitalSensorsData.wiringStatus = [true, true, true];
    Object.keys(digitalSensorsData.sensors).forEach(sensorId => {
        digitalSensorsData.sensors[sensorId].health = 100;
        digitalSensorsData.sensors[sensorId].type = sensorId === 'sensor2' ? 'NC' : 'NO';
    });
    updateDigitalSensorsDisplay();
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

function startDigitalSensorsSimulation() {
    logDiagnostic('Digital sensors simulation started');
}

// Auto-initialize if function exists
if (typeof initializeDigitalSensorsSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeDigitalSensorsSimulation, 1000);
    });
} 