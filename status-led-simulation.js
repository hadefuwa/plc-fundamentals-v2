// Status LED Simulation System
// Industrial Maintenance Training - Worksheet 3

// Status LED System State
let statusLEDData = {
  // LED States: 'off', 'green', 'yellow', 'red', 'flashing-red', 'flashing-yellow'
  currentState: 'green',
  previousState: 'green',
  stateHistory: [],
  
  // System Conditions
  systemHealth: 'normal',
  faultLevel: 0, // 0-100
  maintenanceDue: 0, // days
  
  // Fault Conditions
  activeFaults: [],
  faultEscalation: false,
  
  // Shift Information
  currentShift: 'day',
  shiftHandover: false,
  handoverNotes: '',
  
  // Performance Tracking
  diagnosticTime: 0,
  correctDiagnoses: 0,
  totalDiagnoses: 0,
  
  // Simulation Control
  autoMode: false,
  simulationInterval: null,
  faultInjectionInterval: null
};

// LED State Definitions
const LED_STATES = {
  'off': { color: '#333', description: 'System Off', meaning: 'No power or system shutdown' },
  'green': { color: '#4CAF50', description: 'Normal Operation', meaning: 'All systems operating normally' },
  'yellow': { color: '#FF9800', description: 'Warning', meaning: 'Minor fault detected, attention required' },
  'red': { color: '#F44336', description: 'Fault', meaning: 'Critical fault, immediate action required' },
  'flashing-yellow': { color: '#FF9800', description: 'Warning - Flashing', meaning: 'Warning condition escalating' },
  'flashing-red': { color: '#F44336', description: 'Fault - Flashing', meaning: 'Critical fault, system shutdown imminent' }
};

// Fault Definitions
const FAULT_TYPES = {
  'sensor_drift': { name: 'Sensor Drift', severity: 'warning', escalation: 30 },
  'valve_stuck': { name: 'Valve Stuck', severity: 'fault', escalation: 60 },
  'pump_failure': { name: 'Pump Failure', severity: 'critical', escalation: 90 },
  'communication_loss': { name: 'Communication Loss', severity: 'warning', escalation: 45 },
  'temperature_high': { name: 'High Temperature', severity: 'fault', escalation: 75 },
  'pressure_low': { name: 'Low Pressure', severity: 'warning', escalation: 40 },
  'flow_irregular': { name: 'Irregular Flow', severity: 'fault', escalation: 70 }
};

// Initialize Status LED Simulation
function initializeStatusLEDSimulation() {
  console.log('Initializing Status LED simulation...');
  
  // Initialize LED display
  initializeLEDDisplay();
  
  // Initialize control panel
  initializeLEDControls();
  
  // Initialize fault injection
  initializeFaultInjection();
  
  // Initialize shift handover
  initializeShiftHandover();
  
  // Initialize diagnostic challenges
  initializeDiagnosticChallenges();
  
  // Start monitoring
  startLEDMonitoring();
  
  console.log('Status LED simulation initialized');
}

// Initialize LED Display
function initializeLEDDisplay() {
  const ledContainer = document.getElementById('led-display-panel');
  if (!ledContainer) return;
  
  ledContainer.innerHTML = `
    <div class="led-display" style="text-align: center; margin: 20px 0;">
      <div class="led-indicator" id="status-led" style="width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; border: 4px solid #555; box-shadow: 0 0 20px rgba(0,0,0,0.5); transition: all 0.3s ease;"></div>
      <div class="led-status" id="led-status-text" style="font-size: 18px; font-weight: bold; margin-bottom: 10px;"></div>
      <div class="led-meaning" id="led-meaning-text" style="font-size: 14px; color: #AAA;"></div>
    </div>
    
    <div class="system-status" style="background: #333; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h4 style="color: #FFFFFF; margin-bottom: 15px;">System Status</h4>
      <div class="status-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div class="status-item">
          <span style="color: #AAA;">System Health:</span>
          <span id="system-health" style="color: #4CAF50; font-weight: bold;">Normal</span>
        </div>
        <div class="status-item">
          <span style="color: #AAA;">Fault Level:</span>
          <span id="fault-level" style="color: #FF9800; font-weight: bold;">0%</span>
        </div>
        <div class="status-item">
          <span style="color: #AAA;">Maintenance Due:</span>
          <span id="maintenance-due" style="color: #2196F3; font-weight: bold;">30 days</span>
        </div>
        <div class="status-item">
          <span style="color: #AAA;">Active Faults:</span>
          <span id="active-faults" style="color: #F44336; font-weight: bold;">0</span>
        </div>
      </div>
    </div>
  `;
  
  updateLEDDisplay();
}

// Initialize LED Controls
function initializeLEDControls() {
  const controlContainer = document.getElementById('led-control-panel');
  if (!controlContainer) return;
  
  controlContainer.innerHTML = `
    <div class="led-controls" style="margin: 20px 0;">
      <h4 style="color: #FFFFFF; margin-bottom: 15px;">Manual LED Control</h4>
      <div class="control-buttons" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px;">
        <button class="led-btn" data-state="off" style="background: #333; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">OFF</button>
        <button class="led-btn" data-state="green" style="background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">GREEN</button>
        <button class="led-btn" data-state="yellow" style="background: #FF9800; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">YELLOW</button>
        <button class="led-btn" data-state="red" style="background: #F44336; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">RED</button>
        <button class="led-btn" data-state="flashing-yellow" style="background: #FF9800; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">FLASH YELLOW</button>
        <button class="led-btn" data-state="flashing-red" style="background: #F44336; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">FLASH RED</button>
      </div>
      
      <div class="auto-controls" style="margin-top: 20px;">
        <label style="display: flex; align-items: center; gap: 10px; color: #FFFFFF; margin-bottom: 10px;">
          <input type="checkbox" id="auto-mode" style="accent-color: #4CAF50;">
          <span>Auto Mode (Random Fault Injection)</span>
        </label>
        <div class="auto-settings" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 10px;">
          <div>
            <label style="color: #AAA; font-size: 12px;">Fault Frequency (seconds)</label>
            <input type="range" id="fault-frequency" min="5" max="60" value="30" style="width: 100%;">
            <span id="fault-frequency-value" style="color: #FFFFFF;">30s</span>
          </div>
          <div>
            <label style="color: #AAA; font-size: 12px;">Fault Severity</label>
            <select id="fault-severity" style="width: 100%; padding: 5px; background: #333; color: #FFFFFF; border: 1px solid #555;">
              <option value="low">Low (Warnings)</option>
              <option value="medium" selected>Medium (Mixed)</option>
              <option value="high">High (Critical)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('.led-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const state = this.getAttribute('data-state');
      setLEDState(state);
    });
  });
  
  document.getElementById('auto-mode').addEventListener('change', function() {
    statusLEDData.autoMode = this.checked;
    if (this.checked) {
      startAutoFaultInjection();
    } else {
      stopAutoFaultInjection();
    }
  });
  
  document.getElementById('fault-frequency').addEventListener('input', function() {
    const value = this.value;
    document.getElementById('fault-frequency-value').textContent = value + 's';
    if (statusLEDData.autoMode) {
      stopAutoFaultInjection();
      startAutoFaultInjection();
    }
  });
}

// Initialize Fault Injection
function initializeFaultInjection() {
  const faultContainer = document.getElementById('fault-injection-panel');
  if (!faultContainer) return;
  
  faultContainer.innerHTML = `
    <div class="fault-injection" style="margin: 20px 0;">
      <h4 style="color: #FFFFFF; margin-bottom: 15px;">Fault Injection</h4>
      <div class="fault-buttons" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;">
        <button class="fault-btn" data-fault="sensor_drift" style="background: #FF9800; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Sensor Drift</button>
        <button class="fault-btn" data-fault="valve_stuck" style="background: #F44336; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Valve Stuck</button>
        <button class="fault-btn" data-fault="pump_failure" style="background: #F44336; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Pump Failure</button>
        <button class="fault-btn" data-fault="communication_loss" style="background: #FF9800; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Comm Loss</button>
        <button class="fault-btn" data-fault="temperature_high" style="background: #F44336; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">High Temp</button>
        <button class="fault-btn" data-fault="pressure_low" style="background: #FF9800; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Low Pressure</button>
        <button class="fault-btn" data-fault="flow_irregular" style="background: #F44336; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer;">Irregular Flow</button>
      </div>
      
      <div class="fault-actions" style="margin-top: 20px;">
        <button id="clear-faults" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Clear All Faults</button>
        <button id="escalate-faults" style="background: #FF9800; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Escalate Faults</button>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('.fault-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const faultType = this.getAttribute('data-fault');
      injectFault(faultType);
    });
  });
  
  document.getElementById('clear-faults').addEventListener('click', clearAllFaults);
  document.getElementById('escalate-faults').addEventListener('click', escalateFaults);
}

// Initialize Shift Handover
function initializeShiftHandover() {
  const handoverContainer = document.getElementById('shift-handover-panel');
  if (!handoverContainer) return;
  
  handoverContainer.innerHTML = `
    <div class="shift-handover" style="margin: 20px 0;">
      <h4 style="color: #FFFFFF; margin-bottom: 15px;">Shift Handover Training</h4>
      
      <div class="shift-info" style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <span style="color: #AAA;">Current Shift:</span>
            <span id="current-shift" style="color: #2196F3; font-weight: bold;">Day Shift</span>
          </div>
          <div>
            <span style="color: #AAA;">Time:</span>
            <span id="shift-time" style="color: #FFFFFF;">08:00</span>
          </div>
          <div>
            <span style="color: #AAA;">Handover Status:</span>
            <span id="handover-status" style="color: #4CAF50; font-weight: bold;">Complete</span>
          </div>
        </div>
      </div>
      
      <div class="handover-actions" style="margin-bottom: 20px;">
        <button id="start-handover" style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Start Handover</button>
        <button id="change-shift" style="background: #9C27B0; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Change Shift</button>
      </div>
      
      <div class="handover-notes" style="margin-top: 20px;">
        <label style="color: #FFFFFF; display: block; margin-bottom: 10px;">Handover Notes:</label>
        <textarea id="handover-notes" placeholder="Enter handover notes here..." style="width: 100%; height: 100px; padding: 10px; background: #333; color: #FFFFFF; border: 1px solid #555; border-radius: 4px; resize: vertical;"></textarea>
        <button id="save-notes" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Save Notes</button>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('start-handover').addEventListener('click', startHandover);
  document.getElementById('change-shift').addEventListener('click', changeShift);
  document.getElementById('save-notes').addEventListener('click', saveHandoverNotes);
  
  updateShiftDisplay();
}

// Initialize Diagnostic Challenges
function initializeDiagnosticChallenges() {
  const challengeContainer = document.getElementById('diagnostic-challenges-panel');
  if (!challengeContainer) return;
  
  challengeContainer.innerHTML = `
    <div class="diagnostic-challenges" style="margin: 20px 0;">
      <h4 style="color: #FFFFFF; margin-bottom: 15px;">Diagnostic Challenges</h4>
      
      <div class="challenge-info" style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <span style="color: #AAA;">Diagnostic Time:</span>
            <span id="diagnostic-time" style="color: #FF9800; font-weight: bold;">0:00</span>
          </div>
          <div>
            <span style="color: #AAA;">Accuracy:</span>
            <span id="diagnostic-accuracy" style="color: #4CAF50; font-weight: bold;">0%</span>
          </div>
          <div>
            <span style="color: #AAA;">Challenges Completed:</span>
            <span id="challenges-completed" style="color: #2196F3; font-weight: bold;">0</span>
          </div>
        </div>
      </div>
      
      <div class="challenge-actions" style="margin-bottom: 20px;">
        <button id="start-challenge" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Start Challenge</button>
        <button id="reset-challenge" style="background: #FF9800; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Reset Challenge</button>
      </div>
      
      <div class="challenge-instructions" style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h5 style="color: #FFFFFF; margin-bottom: 10px;">Challenge Instructions:</h5>
        <ol style="color: #AAA; margin: 0; padding-left: 20px;">
          <li>Click "Start Challenge" to begin a timed diagnostic session</li>
          <li>Observe the LED state and system conditions</li>
          <li>Identify the root cause of the fault</li>
          <li>Document your findings in the handover notes</li>
          <li>Complete the diagnostic within the time limit</li>
        </ol>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('start-challenge').addEventListener('click', startDiagnosticChallenge);
  document.getElementById('reset-challenge').addEventListener('click', resetDiagnosticChallenge);
  
  updateDiagnosticDisplay();
}

// Set LED State
function setLEDState(state) {
  if (!LED_STATES[state]) return;
  
  statusLEDData.previousState = statusLEDData.currentState;
  statusLEDData.currentState = state;
  
  // Add to history
  statusLEDData.stateHistory.push({
    state: state,
    timestamp: new Date(),
    systemHealth: statusLEDData.systemHealth,
    faultLevel: statusLEDData.faultLevel
  });
  
  // Keep only last 50 entries
  if (statusLEDData.stateHistory.length > 50) {
    statusLEDData.stateHistory.shift();
  }
  
  updateLEDDisplay();
  updateSystemStatus();
}

// Update LED Display
function updateLEDDisplay() {
  const led = document.getElementById('status-led');
  const statusText = document.getElementById('led-status-text');
  const meaningText = document.getElementById('led-meaning-text');
  
  if (!led || !statusText || !meaningText) return;
  
  const state = LED_STATES[statusLEDData.currentState];
  
  // Set LED color and animation
  led.style.backgroundColor = state.color;
  
  if (statusLEDData.currentState.includes('flashing')) {
    led.style.animation = 'flash 1s infinite';
  } else {
    led.style.animation = 'none';
  }
  
  statusText.textContent = state.description;
  statusText.style.color = state.color;
  meaningText.textContent = state.meaning;
}

// Update System Status
function updateSystemStatus() {
  const systemHealth = document.getElementById('system-health');
  const faultLevel = document.getElementById('fault-level');
  const maintenanceDue = document.getElementById('maintenance-due');
  const activeFaults = document.getElementById('active-faults');
  
  if (!systemHealth || !faultLevel || !maintenanceDue || !activeFaults) return;
  
  systemHealth.textContent = statusLEDData.systemHealth;
  systemHealth.style.color = getHealthColor(statusLEDData.systemHealth);
  
  faultLevel.textContent = statusLEDData.faultLevel + '%';
  faultLevel.style.color = getFaultColor(statusLEDData.faultLevel);
  
  maintenanceDue.textContent = statusLEDData.maintenanceDue + ' days';
  maintenanceDue.style.color = statusLEDData.maintenanceDue > 20 ? '#4CAF50' : 
                              statusLEDData.maintenanceDue > 10 ? '#FF9800' : '#F44336';
  
  activeFaults.textContent = statusLEDData.activeFaults.length;
  activeFaults.style.color = statusLEDData.activeFaults.length === 0 ? '#4CAF50' : '#F44336';
}

// Inject Fault
function injectFault(faultType) {
  if (!FAULT_TYPES[faultType]) return;
  
  const fault = FAULT_TYPES[faultType];
  
  // Check if fault already exists
  if (statusLEDData.activeFaults.find(f => f.type === faultType)) {
    console.log('Fault already active:', faultType);
    return;
  }
  
  // Add fault
  statusLEDData.activeFaults.push({
    type: faultType,
    name: fault.name,
    severity: fault.severity,
    timestamp: new Date(),
    escalation: fault.escalation
  });
  
  // Update fault level
  updateFaultLevel();
  
  // Update LED state based on fault severity
  updateLEDStateFromFaults();
  
  console.log('Fault injected:', faultType);
}

// Update Fault Level
function updateFaultLevel() {
  let totalSeverity = 0;
  
  statusLEDData.activeFaults.forEach(fault => {
    switch (fault.severity) {
      case 'warning':
        totalSeverity += 20;
        break;
      case 'fault':
        totalSeverity += 50;
        break;
      case 'critical':
        totalSeverity += 80;
        break;
    }
  });
  
  statusLEDData.faultLevel = Math.min(100, totalSeverity);
  
  // Update system health
  if (statusLEDData.faultLevel === 0) {
    statusLEDData.systemHealth = 'normal';
  } else if (statusLEDData.faultLevel < 30) {
    statusLEDData.systemHealth = 'warning';
  } else if (statusLEDData.faultLevel < 70) {
    statusLEDData.systemHealth = 'fault';
  } else {
    statusLEDData.systemHealth = 'critical';
  }
}

// Update LED State from Faults
function updateLEDStateFromFaults() {
  if (statusLEDData.activeFaults.length === 0) {
    setLEDState('green');
    return;
  }
  
  const hasCritical = statusLEDData.activeFaults.some(f => f.severity === 'critical');
  const hasFault = statusLEDData.activeFaults.some(f => f.severity === 'fault');
  const hasWarning = statusLEDData.activeFaults.some(f => f.severity === 'warning');
  
  if (hasCritical) {
    setLEDState(statusLEDData.faultEscalation ? 'flashing-red' : 'red');
  } else if (hasFault) {
    setLEDState(statusLEDData.faultEscalation ? 'flashing-yellow' : 'red');
  } else if (hasWarning) {
    setLEDState(statusLEDData.faultEscalation ? 'flashing-yellow' : 'yellow');
  }
}

// Clear All Faults
function clearAllFaults() {
  statusLEDData.activeFaults = [];
  statusLEDData.faultLevel = 0;
  statusLEDData.systemHealth = 'normal';
  statusLEDData.faultEscalation = false;
  
  setLEDState('green');
  console.log('All faults cleared');
}

// Escalate Faults
function escalateFaults() {
  statusLEDData.faultEscalation = !statusLEDData.faultEscalation;
  updateLEDStateFromFaults();
  console.log('Fault escalation:', statusLEDData.faultEscalation ? 'ON' : 'OFF');
}

// Start Auto Fault Injection
function startAutoFaultInjection() {
  if (statusLEDData.faultInjectionInterval) {
    clearInterval(statusLEDData.faultInjectionInterval);
  }
  
  const frequency = parseInt(document.getElementById('fault-frequency').value) * 1000;
  const severity = document.getElementById('fault-severity').value;
  
  statusLEDData.faultInjectionInterval = setInterval(() => {
    const faultTypes = Object.keys(FAULT_TYPES);
    const randomFault = faultTypes[Math.floor(Math.random() * faultTypes.length)];
    
    // Filter by severity if needed
    if (severity !== 'medium') {
      const filteredFaults = faultTypes.filter(f => {
        const fault = FAULT_TYPES[f];
        if (severity === 'low') return fault.severity === 'warning';
        if (severity === 'high') return fault.severity === 'critical';
        return true;
      });
      
      if (filteredFaults.length > 0) {
        const randomFault = filteredFaults[Math.floor(Math.random() * filteredFaults.length)];
        injectFault(randomFault);
      }
    } else {
      injectFault(randomFault);
    }
  }, frequency);
  
  console.log('Auto fault injection started');
}

// Stop Auto Fault Injection
function stopAutoFaultInjection() {
  if (statusLEDData.faultInjectionInterval) {
    clearInterval(statusLEDData.faultInjectionInterval);
    statusLEDData.faultInjectionInterval = null;
  }
  console.log('Auto fault injection stopped');
}

// Start Handover
function startHandover() {
  statusLEDData.shiftHandover = true;
  document.getElementById('handover-status').textContent = 'In Progress';
  document.getElementById('handover-status').style.color = '#FF9800';
  console.log('Shift handover started');
}

// Change Shift
function changeShift() {
  statusLEDData.currentShift = statusLEDData.currentShift === 'day' ? 'night' : 'day';
  statusLEDData.shiftHandover = false;
  updateShiftDisplay();
  console.log('Shift changed to:', statusLEDData.currentShift);
}

// Save Handover Notes
function saveHandoverNotes() {
  const notes = document.getElementById('handover-notes').value;
  statusLEDData.handoverNotes = notes;
  console.log('Handover notes saved:', notes);
}

// Update Shift Display
function updateShiftDisplay() {
  const currentShift = document.getElementById('current-shift');
  const shiftTime = document.getElementById('shift-time');
  const handoverStatus = document.getElementById('handover-status');
  
  if (!currentShift || !shiftTime || !handoverStatus) return;
  
  currentShift.textContent = statusLEDData.currentShift === 'day' ? 'Day Shift' : 'Night Shift';
  shiftTime.textContent = statusLEDData.currentShift === 'day' ? '08:00' : '20:00';
  handoverStatus.textContent = statusLEDData.shiftHandover ? 'In Progress' : 'Complete';
  handoverStatus.style.color = statusLEDData.shiftHandover ? '#FF9800' : '#4CAF50';
}

// Start Diagnostic Challenge
function startDiagnosticChallenge() {
  statusLEDData.diagnosticTime = 0;
  statusLEDData.simulationInterval = setInterval(() => {
    statusLEDData.diagnosticTime++;
    updateDiagnosticDisplay();
  }, 1000);
  
  // Inject a random fault for the challenge
  const faultTypes = Object.keys(FAULT_TYPES);
  const randomFault = faultTypes[Math.floor(Math.random() * faultTypes.length)];
  injectFault(randomFault);
  
  console.log('Diagnostic challenge started');
}

// Reset Diagnostic Challenge
function resetDiagnosticChallenge() {
  if (statusLEDData.simulationInterval) {
    clearInterval(statusLEDData.simulationInterval);
    statusLEDData.simulationInterval = null;
  }
  
  statusLEDData.diagnosticTime = 0;
  clearAllFaults();
  updateDiagnosticDisplay();
  console.log('Diagnostic challenge reset');
}

// Update Diagnostic Display
function updateDiagnosticDisplay() {
  const diagnosticTime = document.getElementById('diagnostic-time');
  const diagnosticAccuracy = document.getElementById('diagnostic-accuracy');
  const challengesCompleted = document.getElementById('challenges-completed');
  
  if (!diagnosticTime || !diagnosticAccuracy || !challengesCompleted) return;
  
  const minutes = Math.floor(statusLEDData.diagnosticTime / 60);
  const seconds = statusLEDData.diagnosticTime % 60;
  diagnosticTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const accuracy = statusLEDData.totalDiagnoses > 0 ? 
    Math.round((statusLEDData.correctDiagnoses / statusLEDData.totalDiagnoses) * 100) : 0;
  diagnosticAccuracy.textContent = accuracy + '%';
  
  challengesCompleted.textContent = statusLEDData.totalDiagnoses;
}

// Start LED Monitoring
function startLEDMonitoring() {
  // Update displays every second
  setInterval(() => {
    updateLEDDisplay();
    updateSystemStatus();
    updateShiftDisplay();
    updateDiagnosticDisplay();
  }, 1000);
}

// Helper Functions
function getHealthColor(health) {
  switch (health) {
    case 'normal': return '#4CAF50';
    case 'warning': return '#FF9800';
    case 'fault': return '#F44336';
    case 'critical': return '#9C27B0';
    default: return '#FFFFFF';
  }
}

function getFaultColor(level) {
  if (level === 0) return '#4CAF50';
  if (level < 30) return '#FF9800';
  if (level < 70) return '#F44336';
  return '#9C27B0';
}

// Add CSS for flashing animation
const style = document.createElement('style');
style.textContent = `
  @keyframes flash {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
`;
document.head.appendChild(style);

// Export functions for global access
window.initializeStatusLEDSimulation = initializeStatusLEDSimulation;
window.statusLEDData = statusLEDData; 