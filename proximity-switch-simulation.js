// Proximity Switch Simulation
// Worksheet 9 - Proximity Switch System Maintenance

let proximitySwitchData = {
    sensorPosition: { x: 50, y: 50 },
    targetPosition: { x: 60, y: 50 },
    detectionRange: 15,
    isDetecting: false,
    sensorType: 'inductive',
    environmentalFactors: {
        dust: 0,
        moisture: 0,
        vibration: 0
    },
    faults: []
};

function initializeProximitySwitchSimulation() {
    console.log('Initializing Proximity Switch Simulation');
    
    const panel = document.getElementById('proximity-sensor-panel');
    if (!panel) {
        console.error('Proximity sensor panel not found');
        return;
    }
    
    panel.innerHTML = `
        <div class="simulation-header">
            <h3><i class="fas fa-sensor"></i> Proximity Switch System</h3>
            <p>Interactive proximity switch maintenance and troubleshooting simulation</p>
        </div>
        
        <div class="simulation-grid">
            <div class="simulation-left">
                <div class="sensor-visualization">
                    <h4>Sensor Alignment</h4>
                    <div id="sensor-canvas" class="sensor-canvas">
                        <div id="proximity-sensor" class="proximity-sensor"></div>
                        <div id="target-object" class="target-object"></div>
                        <div id="detection-zone" class="detection-zone"></div>
                    </div>
                    <div class="sensor-controls">
                        <label>Target Position X: <input type="range" id="target-x" min="10" max="90" value="60"></label>
                        <label>Target Position Y: <input type="range" id="target-y" min="10" max="90" value="50"></label>
                        <label>Detection Range: <input type="range" id="detection-range" min="5" max="30" value="15"></label>
                    </div>
                </div>
                
                <div class="sensor-status">
                    <h4>Sensor Status</h4>
                    <div class="status-indicators">
                        <div class="status-item">
                            <span class="status-label">Detection:</span>
                            <span id="detection-status" class="status-value">No Detection</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Distance:</span>
                            <span id="distance-value" class="status-value">0 mm</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Signal Quality:</span>
                            <span id="signal-quality" class="status-value">Good</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <div class="environmental-factors">
                    <h4>Environmental Factors</h4>
                    <div class="factor-controls">
                        <label>Dust Level: <input type="range" id="dust-level" min="0" max="100" value="0"></label>
                        <label>Moisture Level: <input type="range" id="moisture-level" min="0" max="100" value="0"></label>
                        <label>Vibration Level: <input type="range" id="vibration-level" min="0" max="100" value="0"></label>
                    </div>
                </div>
                
                <div class="fault-injection">
                    <h4>Fault Injection</h4>
                    <div class="fault-buttons">
                        <button id="inject-misalignment" class="fault-btn">Misalignment Fault</button>
                        <button id="inject-interference" class="fault-btn">Interference Fault</button>
                        <button id="inject-environmental" class="fault-btn">Environmental Fault</button>
                        <button id="clear-faults" class="fault-btn" style="background: #4CAF50;">Clear All Faults</button>
                    </div>
                </div>
                
                <div class="maintenance-tasks">
                    <h4>Maintenance Tasks</h4>
                    <div class="task-list">
                        <div class="task-item">
                            <input type="checkbox" id="task-alignment">
                            <label for="task-alignment">Check sensor alignment</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-clean">
                            <label for="task-clean">Clean sensor face</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-calibrate">
                            <label for="task-calibrate">Calibrate detection range</label>
                        </div>
                        <div class="task-item">
                            <input type="checkbox" id="task-shield">
                            <label for="task-shield">Check shielding and grounding</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="simulation-footer">
            <div class="diagnostic-info">
                <h4>Diagnostic Information</h4>
                <div id="diagnostic-log" class="diagnostic-log">
                    <p>System initialized. Proximity switch ready for testing.</p>
                </div>
            </div>
        </div>
    `;
    
    initializeProximitySwitchControls();
    updateProximitySwitchDisplay();
    startProximitySwitchSimulation();
}

function initializeProximitySwitchControls() {
    // Target position controls
    document.getElementById('target-x').addEventListener('input', function() {
        proximitySwitchData.targetPosition.x = parseInt(this.value);
        updateProximitySwitchDisplay();
    });
    
    document.getElementById('target-y').addEventListener('input', function() {
        proximitySwitchData.targetPosition.y = parseInt(this.value);
        updateProximitySwitchDisplay();
    });
    
    document.getElementById('detection-range').addEventListener('input', function() {
        proximitySwitchData.detectionRange = parseInt(this.value);
        updateProximitySwitchDisplay();
    });
    
    // Environmental factor controls
    document.getElementById('dust-level').addEventListener('input', function() {
        proximitySwitchData.environmentalFactors.dust = parseInt(this.value);
        updateEnvironmentalEffects();
    });
    
    document.getElementById('moisture-level').addEventListener('input', function() {
        proximitySwitchData.environmentalFactors.moisture = parseInt(this.value);
        updateEnvironmentalEffects();
    });
    
    document.getElementById('vibration-level').addEventListener('input', function() {
        proximitySwitchData.environmentalFactors.vibration = parseInt(this.value);
        updateEnvironmentalEffects();
    });
    
    // Fault injection buttons
    document.getElementById('inject-misalignment').addEventListener('click', injectMisalignmentFault);
    document.getElementById('inject-interference').addEventListener('click', injectInterferenceFault);
    document.getElementById('inject-environmental').addEventListener('click', injectEnvironmentalFault);
    document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
    
    // Maintenance task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMaintenanceStatus);
    });
}

function updateProximitySwitchDisplay() {
    const sensor = document.getElementById('proximity-sensor');
    const target = document.getElementById('target-object');
    const detectionZone = document.getElementById('detection-zone');
    
    if (sensor && target && detectionZone) {
        // Update target position
        target.style.left = proximitySwitchData.targetPosition.x + '%';
        target.style.top = proximitySwitchData.targetPosition.y + '%';
        
        // Update detection zone
        detectionZone.style.width = (proximitySwitchData.detectionRange * 2) + 'px';
        detectionZone.style.height = (proximitySwitchData.detectionRange * 2) + 'px';
        detectionZone.style.left = (proximitySwitchData.sensorPosition.x - proximitySwitchData.detectionRange) + '%';
        detectionZone.style.top = (proximitySwitchData.sensorPosition.y - proximitySwitchData.detectionRange) + '%';
        
        // Calculate detection
        const distance = calculateDistance(proximitySwitchData.sensorPosition, proximitySwitchData.targetPosition);
        proximitySwitchData.isDetecting = distance <= proximitySwitchData.detectionRange;
        
        // Update status displays
        updateStatusDisplays(distance);
    }
}

function calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function updateStatusDisplays(distance) {
    const detectionStatus = document.getElementById('detection-status');
    const distanceValue = document.getElementById('distance-value');
    const signalQuality = document.getElementById('signal-quality');
    
    if (detectionStatus) {
        detectionStatus.textContent = proximitySwitchData.isDetecting ? 'DETECTING' : 'No Detection';
        detectionStatus.className = 'status-value ' + (proximitySwitchData.isDetecting ? 'detecting' : 'not-detecting');
    }
    
    if (distanceValue) {
        distanceValue.textContent = Math.round(distance * 10) + ' mm';
    }
    
    if (signalQuality) {
        const quality = calculateSignalQuality();
        signalQuality.textContent = quality;
        signalQuality.className = 'status-value ' + quality.toLowerCase().replace(' ', '-');
    }
}

function calculateSignalQuality() {
    const environmentalImpact = (proximitySwitchData.environmentalFactors.dust + 
                                proximitySwitchData.environmentalFactors.moisture + 
                                proximitySwitchData.environmentalFactors.vibration) / 3;
    
    if (environmentalImpact > 80) return 'Poor';
    if (environmentalImpact > 50) return 'Fair';
    if (environmentalImpact > 20) return 'Good';
    return 'Excellent';
}

function updateEnvironmentalEffects() {
    updateProximitySwitchDisplay();
    logDiagnostic('Environmental factors updated: Dust=' + proximitySwitchData.environmentalFactors.dust + 
                  '%, Moisture=' + proximitySwitchData.environmentalFactors.moisture + 
                  '%, Vibration=' + proximitySwitchData.environmentalFactors.vibration + '%');
}

function injectMisalignmentFault() {
    proximitySwitchData.faults.push('misalignment');
    proximitySwitchData.sensorPosition.x += Math.random() * 10 - 5;
    proximitySwitchData.sensorPosition.y += Math.random() * 10 - 5;
    updateProximitySwitchDisplay();
    logDiagnostic('Misalignment fault injected - sensor position shifted');
}

function injectInterferenceFault() {
    proximitySwitchData.faults.push('interference');
    proximitySwitchData.detectionRange *= 0.7;
    updateProximitySwitchDisplay();
    logDiagnostic('Interference fault injected - detection range reduced');
}

function injectEnvironmentalFault() {
    proximitySwitchData.faults.push('environmental');
    proximitySwitchData.environmentalFactors.dust = Math.min(100, proximitySwitchData.environmentalFactors.dust + 30);
    proximitySwitchData.environmentalFactors.moisture = Math.min(100, proximitySwitchData.environmentalFactors.moisture + 30);
    updateEnvironmentalEffects();
    logDiagnostic('Environmental fault injected - dust and moisture levels increased');
}

function clearAllFaults() {
    proximitySwitchData.faults = [];
    proximitySwitchData.sensorPosition = { x: 50, y: 50 };
    proximitySwitchData.detectionRange = 15;
    proximitySwitchData.environmentalFactors = { dust: 0, moisture: 0, vibration: 0 };
    
    // Reset sliders
    document.getElementById('dust-level').value = 0;
    document.getElementById('moisture-level').value = 0;
    document.getElementById('vibration-level').value = 0;
    
    updateProximitySwitchDisplay();
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

function startProximitySwitchSimulation() {
    logDiagnostic('Proximity switch simulation started');
    
    // Periodic updates
    setInterval(() => {
        if (proximitySwitchData.faults.length > 0) {
            // Simulate fault effects
            if (proximitySwitchData.faults.includes('environmental')) {
                const randomEffect = Math.random();
                if (randomEffect < 0.1) {
                    proximitySwitchData.isDetecting = !proximitySwitchData.isDetecting;
                    updateStatusDisplays(calculateDistance(proximitySwitchData.sensorPosition, proximitySwitchData.targetPosition));
                }
            }
        }
    }, 2000);
}

// Auto-initialize if function exists
if (typeof initializeProximitySwitchSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeProximitySwitchSimulation, 1000);
    });
} 