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
        <div class="simulation-header" style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-toggle-on"></i> Digital Sensors System
            </h3>
            <p style="color: #aaa; margin: 10px 0;">Interactive digital sensors maintenance and troubleshooting simulation</p>
            
            <div style="background: #23272b; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <h4 style="color: #4CAF50; margin-top: 0;">How to Use This Simulation:</h4>
                <ul style="color: #aaa; margin: 10px 0; padding-left: 20px; line-height: 1.4;">
                    <li><strong>Digital Sensors:</strong> Toggle sensors to simulate activation/deactivation</li>
                    <li><strong>PLC Inputs:</strong> Monitor how sensor states affect PLC inputs</li>
                    <li><strong>Wiring:</strong> Test connections and identify faults</li>
                    <li><strong>Maintenance:</strong> Perform system checks and verify operation</li>
                </ul>
            </div>
        </div>
        
        <div class="simulation-grid" style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">
            <div class="simulation-left">
                <!-- Sensors Visualization -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-microchip"></i> Digital Sensors Status
                    </h4>
                    
                    <div id="sensors-display" class="sensors-display">
                        <div class="sensor-item">
                            <div class="sensor-label">
                                <i class="fas fa-circle"></i> Sensor 1 (NO)
                            </div>
                            <div id="sensor1-indicator" class="sensor-indicator off"></div>
                            <button id="toggle-sensor1" class="toggle-btn">
                                <i class="fas fa-power-off"></i> Toggle
                            </button>
                        </div>
                        <div class="sensor-item">
                            <div class="sensor-label">
                                <i class="fas fa-circle"></i> Sensor 2 (NC)
                            </div>
                            <div id="sensor2-indicator" class="sensor-indicator off"></div>
                            <button id="toggle-sensor2" class="toggle-btn">
                                <i class="fas fa-power-off"></i> Toggle
                            </button>
                        </div>
                        <div class="sensor-item">
                            <div class="sensor-label">
                                <i class="fas fa-circle"></i> Sensor 3 (NO)
                            </div>
                            <div id="sensor3-indicator" class="sensor-indicator off"></div>
                            <button id="toggle-sensor3" class="toggle-btn">
                                <i class="fas fa-power-off"></i> Toggle
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Wiring Diagram -->
                <div class="wiring-diagram">
                    <div id="wire1" class="wire"></div>
                    <div id="wire2" class="wire"></div>
                    <div id="wire3" class="wire"></div>
                    
                    <div id="sensor1-point" class="connection-point" style="left: 20px; top: 50px;"></div>
                    <div id="sensor2-point" class="connection-point" style="left: 20px; top: 100px;"></div>
                    <div id="sensor3-point" class="connection-point" style="left: 20px; top: 150px;"></div>
                    
                    <div id="plc1-point" class="connection-point" style="right: 20px; top: 50px;"></div>
                    <div id="plc2-point" class="connection-point" style="right: 20px; top: 100px;"></div>
                    <div id="plc3-point" class="connection-point" style="right: 20px; top: 150px;"></div>
                </div>
                
                <!-- PLC Status -->
                <div class="plc-status">
                    <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-microchip"></i> PLC Input Status
                    </h4>
                    <div class="plc-indicators">
                        <div class="plc-input">
                            <span class="input-label">Input 1</span>
                            <div id="plc-input1" class="plc-indicator off"></div>
                            <div style="color: #666; margin-top: 5px;">0-24V DC</div>
                        </div>
                        <div class="plc-input">
                            <span class="input-label">Input 2</span>
                            <div id="plc-input2" class="plc-indicator off"></div>
                            <div style="color: #666; margin-top: 5px;">0-24V DC</div>
                        </div>
                        <div class="plc-input">
                            <span class="input-label">Input 3</span>
                            <div id="plc-input3" class="plc-indicator off"></div>
                            <div style="color: #666; margin-top: 5px;">0-24V DC</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <!-- Maintenance Tools -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-tools"></i> Maintenance Tools
                    </h4>
                    <div style="display: grid; gap: 10px;">
                        <button id="test-continuity" class="maintenance-btn">
                            <i class="fas fa-bolt"></i> Test Continuity
                        </button>
                        <button id="check-wiring" class="maintenance-btn">
                            <i class="fas fa-plug"></i> Check Wiring
                        </button>
                        <button id="verify-logic" class="maintenance-btn">
                            <i class="fas fa-code-branch"></i> Verify Logic
                        </button>
                        <button id="reset-sensors" class="maintenance-btn">
                            <i class="fas fa-undo"></i> Reset Sensors
                        </button>
                    </div>
                </div>
                
                <!-- Fault Injection -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #FF5722; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-triangle"></i> Fault Injection
                    </h4>
                    <div style="display: grid; gap: 10px;">
                        <button id="inject-wiring" class="fault-btn">
                            <i class="fas fa-cut"></i> Wiring Fault
                        </button>
                        <button id="inject-sensor" class="fault-btn">
                            <i class="fas fa-exclamation-circle"></i> Sensor Fault
                        </button>
                        <button id="inject-logic" class="fault-btn">
                            <i class="fas fa-random"></i> Logic Fault
                        </button>
                        <button id="clear-faults" style="background: #4CAF50; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <i class="fas fa-broom"></i> Clear All Faults
                        </button>
                    </div>
                </div>
                
                <!-- Maintenance Tasks -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #4CAF50; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-tasks"></i> Maintenance Tasks
                    </h4>
                    <div style="display: grid; gap: 10px;">
                        <label class="task-item">
                            <input type="checkbox" id="task-continuity">
                            <span>Test wire continuity</span>
                        </label>
                        <label class="task-item">
                            <input type="checkbox" id="task-wiring">
                            <span>Check terminal connections</span>
                        </label>
                        <label class="task-item">
                            <input type="checkbox" id="task-logic">
                            <span>Verify NO/NC logic</span>
                        </label>
                        <label class="task-item">
                            <input type="checkbox" id="task-interface">
                            <span>Test interface requirements</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Diagnostic Information -->
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-terminal"></i> Diagnostic Information
            </h4>
            <div id="diagnostic-log" class="diagnostic-log">
                <p>System initialized. Digital sensors ready for testing.</p>
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
    // Update sensor indicators and wiring
    Object.keys(digitalSensorsData.sensors).forEach((sensorId, index) => {
        const sensor = digitalSensorsData.sensors[sensorId];
        const indicator = document.getElementById(sensorId + '-indicator');
        const plcIndicator = document.getElementById('plc-input' + (index + 1));
        
        // Update sensor indicator
        if (indicator) {
            indicator.className = 'sensor-indicator ' + (sensor.state ? 'on' : 'off');
            indicator.style.boxShadow = sensor.state ? 
                '0 0 20px rgba(76,175,80,0.4)' : 
                'inset 0 0 10px rgba(0,0,0,0.5)';
        }
        
        // Calculate PLC input based on sensor type and state
        let plcInput = sensor.state;
        if (sensor.type === 'NC') {
            plcInput = !sensor.state; // NC is inverted
        }
        
        // Apply wiring faults
        const hasWiringFault = !digitalSensorsData.wiringStatus[index];
        if (hasWiringFault) {
            plcInput = false; // Wiring fault forces input to false
        }
        
        digitalSensorsData.plcInputs[index] = plcInput;
        
        // Update PLC indicator
        if (plcIndicator) {
            plcIndicator.className = 'plc-indicator ' + (plcInput ? 'on' : 'off');
            plcIndicator.style.boxShadow = plcInput ? 
                '0 0 20px rgba(33,150,243,0.4)' : 
                'inset 0 0 10px rgba(0,0,0,0.5)';
        }
        
        // Update wiring visualization
        const wire = document.getElementById('wire' + (index + 1));
        const sensorPoint = document.getElementById('sensor' + (index + 1) + '-point');
        const plcPoint = document.getElementById('plc' + (index + 1) + '-point');
        
        if (wire && sensorPoint && plcPoint) {
            // Position wire
            const sensorRect = sensorPoint.getBoundingClientRect();
            const plcRect = plcPoint.getBoundingClientRect();
            const diagramRect = wire.parentElement.getBoundingClientRect();
            
            const startX = sensorPoint.offsetLeft + 6;
            const startY = sensorPoint.offsetTop + 6;
            const endX = plcPoint.offsetLeft + 6;
            const endY = plcPoint.offsetTop + 6;
            
            wire.style.left = startX + 'px';
            wire.style.top = startY + 'px';
            wire.style.width = (endX - startX) + 'px';
            wire.style.height = '2px';
            
            // Update wire and connection point states
            if (hasWiringFault) {
                wire.className = 'wire fault';
                sensorPoint.className = 'connection-point fault';
                plcPoint.className = 'connection-point fault';
            } else if (sensor.state) {
                wire.className = 'wire active';
                sensorPoint.className = 'connection-point active';
                plcPoint.className = 'connection-point active';
            } else {
                wire.className = 'wire';
                sensorPoint.className = 'connection-point';
                plcPoint.className = 'connection-point';
            }
        }
    });
}

function testContinuity() {
    const results = digitalSensorsData.wiringStatus.map((status, index) => {
        const resistance = status ? '< 1Ω' : '∞ Ω';
        const voltage = status ? '24V' : '0V';
        return {
            input: index + 1,
            status: status ? 'Good' : 'Open Circuit',
            resistance,
            voltage
        };
    });
    
    const hasIssues = results.some(r => r.status !== 'Good');
    const messageType = hasIssues ? 'warning' : 'success';
    
    logDiagnostic(`Continuity test completed:
    ${results.map(r => `• Input ${r.input}: ${r.status}
    \t- Resistance: ${r.resistance}
    \t- Voltage: ${r.voltage}`).join('\n')}`, messageType);
    
    // Highlight tested wires
    results.forEach((result, index) => {
        const wire = document.getElementById('wire' + (index + 1));
        if (wire) {
            wire.style.animation = 'activeGlow 1s ease';
            setTimeout(() => {
                wire.style.animation = '';
            }, 1000);
        }
    });
}

function checkWiring() {
    const issues = digitalSensorsData.wiringStatus.map((status, index) => ({
        input: index + 1,
        status: status ? 'Connected' : 'Disconnected',
        voltage: status ? '24V' : '0V',
        current: status ? '20mA' : '0mA'
    }));
    
    const hasIssues = issues.some(i => i.status === 'Disconnected');
    const messageType = hasIssues ? 'warning' : 'success';
    
    logDiagnostic(`Wiring check completed:
    ${issues.map(i => `• Input ${i.input}: ${i.status}
    \t- Voltage: ${i.voltage}
    \t- Current: ${i.current}`).join('\n')}`, messageType);
    
    // Highlight connection points
    issues.forEach((issue, index) => {
        const sensorPoint = document.getElementById('sensor' + (index + 1) + '-point');
        const plcPoint = document.getElementById('plc' + (index + 1) + '-point');
        
        [sensorPoint, plcPoint].forEach(point => {
            if (point) {
                point.style.animation = 'activeGlow 1s ease';
                setTimeout(() => {
                    point.style.animation = '';
                }, 1000);
            }
        });
    });
}

function verifyLogic() {
    const results = Object.keys(digitalSensorsData.sensors).map((sensorId, index) => {
        const sensor = digitalSensorsData.sensors[sensorId];
        const expectedPlcInput = sensor.type === 'NC' ? !sensor.state : sensor.state;
        const actualPlcInput = digitalSensorsData.plcInputs[index];
        
        return {
            sensor: sensorId,
            type: sensor.type,
            state: sensor.state ? 'ON' : 'OFF',
            expected: expectedPlcInput ? 'ON' : 'OFF',
            actual: actualPlcInput ? 'ON' : 'OFF',
            status: expectedPlcInput === actualPlcInput ? 'Pass' : 'Fail'
        };
    });
    
    const hasIssues = results.some(r => r.status === 'Fail');
    const messageType = hasIssues ? 'warning' : 'success';
    
    logDiagnostic(`Logic verification completed:
    ${results.map(r => `• ${r.sensor} (${r.type}): ${r.status}
    \t- Sensor State: ${r.state}
    \t- Expected PLC: ${r.expected}
    \t- Actual PLC: ${r.actual}`).join('\n')}`, messageType);
    
    // Highlight verified components
    results.forEach((result, index) => {
        const indicator = document.getElementById(result.sensor + '-indicator');
        const plcIndicator = document.getElementById('plc-input' + (index + 1));
        
        [indicator, plcIndicator].forEach(element => {
            if (element) {
                element.style.animation = 'activeGlow 1s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 1000);
            }
        });
    });
}

function resetSensors() {
    const previousStates = Object.keys(digitalSensorsData.sensors).map(sensorId => ({
        sensor: sensorId,
        state: digitalSensorsData.sensors[sensorId].state ? 'ON' : 'OFF'
    }));
    
    Object.keys(digitalSensorsData.sensors).forEach(sensorId => {
        digitalSensorsData.sensors[sensorId].state = false;
    });
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`Sensors reset completed:
    ${previousStates.map(s => `• ${s.sensor}: ${s.state} → OFF`).join('\n')}`, 'success');
}

function injectWiringFault() {
    digitalSensorsData.faults.push('wiring');
    const randomIndex = Math.floor(Math.random() * 3);
    digitalSensorsData.wiringStatus[randomIndex] = false;
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`Wiring fault injected:
    • Input ${randomIndex + 1} connection lost
    • Circuit open detected
    • Signal path interrupted
    • Maintenance required`, 'error');
    
    // Flash affected wire
    const wire = document.getElementById('wire' + (randomIndex + 1));
    if (wire) {
        wire.style.animation = 'wireFault 1s ease';
        setTimeout(() => {
            wire.style.animation = '';
        }, 1000);
    }
}

function injectSensorFault() {
    digitalSensorsData.faults.push('sensor');
    const randomSensor = Object.keys(digitalSensorsData.sensors)[Math.floor(Math.random() * 3)];
    const healthReduction = 30;
    const oldHealth = digitalSensorsData.sensors[randomSensor].health;
    digitalSensorsData.sensors[randomSensor].health = Math.max(0, oldHealth - healthReduction);
    
    logDiagnostic(`Sensor fault injected:
    • ${randomSensor} health degraded
    • Health reduction: ${healthReduction}%
    • Current health: ${digitalSensorsData.sensors[randomSensor].health}%
    • Calibration recommended`, 'error');
    
    // Flash affected sensor
    const indicator = document.getElementById(randomSensor + '-indicator');
    if (indicator) {
        indicator.style.animation = 'sensorFault 1s ease';
        setTimeout(() => {
            indicator.style.animation = '';
        }, 1000);
    }
}

function injectLogicFault() {
    digitalSensorsData.faults.push('logic');
    const randomSensor = Object.keys(digitalSensorsData.sensors)[Math.floor(Math.random() * 3)];
    const oldType = digitalSensorsData.sensors[randomSensor].type;
    const newType = oldType === 'NO' ? 'NC' : 'NO';
    digitalSensorsData.sensors[randomSensor].type = newType;
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`Logic fault injected:
    • ${randomSensor} type changed
    • Previous type: ${oldType}
    • Current type: ${newType}
    • Logic verification needed`, 'error');
    
    // Flash affected sensor and PLC input
    const sensorIndex = parseInt(randomSensor.replace('sensor', '')) - 1;
    const plcIndicator = document.getElementById('plc-input' + (sensorIndex + 1));
    if (plcIndicator) {
        plcIndicator.style.animation = 'logicFault 1s ease';
        setTimeout(() => {
            plcIndicator.style.animation = '';
        }, 1000);
    }
}

function clearAllFaults() {
    const faultCount = digitalSensorsData.faults.length;
    const wiringFaults = digitalSensorsData.wiringStatus.filter(status => !status).length;
    const sensorFaults = Object.values(digitalSensorsData.sensors).filter(sensor => sensor.health < 100).length;
    const logicFaults = Object.values(digitalSensorsData.sensors).filter(sensor => 
        (sensor.type === 'NO' && sensor === digitalSensorsData.sensors.sensor2) || 
        (sensor.type === 'NC' && sensor !== digitalSensorsData.sensors.sensor2)
    ).length;
    
    digitalSensorsData.faults = [];
    digitalSensorsData.wiringStatus = [true, true, true];
    Object.keys(digitalSensorsData.sensors).forEach(sensorId => {
        digitalSensorsData.sensors[sensorId].health = 100;
        digitalSensorsData.sensors[sensorId].type = sensorId === 'sensor2' ? 'NC' : 'NO';
    });
    updateDigitalSensorsDisplay();
    
    logDiagnostic(`System restored to normal operation:
    • Total faults cleared: ${faultCount}
    • Wiring faults fixed: ${wiringFaults}
    • Sensor health restored: ${sensorFaults}
    • Logic types corrected: ${logicFaults}`, 'success');
}

function updateMaintenanceStatus() {
    const tasks = document.querySelectorAll('.task-item input[type="checkbox"]:checked');
    logDiagnostic('Maintenance tasks completed: ' + tasks.length + '/4');
    
    if (tasks.length === 4) {
        logDiagnostic('All maintenance tasks completed - system optimized');
    }
}

function logDiagnostic(message, type = 'info') {
    const log = document.getElementById('diagnostic-log');
    if (log) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('p');
        
        // Define colors for different message types
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            error: '#FF5722'
        };
        
        // Add icon based on message type
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        
        logEntry.innerHTML = `
            <span style="color: #666;">[${timestamp}]</span>
            <i class="fas fa-${icons[type]}" style="color: ${colors[type]}; margin: 0 5px;"></i>
            <span style="color: ${colors[type]};">${message}</span>
        `;
        
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
        
        // Highlight effect
        logEntry.style.backgroundColor = `${colors[type]}10`;
        setTimeout(() => {
            logEntry.style.backgroundColor = 'transparent';
            logEntry.style.transition = 'background-color 0.5s ease';
        }, 100);
    }
}

function startDigitalSensorsSimulation() {
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes wireFault {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        
        @keyframes sensorFault {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        @keyframes logicFault {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.5); }
        }
        
        @keyframes activeGlow {
            0% { box-shadow: 0 0 5px currentColor; }
            50% { box-shadow: 0 0 15px currentColor; }
            100% { box-shadow: 0 0 5px currentColor; }
        }
    `;
    document.head.appendChild(style);
    
    logDiagnostic('Digital sensors simulation initialized and ready for testing', 'success');
}

// Auto-initialize if function exists
if (typeof initializeDigitalSensorsSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeDigitalSensorsSimulation, 1000);
    });
} 