// Valve Simulation System
// Industrial Maintenance Training - Worksheet 7

// Valve System State
window.valveData = {
  // Valve Status
  valveType: 'proportional',
  valvePosition: 0, // 0-100%
  demandSignal: 0, // 0-10V or 0-100% PWM
  actualPosition: 0, // 0-100%
  
  // Control Parameters
  deadband: 10, // % - no movement below this threshold
  hysteresis: 2, // % - difference between open/close positions
  responseTime: 2, // seconds - time to reach 90% of demand
  
  // System Conditions
  inletPressure: 2.0, // bar
  outletPressure: 1.5, // bar
  flowRate: 0, // L/min
  temperature: 25, // °C
  
  // Fault Conditions
  stuckPosition: false,
  heatBuildup: false,
  actuatorFault: false,
  sensorDrift: 0, // % offset
  
  // Performance Metrics
  accuracy: 95, // %
  repeatability: 98, // %
  linearity: 97, // %
  responseTime: 2.0, // seconds
  
  // Calibration Data
  calibrationPoints: [],
  calibrationDate: null,
  nextCalibration: null,
  
  // Simulation Control
  autoMode: false,
  simulationInterval: null,
  faultInjectionInterval: null
};

// Initialize Valve Simulation
function initializeValveSimulation() {
  console.log('Initializing Valve simulation...');
  
  initializeValveDisplay();
  initializeValveControls();
  initializeCalibrationPanel();
  initializeFaultInjection();
  startValveMonitoring();
  
  console.log('Valve simulation initialized');
}

// Initialize Valve Display
function initializeValveDisplay() {
  const container = document.getElementById('valve-display-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="valve-interface" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-valve"></i> Proportional Valve System
      </h4>
      
      <!-- Valve Visualization -->
      <div class="valve-visualization" style="background: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Valve Position</h5>
        <div class="valve-body" style="width: 200px; height: 300px; background: #222; border: 3px solid #555; border-radius: 10px; margin: 0 auto; position: relative; overflow: hidden;">
          <div id="valve-disc" style="width: 80px; height: 80px; background: #4CAF50; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); transition: all 0.5s ease; box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);"></div>
          <div id="flow-indicator" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 100px; height: 20px; background: linear-gradient(to right, #2196F3, #64B5F6); border-radius: 10px; opacity: 0.7;"></div>
        </div>
        <div style="margin-top: 15px;">
          <div id="valve-position-display" style="color: #4CAF50; font-size: 24px; font-weight: bold;">0%</div>
          <div style="color: #AAA; font-size: 12px;">Actual Position</div>
        </div>
      </div>
      
      <!-- System Status -->
      <div class="system-status" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="demand-signal-display" style="color: #FF9800; font-size: 20px; font-weight: bold;">0V</div>
          <div style="color: #AAA; font-size: 12px;">Demand Signal</div>
        </div>
        <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="flow-rate-display" style="color: #2196F3; font-size: 20px; font-weight: bold;">0 L/min</div>
          <div style="color: #AAA; font-size: 12px;">Flow Rate</div>
        </div>
        <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="pressure-drop-display" style="color: #9C27B0; font-size: 20px; font-weight: bold;">0.5 bar</div>
          <div style="color: #AAA; font-size: 12px;">Pressure Drop</div>
        </div>
        <div class="status-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="valve-temperature-display" style="color: #F44336; font-size: 20px; font-weight: bold;">25°C</div>
          <div style="color: #AAA; font-size: 12px;">Valve Temperature</div>
        </div>
      </div>
      
      <!-- Performance Metrics -->
      <div class="performance-metrics" style="background: #333; padding: 20px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Performance Metrics</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="accuracy-display" style="color: #4CAF50; font-size: 18px; font-weight: bold;">95%</div>
            <div style="color: #AAA; font-size: 12px;">Accuracy</div>
          </div>
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="repeatability-display" style="color: #FF9800; font-size: 18px; font-weight: bold;">98%</div>
            <div style="color: #AAA; font-size: 12px;">Repeatability</div>
          </div>
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="linearity-display" style="color: #2196F3; font-size: 18px; font-weight: bold;">97%</div>
            <div style="color: #AAA; font-size: 12px;">Linearity</div>
          </div>
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="response-time-display" style="color: #9C27B0; font-size: 18px; font-weight: bold;">2.0s</div>
            <div style="color: #AAA; font-size: 12px;">Response Time</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  updateValveDisplay();
}

// Initialize Valve Controls
function initializeValveControls() {
  const container = document.getElementById('valve-control-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="valve-controls" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-cogs"></i> Valve Control Panel
      </h4>
      
      <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <!-- Demand Signal Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Demand Signal Control</h5>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">Signal Type</label>
            <select id="signal-type-select" style="width: 100%; padding: 5px; border-radius: 3px; border: 1px solid #555; background: #222; color: #FFFFFF; margin-top: 5px;">
              <option value="voltage">0-10V DC</option>
              <option value="pwm">0-100% PWM</option>
              <option value="current">4-20mA</option>
            </select>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">Demand Value</label>
            <input type="range" id="demand-signal-slider" min="0" max="100" value="0" style="width: 100%; margin: 5px 0;">
            <span id="demand-signal-value" style="color: #FF9800; font-size: 14px; font-weight: bold;">0V</span>
          </div>
        </div>
        
        <!-- Deadband Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Deadband Control</h5>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">Deadband (%)</label>
            <input type="range" id="deadband-slider" min="0" max="20" value="10" style="width: 100%; margin: 5px 0;">
            <span id="deadband-value" style="color: #4CAF50; font-size: 14px; font-weight: bold;">10%</span>
          </div>
          <div style="color: #AAA; font-size: 11px;">
            No movement below: <span id="deadband-threshold" style="color: #FF9800;">10%</span>
          </div>
        </div>
        
        <!-- Response Time Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Response Time Control</h5>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">Response Time (seconds)</label>
            <input type="range" id="response-time-slider" min="0.5" max="5" value="2" step="0.1" style="width: 100%; margin: 5px 0;">
            <span id="response-time-value" style="color: #9C27B0; font-size: 14px; font-weight: bold;">2.0s</span>
          </div>
          <div style="color: #AAA; font-size: 11px;">
            Time to reach 90% of demand
          </div>
        </div>
      </div>
      
      <!-- Valve Status -->
      <div class="valve-status" style="background: #333; padding: 15px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div>
            <span style="color: #AAA; font-size: 12px;">Valve Status:</span>
            <div id="valve-status-display" style="color: #4CAF50; font-weight: bold; font-size: 16px;">OPERATIONAL</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Position Error:</span>
            <div id="position-error-display" style="color: #FF9800; font-weight: bold; font-size: 16px;">0%</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Last Calibration:</span>
            <div id="last-calibration-display" style="color: #2196F3; font-weight: bold; font-size: 16px;">30 days ago</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  addValveControlEventListeners();
}

// Initialize Calibration Panel
function initializeCalibrationPanel() {
  const container = document.getElementById('valve-calibration-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="calibration-panel" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #4CAF50; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-tools"></i> Valve Calibration
      </h4>
      
      <div class="calibration-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="calibration-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Calibration Procedures</h5>
          <div style="display: grid; gap: 10px;">
            <button id="start-calibration-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              <i class="fas fa-play"></i> Start Calibration
            </button>
            <button id="zero-calibration-btn" style="background: #2196F3; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              <i class="fas fa-home"></i> Zero Calibration
            </button>
            <button id="span-calibration-btn" style="background: #FF9800; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              <i class="fas fa-expand"></i> Span Calibration
            </button>
            <button id="linearity-test-btn" style="background: #9C27B0; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              <i class="fas fa-chart-line"></i> Linearity Test
            </button>
          </div>
        </div>
        
        <div class="calibration-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Calibration Data</h5>
          <div id="calibration-data" style="background: #222; padding: 10px; border-radius: 5px; min-height: 100px; font-family: monospace; font-size: 12px; color: #FFFFFF;">
            <div style="color: #AAA;">No calibration data available</div>
          </div>
        </div>
        
        <div class="calibration-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Calibration Status</h5>
          <div style="display: grid; gap: 10px;">
            <div>
              <span style="color: #AAA; font-size: 12px;">Calibration Status:</span>
              <div id="calibration-status" style="color: #4CAF50; font-weight: bold;">VALID</div>
            </div>
            <div>
              <span style="color: #AAA; font-size: 12px;">Next Due:</span>
              <div id="next-calibration" style="color: #FF9800; font-weight: bold;">60 days</div>
            </div>
            <div>
              <span style="color: #AAA; font-size: 12px;">Calibration Points:</span>
              <div id="calibration-points-count" style="color: #2196F3; font-weight: bold;">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add calibration event listeners
  addCalibrationEventListeners();
}

// Initialize Fault Injection
function initializeFaultInjection() {
  const container = document.getElementById('valve-fault-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="fault-injection" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle"></i> Fault Injection
      </h4>
      
      <div class="fault-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <button id="stuck-valve-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Stuck Valve
        </button>
        <button id="heat-buildup-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Heat Buildup
        </button>
        <button id="actuator-fault-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Actuator Fault
        </button>
        <button id="sensor-drift-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Sensor Drift
        </button>
        <button id="clear-valve-faults-btn" class="fault-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Clear Faults
        </button>
      </div>
      
      <!-- Fault Status -->
      <div class="fault-status" style="background: #333; padding: 15px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Fault Status</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
          <div>
            <span style="color: #AAA; font-size: 12px;">Stuck Position:</span>
            <div id="stuck-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Heat Buildup:</span>
            <div id="heat-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Actuator Fault:</span>
            <div id="actuator-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Sensor Drift:</span>
            <div id="drift-status" style="color: #4CAF50; font-weight: bold;">0%</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add fault injection event listeners
  addFaultInjectionEventListeners();
}

// Add Valve Control Event Listeners
function addValveControlEventListeners() {
  // Signal type selector
  const signalTypeSelect = document.getElementById('signal-type-select');
  if (signalTypeSelect) {
    signalTypeSelect.addEventListener('change', function() {
      updateSignalDisplay();
    });
  }
  
  // Demand signal slider
  const demandSlider = document.getElementById('demand-signal-slider');
  const demandValue = document.getElementById('demand-signal-value');
  if (demandSlider && demandValue) {
    demandSlider.addEventListener('input', function() {
      const value = this.value;
      valveData.demandSignal = parseInt(value);
      updateSignalDisplay();
      updateValvePosition();
    });
  }
  
  // Deadband slider
  const deadbandSlider = document.getElementById('deadband-slider');
  const deadbandValue = document.getElementById('deadband-value');
  const deadbandThreshold = document.getElementById('deadband-threshold');
  if (deadbandSlider && deadbandValue && deadbandThreshold) {
    deadbandSlider.addEventListener('input', function() {
      const value = this.value;
      valveData.deadband = parseInt(value);
      deadbandValue.textContent = value + '%';
      deadbandThreshold.textContent = value + '%';
    });
  }
  
  // Response time slider
  const responseSlider = document.getElementById('response-time-slider');
  const responseValue = document.getElementById('response-time-value');
  if (responseSlider && responseValue) {
    responseSlider.addEventListener('input', function() {
      const value = parseFloat(this.value);
      valveData.responseTime = value;
      responseValue.textContent = value.toFixed(1) + 's';
    });
  }
}

// Add Calibration Event Listeners
function addCalibrationEventListeners() {
  document.getElementById('start-calibration-btn')?.addEventListener('click', startCalibration);
  document.getElementById('zero-calibration-btn')?.addEventListener('click', zeroCalibration);
  document.getElementById('span-calibration-btn')?.addEventListener('click', spanCalibration);
  document.getElementById('linearity-test-btn')?.addEventListener('click', linearityTest);
}

// Add Fault Injection Event Listeners
function addFaultInjectionEventListeners() {
  document.getElementById('stuck-valve-btn')?.addEventListener('click', toggleStuckValve);
  document.getElementById('heat-buildup-btn')?.addEventListener('click', toggleHeatBuildup);
  document.getElementById('actuator-fault-btn')?.addEventListener('click', toggleActuatorFault);
  document.getElementById('sensor-drift-btn')?.addEventListener('click', injectSensorDrift);
  document.getElementById('clear-valve-faults-btn')?.addEventListener('click', clearValveFaults);
}

// Update Signal Display
function updateSignalDisplay() {
  const signalType = document.getElementById('signal-type-select')?.value || 'voltage';
  const demandValue = document.getElementById('demand-signal-value');
  
  if (demandValue) {
    const value = valveData.demandSignal;
    switch (signalType) {
      case 'voltage':
        demandValue.textContent = ((value / 100) * 10).toFixed(1) + 'V';
        break;
      case 'pwm':
        demandValue.textContent = value + '%';
        break;
      case 'current':
        demandValue.textContent = (4 + (value / 100) * 16).toFixed(1) + 'mA';
        break;
    }
  }
}

// Update Valve Position
function updateValvePosition() {
  // Apply deadband
  if (valveData.demandSignal <= valveData.deadband) {
    valveData.actualPosition = 0;
  } else {
    // Calculate position with response time simulation
    const targetPosition = valveData.demandSignal;
    const currentPosition = valveData.actualPosition;
    const timeStep = 0.1; // seconds
    
    // Simple first-order response simulation
    const timeConstant = valveData.responseTime / 2.3; // 90% response time
    const change = (targetPosition - currentPosition) * (1 - Math.exp(-timeStep / timeConstant));
    
    valveData.actualPosition = Math.max(0, Math.min(100, currentPosition + change));
  }
  
  // Apply faults
  if (valveData.stuckPosition) {
    valveData.actualPosition = 50; // Stuck at 50%
  }
  
  if (valveData.actuatorFault) {
    valveData.actualPosition *= 0.8; // Reduced movement
  }
  
  // Apply sensor drift
  valveData.actualPosition += valveData.sensorDrift;
  valveData.actualPosition = Math.max(0, Math.min(100, valveData.actualPosition));
  
  updateValveDisplay();
  updateFlowRate();
}

// Update Flow Rate
function updateFlowRate() {
  // Calculate flow based on valve position and pressure drop
  const maxFlow = 100; // L/min
  const pressureDrop = valveData.inletPressure - valveData.outletPressure;
  
  // Flow coefficient based on valve position (simplified)
  const flowCoeff = Math.pow(valveData.actualPosition / 100, 2);
  
  valveData.flowRate = maxFlow * flowCoeff * (pressureDrop / 1.0);
  valveData.flowRate = Math.round(valveData.flowRate * 10) / 10;
}

// Update Valve Display
function updateValveDisplay() {
  // Update valve disc position
  const valveDisc = document.getElementById('valve-disc');
  if (valveDisc) {
    const position = valveData.actualPosition;
    const yOffset = (100 - position) * 2; // Move up as valve opens
    valveDisc.style.transform = `translate(-50%, -50%) translateY(${yOffset}px)`;
    
    // Change color based on position
    if (position > 80) {
      valveDisc.style.background = '#4CAF50'; // Green for open
    } else if (position > 20) {
      valveDisc.style.background = '#FF9800'; // Orange for partially open
    } else {
      valveDisc.style.background = '#F44336'; // Red for closed
    }
  }
  
  // Update flow indicator
  const flowIndicator = document.getElementById('flow-indicator');
  if (flowIndicator) {
    const flowWidth = (valveData.flowRate / 100) * 100;
    flowIndicator.style.width = Math.max(20, flowWidth) + 'px';
    flowIndicator.style.opacity = valveData.flowRate > 0 ? 0.7 : 0.2;
  }
  
  // Update displays
  const positionDisplay = document.getElementById('valve-position-display');
  const flowDisplay = document.getElementById('flow-rate-display');
  const pressureDropDisplay = document.getElementById('pressure-drop-display');
  const demandDisplay = document.getElementById('demand-signal-display');
  
  if (positionDisplay) positionDisplay.textContent = Math.round(valveData.actualPosition) + '%';
  if (flowDisplay) flowDisplay.textContent = valveData.flowRate + ' L/min';
  if (pressureDropDisplay) pressureDropDisplay.textContent = (valveData.inletPressure - valveData.outletPressure).toFixed(1) + ' bar';
  if (demandDisplay) updateSignalDisplay();
  
  // Update performance metrics
  updatePerformanceMetrics();
}

// Update Performance Metrics
function updatePerformanceMetrics() {
  // Calculate accuracy (difference between demand and actual)
  const positionError = Math.abs(valveData.demandSignal - valveData.actualPosition);
  const accuracy = Math.max(0, 100 - positionError);
  
  // Calculate repeatability (simplified)
  const repeatability = 98 - (valveData.sensorDrift * 2);
  
  // Calculate linearity (simplified)
  const linearity = 97 - (valveData.stuckPosition ? 10 : 0) - (valveData.actuatorFault ? 5 : 0);
  
  // Update displays
  const accuracyDisplay = document.getElementById('accuracy-display');
  const repeatabilityDisplay = document.getElementById('repeatability-display');
  const linearityDisplay = document.getElementById('linearity-display');
  const responseTimeDisplay = document.getElementById('response-time-display');
  const positionErrorDisplay = document.getElementById('position-error-display');
  
  if (accuracyDisplay) accuracyDisplay.textContent = Math.round(accuracy) + '%';
  if (repeatabilityDisplay) repeatabilityDisplay.textContent = Math.round(repeatability) + '%';
  if (linearityDisplay) linearityDisplay.textContent = Math.round(linearity) + '%';
  if (responseTimeDisplay) responseTimeDisplay.textContent = valveData.responseTime.toFixed(1) + 's';
  if (positionErrorDisplay) positionErrorDisplay.textContent = Math.round(positionError) + '%';
  
  // Update valve status
  const valveStatus = document.getElementById('valve-status-display');
  if (valveStatus) {
    if (valveData.stuckPosition || valveData.actuatorFault) {
      valveStatus.textContent = 'FAULT';
      valveStatus.style.color = '#F44336';
    } else if (valveData.heatBuildup) {
      valveStatus.textContent = 'WARNING';
      valveStatus.style.color = '#FF9800';
    } else {
      valveStatus.textContent = 'OPERATIONAL';
      valveStatus.style.color = '#4CAF50';
    }
  }
}

// Calibration Functions
function startCalibration() {
  showNotification('Starting valve calibration procedure...', 'info');
  
  // Simulate calibration process
  setTimeout(() => {
    valveData.calibrationPoints = [
      { input: 0, output: 0 },
      { input: 25, output: 25 },
      { input: 50, output: 50 },
      { input: 75, output: 75 },
      { input: 100, output: 100 }
    ];
    
    valveData.calibrationDate = new Date();
    valveData.nextCalibration = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days
    
    updateCalibrationDisplay();
    showNotification('Calibration completed successfully', 'success');
  }, 2000);
}

function zeroCalibration() {
  showNotification('Performing zero calibration...', 'info');
  setTimeout(() => {
    showNotification('Zero calibration completed', 'success');
  }, 1000);
}

function spanCalibration() {
  showNotification('Performing span calibration...', 'info');
  setTimeout(() => {
    showNotification('Span calibration completed', 'success');
  }, 1000);
}

function linearityTest() {
  showNotification('Starting linearity test...', 'info');
  setTimeout(() => {
    showNotification('Linearity test completed - 97% linear', 'success');
  }, 1500);
}

// Update Calibration Display
function updateCalibrationDisplay() {
  const calibrationData = document.getElementById('calibration-data');
  const calibrationStatus = document.getElementById('calibration-status');
  const nextCalibration = document.getElementById('next-calibration');
  const pointsCount = document.getElementById('calibration-points-count');
  
  if (calibrationData) {
    if (valveData.calibrationPoints.length > 0) {
      calibrationData.innerHTML = valveData.calibrationPoints.map(point => 
        `<div>Input: ${point.input}% → Output: ${point.output}%</div>`
      ).join('');
    } else {
      calibrationData.innerHTML = '<div style="color: #AAA;">No calibration data available</div>';
    }
  }
  
  if (calibrationStatus) {
    calibrationStatus.textContent = valveData.calibrationDate ? 'VALID' : 'REQUIRED';
    calibrationStatus.style.color = valveData.calibrationDate ? '#4CAF50' : '#F44336';
  }
  
  if (nextCalibration) {
    if (valveData.nextCalibration) {
      const daysUntil = Math.ceil((valveData.nextCalibration - new Date()) / (1000 * 60 * 60 * 24));
      nextCalibration.textContent = daysUntil + ' days';
      nextCalibration.style.color = daysUntil < 30 ? '#F44336' : daysUntil < 60 ? '#FF9800' : '#4CAF50';
    } else {
      nextCalibration.textContent = 'Not scheduled';
    }
  }
  
  if (pointsCount) {
    pointsCount.textContent = valveData.calibrationPoints.length;
  }
}

// Fault Injection Functions
function toggleStuckValve() {
  valveData.stuckPosition = !valveData.stuckPosition;
  updateFaultStatus();
  updateValvePosition();
  
  const btn = document.getElementById('stuck-valve-btn');
  if (btn) {
    btn.style.background = valveData.stuckPosition ? '#F44336' : '#666';
    btn.textContent = valveData.stuckPosition ? 'Unstick Valve' : 'Stuck Valve';
  }
  
  showNotification(valveData.stuckPosition ? 'Valve stuck at 50%' : 'Valve unstuck', 'info');
}

function toggleHeatBuildup() {
  valveData.heatBuildup = !valveData.heatBuildup;
  updateFaultStatus();
  
  const btn = document.getElementById('heat-buildup-btn');
  if (btn) {
    btn.style.background = valveData.heatBuildup ? '#F44336' : '#666';
    btn.textContent = valveData.heatBuildup ? 'Cool Valve' : 'Heat Buildup';
  }
  
  showNotification(valveData.heatBuildup ? 'Heat buildup detected' : 'Heat buildup cleared', 'warning');
}

function toggleActuatorFault() {
  valveData.actuatorFault = !valveData.actuatorFault;
  updateFaultStatus();
  updateValvePosition();
  
  const btn = document.getElementById('actuator-fault-btn');
  if (btn) {
    btn.style.background = valveData.actuatorFault ? '#F44336' : '#666';
    btn.textContent = valveData.actuatorFault ? 'Fix Actuator' : 'Actuator Fault';
  }
  
  showNotification(valveData.actuatorFault ? 'Actuator fault detected' : 'Actuator fault cleared', 'info');
}

function injectSensorDrift() {
  valveData.sensorDrift = Math.random() * 10 - 5; // -5% to +5%
  updateFaultStatus();
  updateValvePosition();
  
  showNotification(`Sensor drift injected: ${valveData.sensorDrift.toFixed(1)}%`, 'warning');
}

function clearValveFaults() {
  valveData.stuckPosition = false;
  valveData.heatBuildup = false;
  valveData.actuatorFault = false;
  valveData.sensorDrift = 0;
  
  updateFaultStatus();
  updateValvePosition();
  
  // Reset button styles
  document.getElementById('stuck-valve-btn').style.background = '#666';
  document.getElementById('stuck-valve-btn').textContent = 'Stuck Valve';
  document.getElementById('heat-buildup-btn').style.background = '#666';
  document.getElementById('heat-buildup-btn').textContent = 'Heat Buildup';
  document.getElementById('actuator-fault-btn').style.background = '#666';
  document.getElementById('actuator-fault-btn').textContent = 'Actuator Fault';
  
  showNotification('All valve faults cleared', 'success');
}

// Update Fault Status
function updateFaultStatus() {
  const stuckStatus = document.getElementById('stuck-status');
  const heatStatus = document.getElementById('heat-status');
  const actuatorStatus = document.getElementById('actuator-status');
  const driftStatus = document.getElementById('drift-status');
  
  if (stuckStatus) {
    stuckStatus.textContent = valveData.stuckPosition ? 'YES' : 'NO';
    stuckStatus.style.color = valveData.stuckPosition ? '#F44336' : '#4CAF50';
  }
  
  if (heatStatus) {
    heatStatus.textContent = valveData.heatBuildup ? 'YES' : 'NO';
    heatStatus.style.color = valveData.heatBuildup ? '#F44336' : '#4CAF50';
  }
  
  if (actuatorStatus) {
    actuatorStatus.textContent = valveData.actuatorFault ? 'YES' : 'NO';
    actuatorStatus.style.color = valveData.actuatorFault ? '#F44336' : '#4CAF50';
  }
  
  if (driftStatus) {
    driftStatus.textContent = valveData.sensorDrift.toFixed(1) + '%';
    driftStatus.style.color = Math.abs(valveData.sensorDrift) > 2 ? '#F44336' : '#4CAF50';
  }
}

// Start Valve Monitoring
function startValveMonitoring() {
  if (valveData.simulationInterval) {
    clearInterval(valveData.simulationInterval);
  }
  
  valveData.simulationInterval = setInterval(() => {
    // Update temperature based on conditions
    if (valveData.heatBuildup) {
      valveData.temperature = Math.min(80, valveData.temperature + 0.5);
    } else {
      valveData.temperature = Math.max(25, valveData.temperature - 0.2);
    }
    
    // Update temperature display
    const tempDisplay = document.getElementById('valve-temperature-display');
    if (tempDisplay) {
      tempDisplay.textContent = Math.round(valveData.temperature) + '°C';
      tempDisplay.style.color = valveData.temperature > 60 ? '#F44336' : valveData.temperature > 40 ? '#FF9800' : '#F44336';
    }
  }, 1000);
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

// Export functions for global access
window.initializeValveSimulation = initializeValveSimulation;
window.valveData = valveData; 