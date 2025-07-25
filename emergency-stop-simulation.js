// Emergency Stop Simulation for Worksheet 2
// Industrial Maintenance Training System

// Emergency Stop System State
let emergencyStopData = {
  channel1: { status: 'healthy', fault: false, contactWear: 0 },
  channel2: { status: 'healthy', fault: false, contactWear: 0 },
  systemStatus: 'running',
  resetSequence: { twist: false, blueButton: false },
  faultHistory: [],
  maintenanceDue: 30
};

// Initialize Emergency Stop simulation
function initializeEmergencyStopSimulation() {
  console.log('Initializing Emergency Stop simulation...');
  
  // Initialize E-stop controls
  initializeEStopControls();
  
  // Initialize fault injection system
  initializeFaultInjection();
  
  // Initialize reset sequence
  initializeResetSequence();
  
  // Initialize fault history panel
  initializeFaultHistory();
  
  // Start system monitoring
  startEStopMonitoring();
  
  console.log('Emergency Stop simulation initialized');
}

// Initialize E-stop controls
function initializeEStopControls() {
  // Create E-stop control panel if it doesn't exist
  const existingPanel = document.querySelector('.emergency-stop-panel');
  if (!existingPanel) {
    createEStopControlPanel();
  }
  
  // Initialize E-stop button
  const eStopButton = document.getElementById('emergency-stop-button');
  if (eStopButton) {
    eStopButton.addEventListener('click', function() {
      activateEmergencyStop();
    });
  }
  
  // Initialize reset button
  const resetButton = document.getElementById('reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      initiateResetSequence();
    });
  }
}

// Create E-stop control panel
function createEStopControlPanel() {
  const simulationSection = document.getElementById('emergency-stop-control-panel');
  if (!simulationSection) {
    console.log('Emergency stop control panel container not found');
    return;
  }
  
  const eStopPanel = document.createElement('div');
  eStopPanel.className = 'emergency-stop-panel';
  eStopPanel.style.cssText = `
    background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    border: 2px solid #F44336;
    box-shadow: 0 8px 20px rgba(244, 67, 54, 0.2);
  `;
  
  eStopPanel.innerHTML = `
    <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-exclamation-triangle"></i> Emergency Stop System
    </h4>
    
    <div class="e-stop-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
      <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
        <button id="emergency-stop-button" style="background: #F44336; color: white; border: none; padding: 20px; border-radius: 50%; width: 80px; height: 80px; font-size: 24px; cursor: pointer; transition: all 0.3s ease;">
          <i class="fas fa-stop"></i>
        </button>
        <div style="color: #FFFFFF; margin-top: 10px; font-weight: bold;">EMERGENCY STOP</div>
      </div>
      
      <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
        <button id="reset-button" style="background: #4CAF50; color: white; border: none; padding: 15px 25px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
          <i class="fas fa-redo"></i> RESET SYSTEM
        </button>
        <div style="color: #FFFFFF; margin-top: 10px; font-size: 12px;">Twist + Blue Button</div>
      </div>
    </div>
    
    <div class="system-status" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; background: #222; padding: 15px; border-radius: 8px;">
      <div class="status-item">
        <label style="color: #FFFFFF; font-size: 12px;">System Status</label>
        <div id="system-status" style="color: #4CAF50; font-weight: bold; font-size: 16px;">RUNNING</div>
      </div>
      <div class="status-item">
        <label style="color: #FFFFFF; font-size: 12px;">Channel 1</label>
        <div id="channel1-status" style="color: #4CAF50; font-weight: bold; font-size: 16px;">HEALTHY</div>
      </div>
      <div class="status-item">
        <label style="color: #FFFFFF; font-size: 12px;">Channel 2</label>
        <div id="channel2-status" style="color: #4CAF50; font-weight: bold; font-size: 16px;">HEALTHY</div>
      </div>
      <div class="status-item">
        <label style="color: #FFFFFF; font-size: 12px;">Maintenance Due</label>
        <div id="e-stop-maintenance" style="color: #FF9800; font-weight: bold; font-size: 16px;">30 days</div>
      </div>
    </div>
  `;
  
  simulationSection.appendChild(eStopPanel);
}

// Initialize fault injection system
function initializeFaultInjection() {
  // Create fault injection panel
  const simulationSection = document.getElementById('fault-injection-panel');
  if (!simulationSection) {
    console.log('Fault injection panel container not found');
    return;
  }
  
  const faultPanel = document.createElement('div');
  faultPanel.className = 'fault-injection-panel';
  faultPanel.style.cssText = `
    background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    border: 2px solid #FF9800;
    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.2);
  `;
  
  faultPanel.innerHTML = `
    <h4 style="color: #FF9800; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-bug"></i> Fault Injection & Diagnostics
    </h4>
    
    <div class="fault-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
      <button class="fault-button" data-fault="channel1-break" style="background: #FF5722; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
        <i class="fas fa-unlink"></i> Break Channel 1
      </button>
      <button class="fault-button" data-fault="channel2-break" style="background: #FF5722; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
        <i class="fas fa-unlink"></i> Break Channel 2
      </button>
      <button class="fault-button" data-fault="contact-wear" style="background: #FF9800; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
        <i class="fas fa-wrench"></i> Simulate Contact Wear
      </button>
      <button class="fault-button" data-fault="clear-faults" style="background: #4CAF50; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
        <i class="fas fa-eraser"></i> Clear All Faults
      </button>
    </div>
    
    <div class="fault-history" style="background: #222; padding: 15px; border-radius: 8px;">
      <h5 style="color: #FFFFFF; margin-bottom: 10px; font-size: 14px;">Fault History</h5>
      <div id="fault-history-list" style="color: #FFFFFF; font-size: 12px; max-height: 100px; overflow-y: auto;">
        No faults detected
      </div>
    </div>
  `;
  
  simulationSection.appendChild(faultPanel);
  
  // Initialize fault buttons
  const faultButtons = document.querySelectorAll('.fault-button');
  faultButtons.forEach(button => {
    button.addEventListener('click', function() {
      const faultType = this.getAttribute('data-fault');
      injectFault(faultType);
    });
  });
}

// Initialize reset sequence
function initializeResetSequence() {
  // Create reset sequence panel
  const simulationSection = document.getElementById('reset-sequence-panel');
  if (!simulationSection) {
    console.log('Reset sequence panel container not found');
    return;
  }
  
  const resetPanel = document.createElement('div');
  resetPanel.className = 'reset-sequence-panel';
  resetPanel.style.cssText = `
    background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    border: 2px solid #2196F3;
    box-shadow: 0 8px 20px rgba(33, 150, 243, 0.2);
  `;
  
  resetPanel.innerHTML = `
    <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-key"></i> Reset Sequence Training
    </h4>
    
    <div class="reset-steps" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
      <div class="reset-step" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="color: #FFFFFF; font-weight: bold; margin-bottom: 5px;">Step 1: Twist</div>
        <button id="twist-button" style="background: #FF9800; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          <i class="fas fa-undo"></i> TWIST
        </button>
      </div>
      
      <div class="reset-step" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="color: #FFFFFF; font-weight: bold; margin-bottom: 5px;">Step 2: Blue Button</div>
        <button id="blue-button" style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          <i class="fas fa-circle"></i> BLUE BUTTON
        </button>
      </div>
    </div>
    
    <div class="reset-status" style="margin-top: 15px; text-align: center;">
      <div id="reset-status" style="color: #FFFFFF; font-weight: bold;">System ready for reset sequence</div>
    </div>
  `;
  
  simulationSection.appendChild(resetPanel);
  
  // Initialize reset buttons
  const twistButton = document.getElementById('twist-button');
  const blueButton = document.getElementById('blue-button');
  
  if (twistButton) {
    twistButton.addEventListener('click', function() {
      performTwist();
    });
  }
  
  if (blueButton) {
    blueButton.addEventListener('click', function() {
      performBlueButton();
    });
  }
}

// Initialize fault history panel
function initializeFaultHistory() {
  const simulationSection = document.getElementById('fault-history-panel');
  if (!simulationSection) {
    console.log('Fault history panel container not found');
    return;
  }
  
  const historyPanel = document.createElement('div');
  historyPanel.className = 'fault-history-panel';
  historyPanel.style.cssText = `
    background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    border: 2px solid #9C27B0;
    box-shadow: 0 8px 20px rgba(156, 39, 176, 0.2);
  `;
  
  historyPanel.innerHTML = `
    <h4 style="color: #9C27B0; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-history"></i> Fault History & Diagnostics
    </h4>
    
    <div class="diagnostic-info" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
      <div class="diagnostic-item" style="background: #333; padding: 15px; border-radius: 8px;">
        <div style="color: #FFFFFF; font-size: 12px; margin-bottom: 5px;">Channel 1 Status</div>
        <div id="channel1-status" style="color: #4CAF50; font-weight: bold;">Healthy</div>
      </div>
      <div class="diagnostic-item" style="background: #333; padding: 15px; border-radius: 8px;">
        <div style="color: #FFFFFF; font-size: 12px; margin-bottom: 5px;">Channel 2 Status</div>
        <div id="channel2-status" style="color: #4CAF50; font-weight: bold;">Healthy</div>
      </div>
      <div class="diagnostic-item" style="background: #333; padding: 15px; border-radius: 8px;">
        <div style="color: #FFFFFF; font-size: 12px; margin-bottom: 5px;">Maintenance Due</div>
        <div id="maintenance-due" style="color: #FF9800; font-weight: bold;">30 days</div>
      </div>
    </div>
    
    <div class="fault-log" style="background: #222; padding: 15px; border-radius: 8px;">
      <h5 style="color: #FFFFFF; margin-bottom: 10px; font-size: 14px;">System Log</h5>
      <div id="system-log" style="color: #FFFFFF; font-size: 12px; max-height: 150px; overflow-y: auto; font-family: monospace;">
        System initialized - Emergency Stop ready
      </div>
    </div>
  `;
  
  simulationSection.appendChild(historyPanel);
}

// Activate emergency stop
function activateEmergencyStop() {
  emergencyStopData.systemStatus = 'stopped';
  updateEStopDisplay();
  addFaultToHistory('Emergency Stop activated');
  showInlineNotification('EMERGENCY STOP ACTIVATED - System halted', 'error');
}

// Initiate reset sequence
function initiateResetSequence() {
  emergencyStopData.resetSequence = { twist: false, blueButton: false };
  updateResetStatus('Perform reset sequence: 1. Twist 2. Blue Button');
  showInlineNotification('Reset sequence initiated - Follow the steps', 'info');
}

// Perform twist action
function performTwist() {
  emergencyStopData.resetSequence.twist = true;
  updateResetStatus('Twist completed - Now press Blue Button');
  showInlineNotification('Twist action completed', 'success');
}

// Perform blue button action
function performBlueButton() {
  if (emergencyStopData.resetSequence.twist) {
    emergencyStopData.resetSequence.blueButton = true;
    emergencyStopData.systemStatus = 'running';
    emergencyStopData.resetSequence = { twist: false, blueButton: false };
    updateEStopDisplay();
    updateResetStatus('Reset sequence completed - System running');
    showInlineNotification('System reset successfully', 'success');
  } else {
    updateResetStatus('ERROR: Must twist first before pressing Blue Button');
    showInlineNotification('Reset sequence error - Twist first!', 'error');
  }
}

// Inject fault
function injectFault(faultType) {
  switch (faultType) {
    case 'channel1-break':
      emergencyStopData.channel1.fault = true;
      emergencyStopData.channel1.status = 'fault';
      addFaultToHistory('Channel 1 wire break detected');
      showInlineNotification('Channel 1 fault injected - Wire break simulated', 'warning');
      break;
    case 'channel2-break':
      emergencyStopData.channel2.fault = true;
      emergencyStopData.channel2.status = 'fault';
      addFaultToHistory('Channel 2 wire break detected');
      showInlineNotification('Channel 2 fault injected - Wire break simulated', 'warning');
      break;
    case 'contact-wear':
      emergencyStopData.channel1.contactWear += 0.3;
      emergencyStopData.channel2.contactWear += 0.3;
      addFaultToHistory('Contact wear simulated');
      showInlineNotification('Contact wear simulated - Monitor performance', 'warning');
      break;
    case 'clear-faults':
      emergencyStopData.channel1.fault = false;
      emergencyStopData.channel2.fault = false;
      emergencyStopData.channel1.status = 'healthy';
      emergencyStopData.channel2.status = 'healthy';
      emergencyStopData.channel1.contactWear = 0;
      emergencyStopData.channel2.contactWear = 0;
      clearFaultHistory();
      showInlineNotification('All faults cleared', 'success');
      break;
  }
  updateEStopDisplay();
}

// Add fault to history
function addFaultToHistory(fault) {
  const timestamp = new Date().toLocaleTimeString();
  emergencyStopData.faultHistory.push(`${timestamp}: ${fault}`);
  updateFaultHistory();
}

// Update fault history display
function updateFaultHistory() {
  const historyList = document.getElementById('fault-history-list');
  if (historyList) {
    if (emergencyStopData.faultHistory.length === 0) {
      historyList.innerHTML = 'No faults detected';
    } else {
      historyList.innerHTML = emergencyStopData.faultHistory
        .slice(-5) // Show last 5 faults
        .map(fault => `<div style="margin-bottom: 5px;">${fault}</div>`)
        .join('');
    }
  }
}

// Clear fault history
function clearFaultHistory() {
  emergencyStopData.faultHistory = [];
  updateFaultHistory();
}

// Update E-stop display
function updateEStopDisplay() {
  const systemStatus = document.getElementById('system-status');
  const channel1Status = document.getElementById('channel1-status');
  const channel2Status = document.getElementById('channel2-status');
  const maintenanceDue = document.getElementById('e-stop-maintenance');
  
  if (systemStatus) {
    systemStatus.textContent = emergencyStopData.systemStatus.toUpperCase();
    systemStatus.style.color = emergencyStopData.systemStatus === 'running' ? '#4CAF50' : '#F44336';
  }
  
  if (channel1Status) {
    channel1Status.textContent = emergencyStopData.channel1.status.toUpperCase();
    channel1Status.style.color = emergencyStopData.channel1.status === 'healthy' ? '#4CAF50' : '#F44336';
  }
  
  if (channel2Status) {
    channel2Status.textContent = emergencyStopData.channel2.status.toUpperCase();
    channel2Status.style.color = emergencyStopData.channel2.status === 'healthy' ? '#4CAF50' : '#F44336';
  }
  
  if (maintenanceDue) {
    maintenanceDue.textContent = emergencyStopData.maintenanceDue + ' days';
  }
}

// Update reset status
function updateResetStatus(message) {
  const resetStatus = document.getElementById('reset-status');
  if (resetStatus) {
    resetStatus.textContent = message;
  }
}

// Start E-stop monitoring
function startEStopMonitoring() {
  setInterval(() => {
    // Simulate contact wear over time
    if (emergencyStopData.channel1.contactWear > 0.8 || emergencyStopData.channel2.contactWear > 0.8) {
      emergencyStopData.maintenanceDue = Math.max(0, emergencyStopData.maintenanceDue - 1);
      if (emergencyStopData.maintenanceDue === 0) {
        addFaultToHistory('Maintenance overdue - Contact replacement needed');
      }
    }
    
    updateEStopDisplay();
  }, 5000); // Update every 5 seconds
}

// Export functions for global access
window.initializeEmergencyStopSimulation = initializeEmergencyStopSimulation;
window.emergencyStopData = emergencyStopData; 