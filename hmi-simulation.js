// HMI Simulation System
// Industrial Maintenance Training - Worksheet 5

// HMI System State
window.hmiData = {
  // Alarm System
  alarms: {
    active: [],
    acknowledged: [],
    history: []
  },
  
  // System Configuration
  configuration: {
    temperatureCutout: 85,
    pressureLimit: 2.5,
    flowSetpoint: 75,
    pumpSpeed: 60,
    valvePosition: 50
  },
  
  // System Status
  systemStatus: 'running',
  currentScreen: 'main',
  operatorLevel: 'trainee',
  
  // Performance Tracking
  responseTime: 0,
  correctActions: 0,
  totalActions: 0
};

// Initialize HMI Simulation
function initializeHMISimulation() {
  console.log('Initializing HMI simulation...');
  
  initializeHMIDisplay();
  initializeAlarmSystem();
  initializeConfigurationPanel();
  startHMIUpdates();
  
  console.log('HMI simulation initialized');
}

// Initialize HMI Display
function initializeHMIDisplay() {
  const container = document.getElementById('hmi-display-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="hmi-interface" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-desktop"></i> Human-Machine Interface
      </h4>
      
      <!-- Navigation Bar -->
      <div class="hmi-nav" style="background: #333; padding: 10px; border-radius: 8px; margin-bottom: 20px; display: flex; gap: 10px;">
        <button class="nav-btn active" data-screen="main" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Main</button>
        <button class="nav-btn" data-screen="alarms" style="background: #666; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Alarms</button>
        <button class="nav-btn" data-screen="config" style="background: #666; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Config</button>
        <button class="nav-btn" data-screen="trends" style="background: #666; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Trends</button>
      </div>
      
      <!-- Main Screen -->
      <div id="hmi-main-screen" class="hmi-screen active" style="display: block;">
        <div class="system-overview" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="color: #4CAF50; font-size: 24px; font-weight: bold;">RUNNING</div>
            <div style="color: #AAA; font-size: 12px;">System Status</div>
          </div>
          <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
            <div id="temp-display" style="color: #FF9800; font-size: 24px; font-weight: bold;">75°C</div>
            <div style="color: #AAA; font-size: 12px;">Temperature</div>
          </div>
          <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
            <div id="flow-display" style="color: #2196F3; font-size: 24px; font-weight: bold;">75 L/min</div>
            <div style="color: #AAA; font-size: 12px;">Flow Rate</div>
          </div>
          <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
            <div id="pressure-display" style="color: #9C27B0; font-size: 24px; font-weight: bold;">1.2 bar</div>
            <div style="color: #AAA; font-size: 12px;">Pressure</div>
          </div>
        </div>
        
        <!-- Control Panel -->
        <div class="control-panel" style="background: #333; padding: 20px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">System Controls</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div class="control-group">
              <label style="color: #FFFFFF; font-size: 12px;">Pump Speed (%)</label>
              <input type="range" id="pump-speed-slider" min="0" max="100" value="60" style="width: 100%;">
              <span id="pump-speed-value" style="color: #4CAF50; font-size: 14px;">60%</span>
            </div>
            <div class="control-group">
              <label style="color: #FFFFFF; font-size: 12px;">Valve Position (%)</label>
              <input type="range" id="valve-position-slider" min="0" max="100" value="50" style="width: 100%;">
              <span id="valve-position-value" style="color: #4CAF50; font-size: 14px;">50%</span>
            </div>
            <div class="control-group">
              <label style="color: #FFFFFF; font-size: 12px;">Flow Setpoint (L/min)</label>
              <input type="range" id="flow-setpoint-slider" min="0" max="100" value="75" style="width: 100%;">
              <span id="flow-setpoint-value" style="color: #4CAF50; font-size: 14px;">75 L/min</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Alarms Screen -->
      <div id="hmi-alarms-screen" class="hmi-screen" style="display: none;">
        <div class="alarms-panel" style="background: #333; padding: 20px; border-radius: 8px;">
          <h5 style="color: #F44336; margin-bottom: 15px;">Active Alarms</h5>
          <div id="active-alarms-list" style="margin-bottom: 20px;">
            <!-- Active alarms will be listed here -->
          </div>
          
          <h5 style="color: #FF9800; margin-bottom: 15px;">Acknowledged Alarms</h5>
          <div id="acknowledged-alarms-list">
            <!-- Acknowledged alarms will be listed here -->
          </div>
        </div>
      </div>
      
      <!-- Configuration Screen -->
      <div id="hmi-config-screen" class="hmi-screen" style="display: none;">
        <div class="config-panel" style="background: #333; padding: 20px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">System Configuration</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div class="config-group">
              <label style="color: #FFFFFF; font-size: 12px;">Temperature Cutout (°C)</label>
              <input type="number" id="temp-cutout-input" value="85" min="50" max="120" style="width: 100%; padding: 5px; border-radius: 3px; border: 1px solid #555; background: #222; color: #FFFFFF;">
            </div>
            <div class="config-group">
              <label style="color: #FFFFFF; font-size: 12px;">Pressure Limit (bar)</label>
              <input type="number" id="pressure-limit-input" value="2.5" min="1" max="5" step="0.1" style="width: 100%; padding: 5px; border-radius: 3px; border: 1px solid #555; background: #222; color: #FFFFFF;">
            </div>
            <div class="config-group">
              <label style="color: #FFFFFF; font-size: 12px;">Default Flow Setpoint (L/min)</label>
              <input type="number" id="default-flow-input" value="75" min="0" max="100" style="width: 100%; padding: 5px; border-radius: 3px; border: 1px solid #555; background: #222; color: #FFFFFF;">
            </div>
          </div>
          <button id="save-config-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
            Save Configuration
          </button>
        </div>
      </div>
      
      <!-- Trends Screen -->
      <div id="hmi-trends-screen" class="hmi-screen" style="display: none;">
        <div class="trends-panel" style="background: #333; padding: 20px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">System Trends</h5>
          <canvas id="trends-chart" width="600" height="200" style="background: #222; border-radius: 5px; width: 100%; height: 200px;"></canvas>
        </div>
      </div>
    </div>
  `;
  
  // Add navigation event listeners
  container.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const screen = this.dataset.screen;
      switchScreen(screen);
    });
  });
  
  // Add control event listeners
  addControlEventListeners();
}

// Initialize Alarm System
function initializeAlarmSystem() {
  const container = document.getElementById('hmi-alarm-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="alarm-controls" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle"></i> Alarm Management
      </h4>
      
      <div class="alarm-controls-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <button id="inject-temp-alarm" style="background: #F44336; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Inject Temperature Alarm
        </button>
        <button id="inject-pressure-alarm" style="background: #F44336; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Inject Pressure Alarm
        </button>
        <button id="inject-flow-alarm" style="background: #F44336; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Inject Flow Alarm
        </button>
        <button id="clear-all-alarms" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Clear All Alarms
        </button>
      </div>
      
      <div class="alarm-stats" style="background: #333; padding: 15px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
          <div>
            <span style="color: #AAA; font-size: 12px;">Active Alarms:</span>
            <div id="active-alarm-count" style="color: #F44336; font-weight: bold; font-size: 18px;">0</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Acknowledged:</span>
            <div id="acknowledged-alarm-count" style="color: #FF9800; font-weight: bold; font-size: 18px;">0</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Response Time:</span>
            <div id="avg-response-time" style="color: #4CAF50; font-weight: bold; font-size: 18px;">0s</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add alarm control event listeners
  document.getElementById('inject-temp-alarm')?.addEventListener('click', () => injectAlarm('temperature_high'));
  document.getElementById('inject-pressure-alarm')?.addEventListener('click', () => injectAlarm('pressure_high'));
  document.getElementById('inject-flow-alarm')?.addEventListener('click', () => injectAlarm('flow_low'));
  document.getElementById('clear-all-alarms')?.addEventListener('click', clearAllAlarms);
}

// Initialize Configuration Panel
function initializeConfigurationPanel() {
  const container = document.getElementById('hmi-config-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="config-controls" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-cogs"></i> Configuration Management
      </h4>
      
      <div class="config-scenarios" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div class="scenario-card" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Misconfiguration Test</h5>
          <p style="color: #AAA; font-size: 12px; margin-bottom: 10px;">Set incorrect limits to test system response</p>
          <button class="test-config-btn" data-scenario="misconfig" style="background: #FF9800; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            Test Misconfiguration
          </button>
        </div>
        
        <div class="scenario-card" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Operator Training</h5>
          <p style="color: #AAA; font-size: 12px; margin-bottom: 10px;">Practice alarm acknowledgment and configuration</p>
          <button class="training-btn" data-scenario="training" style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            Start Training
          </button>
        </div>
        
        <div class="scenario-card" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">System Reset</h5>
          <p style="color: #AAA; font-size: 12px; margin-bottom: 10px;">Reset all configurations to default values</p>
          <button class="reset-btn" data-scenario="reset" style="background: #F44336; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            Reset System
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add configuration event listeners
  addConfigurationEventListeners();
}

// Switch HMI Screen
function switchScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.hmi-screen').forEach(screen => {
    screen.style.display = 'none';
  });
  
  // Remove active class from all nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = '#666';
  });
  
  // Show selected screen
  const selectedScreen = document.getElementById(`hmi-${screenName}-screen`);
  if (selectedScreen) {
    selectedScreen.style.display = 'block';
  }
  
  // Activate nav button
  const activeBtn = document.querySelector(`[data-screen="${screenName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.background = '#4CAF50';
  }
  
  hmiData.currentScreen = screenName;
  
  // Update screen-specific content
  if (screenName === 'alarms') {
    updateAlarmsDisplay();
  } else if (screenName === 'trends') {
    updateTrendsChart();
  }
}

// Add Control Event Listeners
function addControlEventListeners() {
  // Pump speed control
  const pumpSlider = document.getElementById('pump-speed-slider');
  const pumpValue = document.getElementById('pump-speed-value');
  if (pumpSlider && pumpValue) {
    pumpSlider.addEventListener('input', function() {
      const value = this.value;
      pumpValue.textContent = value + '%';
      hmiData.configuration.pumpSpeed = parseInt(value);
    });
  }
  
  // Valve position control
  const valveSlider = document.getElementById('valve-position-slider');
  const valveValue = document.getElementById('valve-position-value');
  if (valveSlider && valveValue) {
    valveSlider.addEventListener('input', function() {
      const value = this.value;
      valveValue.textContent = value + '%';
      hmiData.configuration.valvePosition = parseInt(value);
    });
  }
  
  // Flow setpoint control
  const flowSlider = document.getElementById('flow-setpoint-slider');
  const flowValue = document.getElementById('flow-setpoint-value');
  if (flowSlider && flowValue) {
    flowSlider.addEventListener('input', function() {
      const value = this.value;
      flowValue.textContent = value + ' L/min';
      hmiData.configuration.flowSetpoint = parseInt(value);
    });
  }
  
  // Configuration save button
  const saveBtn = document.getElementById('save-config-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveConfiguration);
  }
}

// Add Configuration Event Listeners
function addConfigurationEventListeners() {
  // Misconfiguration test
  document.querySelector('[data-scenario="misconfig"]')?.addEventListener('click', testMisconfiguration);
  
  // Training mode
  document.querySelector('[data-scenario="training"]')?.addEventListener('click', startTrainingMode);
  
  // System reset
  document.querySelector('[data-scenario="reset"]')?.addEventListener('click', resetSystem);
}

// Inject Alarm
function injectAlarm(alarmType) {
  const alarm = {
    id: Date.now(),
    type: alarmType,
    message: getAlarmMessage(alarmType),
    severity: getAlarmSeverity(alarmType),
    timestamp: new Date().toLocaleTimeString(),
    acknowledged: false
  };
  
  hmiData.alarms.active.push(alarm);
  updateAlarmsDisplay();
  updateAlarmStats();
  
  // Switch to alarms screen
  switchScreen('alarms');
}

// Get Alarm Message
function getAlarmMessage(type) {
  const messages = {
    'temperature_high': 'Temperature above limit',
    'pressure_high': 'Pressure above limit',
    'flow_low': 'Flow rate below minimum',
    'pump_failure': 'Pump failure detected',
    'valve_stuck': 'Valve position fault'
  };
  return messages[type] || 'Unknown alarm';
}

// Get Alarm Severity
function getAlarmSeverity(type) {
  const severities = {
    'temperature_high': 'high',
    'pressure_high': 'critical',
    'flow_low': 'medium',
    'pump_failure': 'critical',
    'valve_stuck': 'high'
  };
  return severities[type] || 'low';
}

// Update Alarms Display
function updateAlarmsDisplay() {
  const activeContainer = document.getElementById('active-alarms-list');
  const acknowledgedContainer = document.getElementById('acknowledged-alarms-list');
  
  if (activeContainer) {
    activeContainer.innerHTML = hmiData.alarms.active.map(alarm => `
      <div class="alarm-item" style="background: #222; padding: 10px; margin-bottom: 8px; border-radius: 5px; border-left: 4px solid #F44336; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="color: #FFFFFF; font-weight: bold;">${alarm.message}</div>
          <div style="color: #AAA; font-size: 12px;">${alarm.timestamp} - ${alarm.severity.toUpperCase()}</div>
        </div>
        <button class="ack-btn" data-alarm-id="${alarm.id}" style="background: #FF9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">
          Acknowledge
        </button>
      </div>
    `).join('');
    
    // Add acknowledge event listeners
    activeContainer.querySelectorAll('.ack-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const alarmId = parseInt(this.dataset.alarmId);
        acknowledgeAlarm(alarmId);
      });
    });
  }
  
  if (acknowledgedContainer) {
    acknowledgedContainer.innerHTML = hmiData.alarms.acknowledged.map(alarm => `
      <div class="alarm-item" style="background: #222; padding: 10px; margin-bottom: 8px; border-radius: 5px; border-left: 4px solid #FF9800; opacity: 0.7;">
        <div style="color: #FFFFFF; font-weight: bold;">${alarm.message}</div>
        <div style="color: #AAA; font-size: 12px;">${alarm.timestamp} - Acknowledged</div>
      </div>
    `).join('');
  }
}

// Acknowledge Alarm
function acknowledgeAlarm(alarmId) {
  const alarmIndex = hmiData.alarms.active.findIndex(alarm => alarm.id === alarmId);
  if (alarmIndex !== -1) {
    const alarm = hmiData.alarms.active.splice(alarmIndex, 1)[0];
    alarm.acknowledged = true;
    hmiData.alarms.acknowledged.push(alarm);
    
    updateAlarmsDisplay();
    updateAlarmStats();
  }
}

// Clear All Alarms
function clearAllAlarms() {
  hmiData.alarms.active = [];
  hmiData.alarms.acknowledged = [];
  updateAlarmsDisplay();
  updateAlarmStats();
}

// Update Alarm Stats
function updateAlarmStats() {
  const activeCount = document.getElementById('active-alarm-count');
  const acknowledgedCount = document.getElementById('acknowledged-alarm-count');
  
  if (activeCount) {
    activeCount.textContent = hmiData.alarms.active.length;
  }
  
  if (acknowledgedCount) {
    acknowledgedCount.textContent = hmiData.alarms.acknowledged.length;
  }
}

// Save Configuration
function saveConfiguration() {
  const tempCutout = document.getElementById('temp-cutout-input')?.value;
  const pressureLimit = document.getElementById('pressure-limit-input')?.value;
  const defaultFlow = document.getElementById('default-flow-input')?.value;
  
  if (tempCutout) hmiData.configuration.temperatureCutout = parseFloat(tempCutout);
  if (pressureLimit) hmiData.configuration.pressureLimit = parseFloat(pressureLimit);
  if (defaultFlow) hmiData.configuration.flowSetpoint = parseFloat(defaultFlow);
  
  // Show success message
  showNotification('Configuration saved successfully', 'success');
}

// Test Misconfiguration
function testMisconfiguration() {
  // Set incorrect values
  hmiData.configuration.temperatureCutout = 60; // Too low
  hmiData.configuration.pressureLimit = 1.0; // Too low
  
  // Update display
  document.getElementById('temp-cutout-input').value = 60;
  document.getElementById('pressure-limit-input').value = 1.0;
  
  // Inject alarms
  setTimeout(() => injectAlarm('temperature_high'), 1000);
  setTimeout(() => injectAlarm('pressure_high'), 2000);
  
  showNotification('Misconfiguration test started - watch for alarms', 'warning');
}

// Start Training Mode
function startTrainingMode() {
  hmiData.operatorLevel = 'training';
  showNotification('Training mode activated - practice alarm management', 'info');
  
  // Inject training alarms
  setTimeout(() => injectAlarm('flow_low'), 2000);
  setTimeout(() => injectAlarm('temperature_high'), 5000);
}

// Reset System
function resetSystem() {
  hmiData.configuration = {
    temperatureCutout: 85,
    pressureLimit: 2.5,
    flowSetpoint: 75,
    pumpSpeed: 60,
    valvePosition: 50
  };
  
  hmiData.alarms.active = [];
  hmiData.alarms.acknowledged = [];
  
  // Update displays
  updateAlarmsDisplay();
  updateAlarmStats();
  
  showNotification('System reset to default configuration', 'success');
}

// Update Trends Chart
function updateTrendsChart() {
  const canvas = document.getElementById('trends-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, width, height);
  
  // Draw trend lines
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i < width; i += 10) {
    const x = i;
    const y = height - (Math.sin(i * 0.01) * 50 + 100);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

// Show Notification
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : type === 'error' ? '#F44336' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 1000;
    font-weight: bold;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Start HMI Updates
function startHMIUpdates() {
  setInterval(() => {
    // Update system values
    const tempDisplay = document.getElementById('temp-display');
    const flowDisplay = document.getElementById('flow-display');
    const pressureDisplay = document.getElementById('pressure-display');
    
    if (tempDisplay) {
      const temp = 70 + Math.random() * 10;
      tempDisplay.textContent = temp.toFixed(1) + '°C';
    }
    
    if (flowDisplay) {
      const flow = hmiData.configuration.flowSetpoint + (Math.random() - 0.5) * 10;
      flowDisplay.textContent = flow.toFixed(1) + ' L/min';
    }
    
    if (pressureDisplay) {
      const pressure = 1.0 + Math.random() * 0.5;
      pressureDisplay.textContent = pressure.toFixed(1) + ' bar';
    }
  }, 1000);
}

// Export functions for global access
window.initializeHMISimulation = initializeHMISimulation;
window.hmiData = hmiData; 