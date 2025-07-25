// Analogue Sensors Simulation
// Worksheet 13 - Analogue Sensors System Maintenance

let analogueSensorsData = {
    voltageInput: 5.0,
    rawValue: 0,
    scaledValue: 0,
    scalingFactor: 1.0,
    offset: 0,
    noiseLevel: 0,
    sensorHealth: 100,
    faults: []
};

function initializeAnalogueSensorsSimulation() {
    console.log('Initializing Analogue Sensors Simulation');
    
    const panel = document.getElementById('analogue-sensors-panel');
    if (!panel) {
        console.error('Analogue sensors panel not found');
        return;
    }
    
    panel.innerHTML = `
        <div class="simulation-header">
            <h3><i class="fas fa-wave-square"></i> Analogue Sensors System</h3>
            <p>Interactive analogue sensors maintenance and troubleshooting simulation</p>
        </div>
        
        <div class="simulation-grid">
            <div class="simulation-left">
                <div class="analogue-visualization">
                    <h4>Analogue Signal Processing</h4>
                    <div id="signal-display" class="signal-display">
                        <div class="signal-indicators">
                            <div class="voltage">Voltage Input: <span id="voltage-value">5.0</span>V</div>
                            <div class="raw">PLC Raw Value: <span id="raw-value">0</span></div>
                            <div class="scaled">Scaled Value: <span id="scaled-value">0</span></div>
                        </div>
                        <div id="signal-waveform" class="signal-waveform"></div>
                    </div>
                    <div class="signal-controls">
                        <label>Voltage Input: <input type="range" id="voltage-input" min="0" max="10" step="0.1" value="5.0"></label>
                        <label>Scaling Factor: <input type="range" id="scaling-factor" min="0.1" max="2.0" step="0.1" value="1.0"></label>
                        <label>Offset: <input type="range" id="offset" min="-5" max="5" step="0.1" value="0"></label>
                        <label>Noise Level: <input type="range" id="noise-level" min="0" max="1" step="0.1" value="0"></label>
                    </div>
                </div>
                
                <div class="sensor-status">
                    <h4>Sensor Status</h4>
                    <div class="status-indicators">
                        <div class="status-item">
                            <span class="status-label">Signal Quality:</span>
                            <span id="signal-quality" class="status-value">Good</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Calibration:</span>
                            <span id="calibration-status" class="status-value">Good</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Noise Level:</span>
                            <span id="noise-status" class="status-value">Low</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <div class="maintenance-tools">
                    <h4>Maintenance Tools</h4>
                    <div class="tool-buttons">
                        <button id="calibrate-signal" class="maintenance-btn">Calibrate Signal</button>
                        <button id="adjust-scaling" class="maintenance-btn">Adjust Scaling</button>
                        <button id="reduce-noise" class="maintenance-btn">Reduce Noise</button>
                        <button id="verify-accuracy" class="maintenance-btn">Verify Accuracy</button>
                    </div>
                </div>
                
                <div class="fault-injection">
                    <h4>Fault Injection</h4>
                    <div class="fault-buttons">
                        <button id="inject-scaling" class="fault-btn">Scaling Fault</button>
                        <button id="inject-offset" class="fault-btn">Offset Fault</button>
                        <button id="inject-noise" class="fault-btn">Noise Fault</button>
                        <button id="clear-faults" class="fault-btn" style="background: #4CAF50;">Clear All Faults</button>
                    </div>
                </div>
                
                <div class="maintenance-tasks">
                    <h4>Maintenance Tasks</h4>
                    <div class="task-list">
                        <div class="task-item">
                            <input type="checkbox" id="task-scaling">
                            <label for="task-scaling">Check signal scaling</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-offset">
                            <label for="task-offset">Verify offset values</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-noise">
                            <label for="task-noise">Assess noise levels</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-shielding">
                            <label for="task-shielding">Check shielding</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="simulation-footer">
            <div class="diagnostic-info">
                <h4>Diagnostic Information</h4>
                <div id="diagnostic-log" class="diagnostic-log">
                    <p>System initialized. Analogue sensors ready for testing.</p>
                </div>
            </div>
        </div>
    `;
    
    initializeAnalogueSensorsControls();
    updateAnalogueSensorsDisplay();
    startAnalogueSensorsSimulation();
}

function initializeAnalogueSensorsControls() {
    // Signal controls
    document.getElementById('voltage-input').addEventListener('input', function() {
        analogueSensorsData.voltageInput = parseFloat(this.value);
        updateAnalogueSensorsDisplay();
    });
    
    document.getElementById('scaling-factor').addEventListener('input', function() {
        analogueSensorsData.scalingFactor = parseFloat(this.value);
        updateAnalogueSensorsDisplay();
    });
    
    document.getElementById('offset').addEventListener('input', function() {
        analogueSensorsData.offset = parseFloat(this.value);
        updateAnalogueSensorsDisplay();
    });
    
    document.getElementById('noise-level').addEventListener('input', function() {
        analogueSensorsData.noiseLevel = parseFloat(this.value);
        updateAnalogueSensorsDisplay();
    });
    
    // Maintenance buttons
    document.getElementById('calibrate-signal').addEventListener('click', calibrateSignal);
    document.getElementById('adjust-scaling').addEventListener('click', adjustScaling);
    document.getElementById('reduce-noise').addEventListener('click', reduceNoise);
    document.getElementById('verify-accuracy').addEventListener('click', verifyAccuracy);
    
    // Fault injection buttons
    document.getElementById('inject-scaling').addEventListener('click', injectScalingFault);
    document.getElementById('inject-offset').addEventListener('click', injectOffsetFault);
    document.getElementById('inject-noise').addEventListener('click', injectNoiseFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function updateAnalogueSensorsDisplay() {
    // Calculate raw value (0-32767 for typical PLC)
    analogueSensorsData.rawValue = Math.round((analogueSensorsData.voltageInput / 10) * 32767);
    
    // Calculate scaled value with offset and noise
    let scaledValue = (analogueSensorsData.rawValue / 32767) * analogueSensorsData.scalingFactor + analogueSensorsData.offset;
    
    // Add noise if present
    if (analogueSensorsData.noiseLevel > 0) {
        const noise = (Math.random() - 0.5) * analogueSensorsData.noiseLevel;
        scaledValue += noise;
    }
    
    analogueSensorsData.scaledValue = scaledValue;
    
    // Update displays
    document.getElementById('voltage-value').textContent = analogueSensorsData.voltageInput.toFixed(1);
    document.getElementById('raw-value').textContent = analogueSensorsData.rawValue;
    document.getElementById('scaled-value').textContent = analogueSensorsData.scaledValue.toFixed(2);
    
    // Update status displays
    updateStatusDisplays();
}

function updateStatusDisplays() {
    const signalQuality = document.getElementById('signal-quality');
    const calibrationStatus = document.getElementById('calibration-status');
    const noiseStatus = document.getElementById('noise-status');
    
    if (signalQuality) {
        const quality = analogueSensorsData.noiseLevel < 0.1 ? 'Good' : analogueSensorsData.noiseLevel < 0.5 ? 'Fair' : 'Poor';
        signalQuality.textContent = quality;
        signalQuality.className = 'status-value ' + quality.toLowerCase();
    }
    
    if (calibrationStatus) {
        const calibration = Math.abs(analogueSensorsData.offset) < 0.5 ? 'Good' : 'Needs Calibration';
        calibrationStatus.textContent = calibration;
        calibrationStatus.className = 'status-value ' + (calibration === 'Good' ? 'good' : 'poor');
    }
    
    if (noiseStatus) {
        const noise = analogueSensorsData.noiseLevel < 0.1 ? 'Low' : analogueSensorsData.noiseLevel < 0.5 ? 'Medium' : 'High';
        noiseStatus.textContent = noise;
        noiseStatus.className = 'status-value ' + noise.toLowerCase();
    }
}

function calibrateSignal() {
    analogueSensorsData.offset = 0;
    analogueSensorsData.scalingFactor = 1.0;
    document.getElementById('offset').value = 0;
    document.getElementById('scaling-factor').value = 1.0;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Signal calibration completed - offset and scaling reset');
}

function adjustScaling() {
    analogueSensorsData.scalingFactor = 1.0;
    document.getElementById('scaling-factor').value = 1.0;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Scaling adjustment completed');
}

function reduceNoise() {
    analogueSensorsData.noiseLevel = 0;
    document.getElementById('noise-level').value = 0;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Noise reduction completed');
}

function verifyAccuracy() {
    const accuracy = Math.abs(analogueSensorsData.voltageInput - analogueSensorsData.scaledValue);
    const accuracyStatus = accuracy < 0.5 ? 'Good' : 'Needs Attention';
    logDiagnostic('Accuracy verification completed - ' + accuracyStatus + ' (error: ' + accuracy.toFixed(2) + ')');
}

function injectScalingFault() {
    analogueSensorsData.faults.push('scaling');
    analogueSensorsData.scalingFactor = Math.random() * 2 + 0.5;
    document.getElementById('scaling-factor').value = analogueSensorsData.scalingFactor;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Scaling fault injected');
}

function injectOffsetFault() {
    analogueSensorsData.faults.push('offset');
    analogueSensorsData.offset = (Math.random() - 0.5) * 10;
    document.getElementById('offset').value = analogueSensorsData.offset;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Offset fault injected');
}

function injectNoiseFault() {
    analogueSensorsData.faults.push('noise');
    analogueSensorsData.noiseLevel = Math.random() * 1;
    document.getElementById('noise-level').value = analogueSensorsData.noiseLevel;
    updateAnalogueSensorsDisplay();
    logDiagnostic('Noise fault injected');
}

function clearAllFaults() {
    analogueSensorsData.faults = [];
    analogueSensorsData.offset = 0;
    analogueSensorsData.scalingFactor = 1.0;
    analogueSensorsData.noiseLevel = 0;
    
    document.getElementById('offset').value = 0;
    document.getElementById('scaling-factor').value = 1.0;
    document.getElementById('noise-level').value = 0;
    updateAnalogueSensorsDisplay();
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

function startAnalogueSensorsSimulation() {
    logDiagnostic('Analogue sensors simulation started');
    
    // Periodic updates for noise simulation
    setInterval(() => {
        if (analogueSensorsData.noiseLevel > 0) {
            updateAnalogueSensorsDisplay();
        }
    }, 1000);
}

// Auto-initialize if function exists
if (typeof initializeAnalogueSensorsSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeAnalogueSensorsSimulation, 1000);
    });
} 