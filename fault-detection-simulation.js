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
        <div class="simulation-header" style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle"></i> Fault Detection & Troubleshooting
            </h3>
            <p style="color: #aaa; margin: 10px 0;">Interactive fault detection and systematic troubleshooting simulation</p>
            
            <div style="background: #23272b; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <h4 style="color: #4CAF50; margin-top: 0;">How to Use This Simulation:</h4>
                <ul style="color: #aaa; margin: 10px 0; padding-left: 20px; line-height: 1.4;">
                    <li><strong>System Overview:</strong> Monitor component health and status</li>
                    <li><strong>Diagnostic Tools:</strong> Use tools to identify and analyze faults</li>
                    <li><strong>Fault Injection:</strong> Practice with simulated faults</li>
                    <li><strong>Troubleshooting:</strong> Follow systematic steps to resolve issues</li>
                </ul>
            </div>
        </div>
        
        <div class="simulation-grid" style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">
            <div class="simulation-left">
                <!-- System Overview -->
                <div class="system-overview">
                    <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-microchip"></i> System Overview
                    </h4>
                    <div class="component-grid">
                        <div class="component-card">
                            <i class="fas fa-pump component-icon status-normal"></i>
                            <div class="component-name">Pump</div>
                            <div id="pump-status" class="component-status status-normal">Normal Operation</div>
                            <div class="health-bar">
                                <div id="pump-health" class="health-fill health-normal" style="width: 100%;"></div>
                            </div>
                        </div>
                        <div class="component-card">
                            <i class="fas fa-valve component-icon status-normal"></i>
                            <div class="component-name">Valve</div>
                            <div id="valve-status" class="component-status status-normal">Normal Operation</div>
                            <div class="health-bar">
                                <div id="valve-health" class="health-fill health-normal" style="width: 100%;"></div>
                            </div>
                        </div>
                        <div class="component-card">
                            <i class="fas fa-wave-square component-icon status-normal"></i>
                            <div class="component-name">Sensor</div>
                            <div id="sensor-status" class="component-status status-normal">Normal Operation</div>
                            <div class="health-bar">
                                <div id="sensor-health" class="health-fill health-normal" style="width: 100%;"></div>
                            </div>
                        </div>
                        <div class="component-card">
                            <i class="fas fa-microchip component-icon status-normal"></i>
                            <div class="component-name">Controller</div>
                            <div id="controller-status" class="component-status status-normal">Normal Operation</div>
                            <div class="health-bar">
                                <div id="controller-health" class="health-fill health-normal" style="width: 100%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Diagnostic Tools -->
                <div class="diagnostic-tools">
                    <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-tools"></i> Diagnostic Tools
                    </h4>
                    <div class="tool-grid">
                        <button id="start-diagnosis" class="diagnostic-btn">
                            <i class="fas fa-play"></i> Start Diagnosis
                        </button>
                        <button id="check-components" class="diagnostic-btn">
                            <i class="fas fa-search"></i> Check Components
                        </button>
                        <button id="analyze-signals" class="diagnostic-btn">
                            <i class="fas fa-chart-line"></i> Analyze Signals
                        </button>
                        <button id="review-logs" class="diagnostic-btn">
                            <i class="fas fa-clipboard-list"></i> Review Logs
                        </button>
                    </div>
                </div>
                
                <!-- Timer Section -->
                <div class="timer-section">
                    <h4 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-stopwatch"></i> Diagnosis Timer
                    </h4>
                    <div class="timer-display">
                        <span id="time-remaining">05:00</span>
                    </div>
                    <div class="score-display">
                        Score: <span id="current-score">0</span>
                    </div>
                </div>
            </div>
            
            <div class="simulation-right">
                <!-- Fault Injection -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #FF5722; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-triangle"></i> Fault Injection
                    </h4>
                    <div style="display: grid; gap: 10px;">
                        <button id="inject-random-fault" class="fault-btn">
                            <i class="fas fa-random"></i> Random Fault
                        </button>
                        <button id="inject-multiple-faults" class="fault-btn">
                            <i class="fas fa-layer-group"></i> Multiple Faults
                        </button>
                        <button id="clear-all-faults" style="background: #4CAF50; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <i class="fas fa-broom"></i> Clear All Faults
                        </button>
                    </div>
                </div>
                
                <!-- Active Faults -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #FF5722; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-circle"></i> Active Faults
                    </h4>
                    <div id="fault-list" class="fault-list">
                        <p>No active faults</p>
                    </div>
                </div>
                
                <!-- Troubleshooting Steps -->
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #4CAF50; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-tasks"></i> Troubleshooting Steps
                    </h4>
                    <div class="step-list">
                        <label class="step-item">
                            <input type="checkbox" id="step-identify">
                            <span>1. Identify fault symptoms</span>
                        </label>
                        <label class="step-item">
                            <input type="checkbox" id="step-isolate">
                            <span>2. Isolate affected components</span>
                        </label>
                        <label class="step-item">
                            <input type="checkbox" id="step-analyze">
                            <span>3. Analyze root cause</span>
                        </label>
                        <label class="step-item">
                            <input type="checkbox" id="step-resolve">
                            <span>4. Implement solution</span>
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
                <p>System initialized. Ready for fault detection training.</p>
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
    if (faultDetectionData.diagnosticMode) {
        logDiagnostic('Diagnosis is already in progress', 'warning');
        return;
    }
    
    faultDetectionData.diagnosticMode = true;
    faultDetectionData.timeRemaining = faultDetectionData.timeLimit;
    
    // Disable fault injection during diagnosis
    document.getElementById('inject-random-fault').disabled = true;
    document.getElementById('inject-multiple-faults').disabled = true;
    
    logDiagnostic(`Diagnosis mode started:
    • Time limit: ${Math.floor(faultDetectionData.timeLimit / 60)}:00
    • Active faults: ${faultDetectionData.activeFaults.length}
    • Current score: ${faultDetectionData.score}
    • System health: ${getSystemHealthSummary()}`, 'info');
    
    // Start timer countdown
    const timer = setInterval(() => {
        faultDetectionData.timeRemaining--;
        updateTimerDisplay();
        
        // Warning at 1 minute remaining
        if (faultDetectionData.timeRemaining === 60) {
            logDiagnostic('1 minute remaining in diagnosis mode', 'warning');
            document.getElementById('time-remaining').style.animation = 'timerWarning 1s infinite';
        }
        
        if (faultDetectionData.timeRemaining <= 0) {
            clearInterval(timer);
            endDiagnosis();
        }
    }, 1000);
}

function checkComponents() {
    const componentChecks = Object.entries(faultDetectionData.systemComponents).map(([id, component]) => {
        const healthStatus = component.health === 100 ? 'Optimal' :
                           component.health >= 70 ? 'Good' :
                           component.health >= 30 ? 'Degraded' :
                           'Critical';
        
        return {
            component: id,
            health: component.health,
            status: component.status,
            healthStatus
        };
    });
    
    const issues = componentChecks.filter(check => check.health < 100);
    const messageType = issues.length > 0 ? 'warning' : 'success';
    
    logDiagnostic(`Component check completed:
    ${componentChecks.map(check => 
        `• ${check.component}: ${check.healthStatus} (${check.health}%) - ${check.status}`
    ).join('\n    ')}`, messageType);
    
    // Flash health bars
    componentChecks.forEach(check => {
        const healthBar = document.getElementById(`${check.component}-health`);
        if (healthBar) {
            healthBar.style.animation = 'healthPulse 1s ease';
            setTimeout(() => healthBar.style.animation = '', 1000);
        }
    });
}

function analyzeSignals() {
    const signalComponents = ['sensor', 'controller'];
    const signalAnalysis = signalComponents.map(componentId => {
        const component = faultDetectionData.systemComponents[componentId];
        const activeFaults = faultDetectionData.activeFaults.filter(f => f.component === componentId);
        
        return {
            component: componentId,
            health: component.health,
            faults: activeFaults,
            status: component.status
        };
    });
    
    const hasIssues = signalAnalysis.some(analysis => analysis.faults.length > 0 || analysis.health < 100);
    const messageType = hasIssues ? 'warning' : 'success';
    
    logDiagnostic(`Signal analysis completed:
    ${signalAnalysis.map(analysis => `
    • ${analysis.component}:
      - Health: ${analysis.health}%
      - Status: ${analysis.status}
      - Active faults: ${analysis.faults.length > 0 ? 
          '\n        ' + analysis.faults.map(f => `${f.name} (${f.severity})`).join('\n        ') : 
          'None'}`
    ).join('\n')}`, messageType);
    
    // Flash signal components
    signalComponents.forEach(componentId => {
        const card = document.querySelector(`.component-card:has(.component-name:contains('${componentId}'))`);
        if (card) {
            card.style.animation = 'statusUpdate 1s ease';
            setTimeout(() => card.style.animation = '', 1000);
        }
    });
}

function reviewLogs() {
    const recentFaults = faultDetectionData.faultHistory.slice(-5);
    const activeFaults = faultDetectionData.activeFaults;
    const resolvedFaults = faultDetectionData.faultHistory.filter(
        fault => !activeFaults.find(f => f.id === fault.id)
    );
    
    logDiagnostic(`System log review completed:
    • Total faults recorded: ${faultDetectionData.faultHistory.length}
    • Active faults: ${activeFaults.length}
    • Resolved faults: ${resolvedFaults.length}
    
    Recent fault history:
    ${recentFaults.map((fault, index) => 
        `${index + 1}. ${fault.name} (${fault.severity}) - ${fault.component}
        ${activeFaults.find(f => f.id === fault.id) ? '   [ACTIVE]' : '   [RESOLVED]'}`
    ).join('\n    ')}`, 'info');
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
        logDiagnostic(`Cannot inject fault: ${faultType.name} is already active`, 'warning');
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
    const healthReduction = fault.severity === 'critical' ? 50 : fault.severity === 'high' ? 30 : 20;
    const oldHealth = component.health;
    component.health = Math.max(0, oldHealth - healthReduction);
    
    // Determine component status based on health
    if (component.health === 0) {
        component.status = 'critical';
    } else if (component.health < 30) {
        component.status = 'fault';
    } else if (component.health < 70) {
        component.status = 'warning';
    } else {
        component.status = 'normal';
    }
    
    // Update display
    updateFaultDetectionDisplay();
    
    // Log detailed fault information
    logDiagnostic(`Fault injected:
    • Type: ${faultType.name}
    • Component: ${faultType.component}
    • Severity: ${faultType.severity}
    • Health impact: -${healthReduction}% (${oldHealth}% → ${component.health}%)
    • Status: ${component.status}`, 'error');
    
    // Flash affected component
    const componentCard = document.querySelector(`.component-card:has(.component-name:contains('${faultType.component}'))`);
    if (componentCard) {
        componentCard.style.animation = 'faultHighlight 1s ease';
        setTimeout(() => componentCard.style.animation = '', 1000);
    }
}

function clearAllFaults() {
    const faultCount = faultDetectionData.activeFaults.length;
    const componentStates = {};
    
    // Record current states
    Object.keys(faultDetectionData.systemComponents).forEach(componentId => {
        const component = faultDetectionData.systemComponents[componentId];
        componentStates[componentId] = {
            oldStatus: component.status,
            oldHealth: component.health
        };
    });
    
    // Reset all components
    faultDetectionData.activeFaults = [];
    Object.keys(faultDetectionData.systemComponents).forEach(componentId => {
        faultDetectionData.systemComponents[componentId].status = 'normal';
        faultDetectionData.systemComponents[componentId].health = 100;
    });
    
    // Update display
    updateFaultDetectionDisplay();
    
    // Log detailed restoration information
    logDiagnostic(`System restored to normal operation:
    • Faults cleared: ${faultCount}
    • Component restorations:
      ${Object.entries(componentStates).map(([id, state]) => 
        `- ${id}: ${state.oldStatus} (${state.oldHealth}%) → normal (100%)`
      ).join('\n      ')}`, 'success');
    
    // Flash all components
    document.querySelectorAll('.component-card').forEach(card => {
        card.style.animation = 'statusUpdate 1s ease';
        setTimeout(() => card.style.animation = '', 1000);
    });
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
    const resolvedFaults = faultDetectionData.faultHistory.length - faultsRemaining;
    
    // Re-enable fault injection
    document.getElementById('inject-random-fault').disabled = false;
    document.getElementById('inject-multiple-faults').disabled = false;
    
    // Clear timer warning animation
    document.getElementById('time-remaining').style.animation = '';
    
    const messageType = faultsRemaining === 0 ? 'success' : 'warning';
    logDiagnostic(`Diagnosis session completed:
    • Final score: ${finalScore}
    • Time elapsed: ${Math.floor((faultDetectionData.timeLimit - faultDetectionData.timeRemaining) / 60)}:${((faultDetectionData.timeLimit - faultDetectionData.timeRemaining) % 60).toString().padStart(2, '0')}
    • Faults resolved: ${resolvedFaults}
    • Faults remaining: ${faultsRemaining}
    • System health: ${getSystemHealthSummary()}
    
    ${faultsRemaining === 0 ? 
        'Excellent work! All faults were successfully identified and resolved.' : 
        `Remaining faults:\n    ${faultDetectionData.activeFaults.map(f => 
            `• ${f.name} (${f.severity}) - ${f.component}`
        ).join('\n    ')}`}`, messageType);
}

function getSystemHealthSummary() {
    const components = Object.entries(faultDetectionData.systemComponents);
    const avgHealth = components.reduce((sum, [_, comp]) => sum + comp.health, 0) / components.length;
    
    return avgHealth === 100 ? 'Optimal' :
           avgHealth >= 70 ? 'Good' :
           avgHealth >= 30 ? 'Degraded' :
           'Critical';
}

function logDiagnostic(message, type = 'info') {
    const log = document.getElementById('diagnostic-log');
    if (log) {
        const timestamp = new Date().toLocaleTimeString();
        
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
        
        const logEntry = document.createElement('p');
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

function startFaultDetectionSimulation() {
    logDiagnostic('Fault detection simulation initialized and ready for training', 'success');
}

// Auto-initialize if function exists
if (typeof initializeFaultDetectionSimulation === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeFaultDetectionSimulation, 1000);
    });
} 