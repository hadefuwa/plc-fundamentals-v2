// Flow Sensor Simulation
// Worksheet 10 - Flow Sensor System Maintenance

let flowSensorData = {
    flowRate: 50,
    turbineSpeed: 0,
    pulseFrequency: 0,
    isBlocked: false,
    calibrationOffset: 0,
    sensorHealth: 100,
    faults: []
};

function initializeFlowSensorSimulation() {
    console.log('Initializing Flow Sensor Simulation');
    
    const panel = document.getElementById('flow-sensor-panel');
    if (!panel) {
        console.error('Flow sensor panel not found');
        return;
    }
    
    panel.innerHTML = `
        <div class="simulation-header">
            <h3><i class="fas fa-tachometer-alt"></i> Flow Sensor System</h3>
            <p>Interactive flow sensor maintenance and troubleshooting simulation</p>
        </div>
        
        <div class="simulation-grid">
            <div class="simulation-left">
                <div class="flow-visualization">
                    <h4>Flow Measurement</h4>
                    <div id="flow-display" class="flow-display">
                        <div id="turbine-animation" class="turbine-animation"></div>
                        <div class="flow-indicators">
                            <div class="flow-rate">Flow Rate: <span id="flow-rate-value">50</span> L/min</div>
                            <div class="turbine-speed">Turbine Speed: <span id="turbine-speed-value">0</span> RPM</div>
                            <div class="pulse-freq">Pulse Frequency: <span id="pulse-freq-value">0</span> Hz</div>
                        </div>
                    </div>
                    <div class="flow-controls">
                        <label>Flow Rate: <input type="range" id="flow-rate" min="0" max="100" value="50"></label>
                        <label>Calibration Offset: <input type="range" id="calibration-offset" min="-20" max="20" value="0"></label>
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
                            <span class="status-label">Blockage Level:</span>
                            <span id="blockage-level" class="status-value">0%</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Calibration:</span>
                            <span id="calibration-status" class="status-value">Good</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <div class="maintenance-tools">
                    <h4>Maintenance Tools</h4>
                    <div class="tool-buttons">
                        <button id="clean-sensor" class="maintenance-btn">Clean Sensor</button>
                        <button id="calibrate-sensor" class="maintenance-btn">Calibrate Sensor</button>
                        <button id="inspect-turbine" class="maintenance-btn">Inspect Turbine</button>
                        <button id="verify-signals" class="maintenance-btn">Verify Signals</button>
                    </div>
                </div>
                
                <div class="fault-injection">
                    <h4>Fault Injection</h4>
                    <div class="fault-buttons">
                        <button id="inject-blockage" class="fault-btn">Block Sensor</button>
                        <button id="inject-calibration" class="fault-btn">Calibration Drift</button>
                        <button id="inject-turbine" class="fault-btn">Turbine Fault</button>
                        <button id="clear-faults" class="fault-btn" style="background: #4CAF50;">Clear All Faults</button>
                    </div>
                </div>
                
                <div class="maintenance-tasks">
                    <h4>Maintenance Tasks</h4>
                    <div class="task-list">
                        <div class="task-item">
                            <input type="checkbox" id="task-clean">
                            <label for="task-clean">Clean sensor and turbine</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-calibrate">
                            <label for="task-calibrate">Calibrate flow measurement</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-inspect">
                            <label for="task-inspect">Inspect turbine bearings</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-verify">
                            <label for="task-verify">Verify signal output</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="simulation-footer">
            <div class="diagnostic-info">
                <h4>Diagnostic Information</h4>
                <div id="diagnostic-log" class="diagnostic-log">
                    <p>System initialized. Flow sensor ready for testing.</p>
                </div>
            </div>
        </div>
    `;
    
    initializeFlowSensorControls();
    updateFlowSensorDisplay();
    startFlowSensorSimulation();
}

function initializeFlowSensorControls() {
    // Flow rate control
    document.getElementById('flow-rate').addEventListener('input', function() {
        flowSensorData.flowRate = parseInt(this.value);
        updateFlowSensorDisplay();
    });
    
    // Calibration offset control
    document.getElementById('calibration-offset').addEventListener('input', function() {
        flowSensorData.calibrationOffset = parseInt(this.value);
        updateFlowSensorDisplay();
    });
    
    // Maintenance buttons
    document.getElementById('clean-sensor').addEventListener('click', cleanSensor);
    document.getElementById('calibrate-sensor').addEventListener('click', calibrateSensor);
    document.getElementById('inspect-turbine').addEventListener('click', inspectTurbine);
    document.getElementById('verify-signals').addEventListener('click', verifySignals);
    
    // Fault injection buttons
    document.getElementById('inject-blockage').addEventListener('click', injectBlockageFault);
    document.getElementById('inject-calibration').addEventListener('click', injectCalibrationFault);
    document.getElementById('inject-turbine').addEventListener('click', injectTurbineFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function updateFlowSensorDisplay() {
    // Calculate turbine speed based on flow rate
    flowSensorData.turbineSpeed = flowSensorData.flowRate * 10;
    
    // Calculate pulse frequency
    flowSensorData.pulseFrequency = Math.round(flowSensorData.flowRate * 2 + flowSensorData.calibrationOffset);
    
    // Update displays
    document.getElementById('flow-rate-value').textContent = flowSensorData.flowRate;
    document.getElementById('turbine-speed-value').textContent = flowSensorData.turbineSpeed;
    document.getElementById('pulse-freq-value').textContent = flowSensorData.pulseFrequency;
    
    // Update turbine animation
    const turbine = document.getElementById('turbine-animation');
    if (turbine) {
        turbine.style.animationDuration = Math.max(0.1, 2 - (flowSensorData.flowRate / 50)) + 's';
    }
    
    // Update status displays
    updateStatusDisplays();
}

function updateStatusDisplays() {
    const sensorHealth = document.getElementById('sensor-health');
    const blockageLevel = document.getElementById('blockage-level');
    const calibrationStatus = document.getElementById('calibration-status');
    
    if (sensorHealth) {
        sensorHealth.textContent = flowSensorData.sensorHealth + '%';
        sensorHealth.className = 'status-value ' + (flowSensorData.sensorHealth > 80 ? 'good' : flowSensorData.sensorHealth > 50 ? 'fair' : 'poor');
    }
    
    if (blockageLevel) {
        const blockage = flowSensorData.isBlocked ? 100 : 0;
        blockageLevel.textContent = blockage + '%';
        blockageLevel.className = 'status-value ' + (blockage > 50 ? 'poor' : 'good');
    }
    
    if (calibrationStatus) {
        const calibration = Math.abs(flowSensorData.calibrationOffset) < 5 ? 'Good' : 'Needs Calibration';
        calibrationStatus.textContent = calibration;
        calibrationStatus.className = 'status-value ' + (calibration === 'Good' ? 'good' : 'poor');
    }
}

function cleanSensor() {
    flowSensorData.isBlocked = false;
    flowSensorData.sensorHealth = Math.min(100, flowSensorData.sensorHealth + 20);
    updateFlowSensorDisplay();
    logDiagnostic('Sensor cleaning completed - blockage cleared, health improved');
}

function calibrateSensor() {
    flowSensorData.calibrationOffset = 0;
    document.getElementById('calibration-offset').value = 0;
    updateFlowSensorDisplay();
    logDiagnostic('Sensor calibration completed - offset reset to zero');
}

function inspectTurbine() {
    if (flowSensorData.faults.includes('turbine')) {
        flowSensorData.faults = flowSensorData.faults.filter(f => f !== 'turbine');
        logDiagnostic('Turbine inspection completed - fault detected and resolved');
    } else {
        logDiagnostic('Turbine inspection completed - no issues found');
    }
    updateFlowSensorDisplay();
}

function verifySignals() {
    const signalQuality = flowSensorData.pulseFrequency > 0 ? 'Good' : 'No Signal';
    logDiagnostic('Signal verification completed - ' + signalQuality + ' pulse frequency detected');
}

function injectBlockageFault() {
    flowSensorData.faults.push('blockage');
    flowSensorData.isBlocked = true;
    flowSensorData.flowRate = Math.max(0, flowSensorData.flowRate - 30);
    updateFlowSensorDisplay();
    logDiagnostic('Blockage fault injected - flow rate reduced');
}

function injectCalibrationFault() {
    flowSensorData.faults.push('calibration');
    flowSensorData.calibrationOffset = Math.random() * 40 - 20;
    document.getElementById('calibration-offset').value = flowSensorData.calibrationOffset;
    updateFlowSensorDisplay();
    logDiagnostic('Calibration fault injected - offset applied');
}

function injectTurbineFault() {
    flowSensorData.faults.push('turbine');
    flowSensorData.sensorHealth = Math.max(0, flowSensorData.sensorHealth - 30);
    updateFlowSensorDisplay();
    logDiagnostic('Turbine fault injected - sensor health degraded');
}

function clearAllFaults() {
    flowSensorData.faults = [];
    flowSensorData.isBlocked = false;
    flowSensorData.calibrationOffset = 0;
    flowSensorData.sensorHealth = 100;
    
    document.getElementById('calibration-offset').value = 0;
    updateFlowSensorDisplay();
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

function startFlowSensorSimulation() {
    logDiagnostic('Flow sensor simulation started');
    
    // Periodic updates
    setInterval(() => {
        if (flowSensorData.faults.length > 0) {
            // Simulate fault effects
            if (flowSensorData.faults.includes('blockage')) {
                flowSensorData.flowRate = Math.max(0, flowSensorData.flowRate - 1);
                document.getElementById('flow-rate').value = flowSensorData.flowRate;
            }
        }
    }, 3000);
}

// Auto-initialize if function exists
if (typeof initializeFlowSensorSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeFlowSensorSimulation, 1000);
    });
} 