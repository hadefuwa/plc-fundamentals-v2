// Fault Detection Simulation
// Worksheet 14 - Fault Detection & Troubleshooting

let faultDetectionData = {
    activeFaults: [],
    systemComponents: {
        pump: { status: 'normal', health: 100 },
        valve: { status: 'normal', health: 100 },
        sensor: { status: 'normal', health: 100 },
        controller: { status: 'normal', health: 100 }
    },
    diagnosticMode: false,
    timeLimit: 300, // 5 minutes
    timeRemaining: 300,
    score: 0,
    faultHistory: []
};

const faultTypes = [
    { id: 'pump_failure', name: 'Pump Failure', component: 'pump', severity: 'critical' },
    { id: 'valve_stuck', name: 'Valve Stuck', component: 'valve', severity: 'high' },
    { id: 'sensor_drift', name: 'Sensor Drift', component: 'sensor', severity: 'medium' },
    { id: 'controller_fault', name: 'Controller Fault', component: 'controller', severity: 'high' },
    { id: 'wiring_fault', name: 'Wiring Fault', component: 'sensor', severity: 'medium' },
    { id: 'communication_fault', name: 'Communication Fault', component: 'controller', severity: 'high' }
];

function initializeFaultDetectionSimulation() {
    console.log('Initializing Fault Detection Simulation');
    
    const panel = document.getElementById('fault-detection-panel');
    if (!panel) {
        console.error('Fault detection panel not found');
        return;
    }
    
    panel.innerHTML = `
        <div class="simulation-header">
            <h3><i class="fas fa-exclamation-triangle"></i> Fault Detection & Troubleshooting</h3>
            <p>Interactive fault detection and systematic troubleshooting simulation</p>
        </div>
        
        <div class="simulation-grid">
            <div class="simulation-left">
                <div class="system-overview">
                    <h4>System Overview</h4>
                    <div id="system-status" class="system-status">
                        <div class="component-item">
                            <span class="component-label">Pump:</span>
                            <div id="pump-status" class="component-indicator normal"></div>
                        </div>
                        <div class="component-item">
                            <span class="component-label">Valve:</span>
                            <div id="valve-status" class="component-indicator normal"></div>
                        </div>
                        <div class="component-item">
                            <span class="component-label">Sensor:</span>
                            <div id="sensor-status" class="component-indicator normal"></div>
                        </div>
                        <div class="component-item">
                            <span class="component-label">Controller:</span>
                            <div id="controller-status" class="component-indicator normal"></div>
                        </div>
                    </div>
                </div>
                
                <div class="diagnostic-tools">
                    <h4>Diagnostic Tools</h4>
                    <div class="tool-buttons">
                        <button id="start-diagnosis" class="diagnostic-btn">Start Diagnosis</button>
                        <button id="check-components" class="diagnostic-btn">Check Components</button>
                        <button id="analyze-signals" class="diagnostic-btn">Analyze Signals</button>
                        <button id="review-logs" class="diagnostic-btn">Review Logs</button>
                    </div>
                </div>
                
                <div class="timer-section">
                    <h4>Diagnosis Timer</h4>
                    <div class="timer-display">
                        <span id="time-remaining">05:00</span>
                    </div>
                    <div class="score-display">
                        Score: <span id="current-score">0</span>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <div class="fault-injection">
                    <h4>Fault Injection</h4>
                    <div class="fault-buttons">
                        <button id="inject-random-fault" class="fault-btn">Inject Random Fault</button>
                        <button id="inject-multiple-faults" class="fault-btn">Inject Multiple Faults</button>
                        <button id="clear-all-faults" class="fault-btn" style="background: #4CAF50;">Clear All Faults</button>
                    </div>
                </div>
                
                <div class="active-faults">
                    <h4>Active Faults</h4>
                    <div id="fault-list" class="fault-list">
                        <p>No active faults</p>
                    </div>
                </div>
                
                <div class="troubleshooting-steps">
                    <h4>Troubleshooting Steps</h4>
                    <div class="step-list">
                        <div class="step-item">
                            <input type="checkbox" id="step-identify">
                            <label for="step-identify">Identify fault symptoms</label>
                        </div>
                        <div class="step-item">
                            <input type="checkbox" id="step-isolate">
                            <label for="step-isolate">Isolate affected components</label>
                        </div>
                        <div class="step-item">
                            <input type="checkbox" id="step-analyze">
                            <label for="step-analyze">Analyze root cause</label>
                        </div>
                        <div class="step-item">
                            <input type="checkbox" id="step-resolve">
                            <label for="step-resolve">Implement solution</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="simulation-footer">
            <div class="diagnostic-info">
                <h4>Diagnostic Information</h4>
                <div id="diagnostic-log" class="diagnostic-log">
                    <p>System initialized. Ready for fault detection training.</p>
                </div>
            </div>
        </div>
    `;
    
    initializeFaultDetectionControls();
    updateFaultDetectionDisplay();
    startFaultDetectionSimulation();
}

function initializeFaultDetectionControls() {
    // Diagnostic buttons
    document.getElementById('start-diagnosis').addEventListener('click', startDiagnosis);
    document.getElementById('check-components').addEventListener('click', checkComponents);
    document.getElementById('analyze-signals').addEventListener('click', analyzeSignals);
    document.getElementById('review-logs').addEventListener('click', reviewLogs);
    
    // Fault injection buttons
    document.getElementById('inject-random-fault').addEventListener('click', injectRandomFault);
    document.getElementById('inject-multiple-faults').addEventListener('click', injectMultipleFaults);
    document.getElementById('clear-all-faults').addEventListener('click', clearAllFaults);
    
    // Troubleshooting step checkboxes
    document.querySelectorAll('.step-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateTroubleshootingProgress);
    });
}

function updateFaultDetectionDisplay() {
    // Update component status indicators
    Object.keys(faultDetectionData.systemComponents).forEach(componentId => {
        const component = faultDetectionData.systemComponents[componentId];
        const indicator = document.getElementById(componentId + '-status');
        
        if (indicator) {
            indicator.className = 'component-indicator ' + component.status;
            indicator.title = componentId + ': ' + component.status + ' (Health: ' + component.health + '%)';
        }
    });
    
    // Update fault list
    updateFaultList();
    
    // Update timer and score
    updateTimerDisplay();
}

function updateFaultList() {
    const faultList = document.getElementById('fault-list');
    if (faultDetectionData.activeFaults.length === 0) {
        faultList.innerHTML = '<p>No active faults</p>';
    } else {
        faultList.innerHTML = faultDetectionData.activeFaults.map(fault => 
            `<div class="fault-item ${fault.severity}">
                <span class="fault-name">${fault.name}</span>
                <span class="fault-component">(${fault.component})</span>
                <span class="fault-severity">${fault.severity}</span>
            </div>`
        ).join('');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(faultDetectionData.timeRemaining / 60);
    const seconds = faultDetectionData.timeRemaining % 60;
    document.getElementById('time-remaining').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('current-score').textContent = faultDetectionData.score;
}

function startDiagnosis() {
    faultDetectionData.diagnosticMode = true;
    faultDetectionData.timeRemaining = faultDetectionData.timeLimit;
    logDiagnostic('Diagnosis mode started - timer running');
    
    // Start timer countdown
    const timer = setInterval(() => {
        faultDetectionData.timeRemaining--;
        updateTimerDisplay();
        
        if (faultDetectionData.timeRemaining <= 0) {
            clearInterval(timer);
            endDiagnosis();
        }
    }, 1000);
}

function checkComponents() {
    const issues = [];
    Object.keys(faultDetectionData.systemComponents).forEach(componentId => {
        const component = faultDetectionData.systemComponents[componentId];
        if (component.health < 100) {
            issues.push(componentId + ' health: ' + component.health + '%');
        }
    });
    
    if (issues.length > 0) {
        logDiagnostic('Component check completed - Issues found: ' + issues.join(', '));
    } else {
        logDiagnostic('Component check completed - All components healthy');
    }
}

function analyzeSignals() {
    const signalIssues = faultDetectionData.activeFaults.filter(fault => 
        fault.component === 'sensor' || fault.component === 'controller'
    );
    
    if (signalIssues.length > 0) {
        logDiagnostic('Signal analysis completed - ' + signalIssues.length + ' signal-related faults detected');
    } else {
        logDiagnostic('Signal analysis completed - No signal issues detected');
    }
}

function reviewLogs() {
    const recentFaults = faultDetectionData.faultHistory.slice(-5);
    if (recentFaults.length > 0) {
        logDiagnostic('Log review completed - ' + recentFaults.length + ' recent fault entries found');
    } else {
        logDiagnostic('Log review completed - No recent fault entries');
    }
}

function injectRandomFault() {
    const randomFault = faultTypes[Math.floor(Math.random() * faultTypes.length)];
    injectFault(randomFault);
}

function injectMultipleFaults() {
    const numFaults = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numFaults; i++) {
        const randomFault = faultTypes[Math.floor(Math.random() * faultTypes.length)];
        injectFault(randomFault);
    }
}

function injectFault(faultType) {
    // Check if fault already exists
    if (faultDetectionData.activeFaults.find(f => f.id === faultType.id)) {
        return;
    }
    
    const fault = {
        id: faultType.id,
        name: faultType.name,
        component: faultType.component,
        severity: faultType.severity,
        timestamp: new Date()
    };
    
    faultDetectionData.activeFaults.push(fault);
    faultDetectionData.faultHistory.push(fault);
    
    // Update component status
    const component = faultDetectionData.systemComponents[faultType.component];
    component.status = 'fault';
    component.health = Math.max(0, component.health - 30);
    
    updateFaultDetectionDisplay();
    logDiagnostic('Fault injected: ' + faultType.name + ' on ' + faultType.component);
}

function clearAllFaults() {
    faultDetectionData.activeFaults = [];
    Object.keys(faultDetectionData.systemComponents).forEach(componentId => {
        faultDetectionData.systemComponents[componentId].status = 'normal';
        faultDetectionData.systemComponents[componentId].health = 100;
    });
    updateFaultDetectionDisplay();
    logDiagnostic('All faults cleared - system restored to normal operation');
}

function updateTroubleshootingProgress() {
    const completedSteps = document.querySelectorAll('.step-item input[type="checkbox"]:checked').length;
    const totalSteps = 4;
    
    if (completedSteps === totalSteps) {
        faultDetectionData.score += 100;
        logDiagnostic('Troubleshooting completed - Score increased by 100 points');
    } else {
        logDiagnostic('Troubleshooting progress: ' + completedSteps + '/' + totalSteps + ' steps completed');
    }
    
    updateTimerDisplay();
}

function endDiagnosis() {
    faultDetectionData.diagnosticMode = false;
    const finalScore = faultDetectionData.score;
    const faultsRemaining = faultDetectionData.activeFaults.length;
    
    logDiagnostic('Diagnosis time expired - Final score: ' + finalScore + ', Faults remaining: ' + faultsRemaining);
    
    if (faultsRemaining === 0) {
        logDiagnostic('Excellent work! All faults were successfully identified and resolved.');
    } else {
        logDiagnostic('Training complete. ' + faultsRemaining + ' faults remain unresolved.');
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

function startFaultDetectionSimulation() {
    logDiagnostic('Fault detection simulation started');
}

// Auto-initialize if function exists
if (typeof initializeFaultDetectionSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeFaultDetectionSimulation, 1000);
    });
} 