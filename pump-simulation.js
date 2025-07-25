// Pump Simulation System
// Industrial Maintenance Training - Worksheet 6

// Pump System State
let pumpData = {
  // Pump Status
  pumpStatus: 'stopped',
  pumpSpeed: 0, // RPM
  pwmDemand: 0, // 0-100%
  actualFlow: 0, // L/min
  
  // Protection Systems
  dryRunProtection: {
    enabled: true,
    tankLevel: 80, // %
    tripLevel: 20, // %
    tripped: false
  },
  
  // System Conditions
  tankLevel: 80, // %
  outletPressure: 1.2, // bar
  inletPressure: 1.0, // bar
  motorCurrent: 0, // A
  motorTemperature: 25, // °C
  
  // Fault Conditions
  blockedOutlet: false,
  pumpWear: 0, // 0-100%
  bearingWear: 0, // 0-100%
  sealLeak: false,
  
  // Performance Metrics
  efficiency: 85, // %
  vibration: 0.5, // mm/s
  noise: 65, // dB
  
  // Simulation Control
  autoMode: false,
  simulationInterval: null,
  faultInjectionInterval: null
};

// Initialize Pump Simulation
function initializePumpSimulation() {
  console.log('Initializing Pump simulation...');
  
  initializePumpDisplay();
  initializePumpControls();
  initializeProtectionSystem();
  initializeFaultInjection();
  startPumpMonitoring();
  
  console.log('Pump simulation initialized');
}

// Initialize Pump Display
function initializePumpDisplay() {
  const container = document.getElementById('pump-display-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="pump-interface" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-tachometer-alt"></i> Pump System Monitor
      </h4>
      
      <!-- Pump Status -->
      <div class="pump-status" style="background: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div class="status-card" style="text-align: center; padding: 15px; background: #222; border-radius: 5px;">
            <div id="pump-status-display" style="color: #F44336; font-size: 24px; font-weight: bold;">STOPPED</div>
            <div style="color: #AAA; font-size: 12px;">Pump Status</div>
          </div>
          <div class="status-card" style="text-align: center; padding: 15px; background: #222; border-radius: 5px;">
            <div id="pump-speed-display" style="color: #4CAF50; font-size: 24px; font-weight: bold;">0 RPM</div>
            <div style="color: #AAA; font-size: 12px;">Pump Speed</div>
          </div>
          <div class="status-card" style="text-align: center; padding: 15px; background: #222; border-radius: 5px;">
            <div id="flow-rate-display" style="color: #2196F3; font-size: 24px; font-weight: bold;">0 L/min</div>
            <div style="color: #AAA; font-size: 12px;">Flow Rate</div>
          </div>
          <div class="status-card" style="text-align: center; padding: 15px; background: #222; border-radius: 5px;">
            <div id="motor-current-display" style="color: #FF9800; font-size: 24px; font-weight: bold;">0 A</div>
            <div style="color: #AAA; font-size: 12px;">Motor Current</div>
          </div>
        </div>
      </div>
      
      <!-- Tank Level Visualization -->
      <div class="tank-visualization" style="background: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Tank Level</h5>
        <div style="display: flex; align-items: center; gap: 20px;">
          <div class="tank" style="width: 60px; height: 200px; background: #222; border: 2px solid #555; border-radius: 5px; position: relative; overflow: hidden;">
            <div id="tank-level-fill" style="position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, #2196F3, #64B5F6); transition: height 0.5s ease;" style="height: 80%;"></div>
            <div class="tank-level-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #FFFFFF; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);" id="tank-level-text">80%</div>
          </div>
          <div class="tank-info" style="flex: 1;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <span style="color: #AAA; font-size: 12px;">Current Level:</span>
                <div id="tank-level-value" style="color: #2196F3; font-weight: bold;">80%</div>
              </div>
              <div>
                <span style="color: #AAA; font-size: 12px;">Dry Run Trip:</span>
                <div style="color: #F44336; font-weight: bold;">20%</div>
              </div>
              <div>
                <span style="color: #AAA; font-size: 12px;">Inlet Pressure:</span>
                <div id="inlet-pressure-display" style="color: #4CAF50; font-weight: bold;">1.0 bar</div>
              </div>
              <div>
                <span style="color: #AAA; font-size: 12px;">Outlet Pressure:</span>
                <div id="outlet-pressure-display" style="color: #FF9800; font-weight: bold;">1.2 bar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Performance Metrics -->
      <div class="performance-metrics" style="background: #333; padding: 20px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Performance Metrics</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="efficiency-display" style="color: #4CAF50; font-size: 18px; font-weight: bold;">85%</div>
            <div style="color: #AAA; font-size: 12px;">Efficiency</div>
          </div>
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="vibration-display" style="color: #FF9800; font-size: 18px; font-weight: bold;">0.5 mm/s</div>
            <div style="color: #AAA; font-size: 12px;">Vibration</div>
          </div>
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="noise-display" style="color: #9C27B0; font-size: 18px; font-weight: bold;">65 dB</div>
            <div style="color: #AAA; font-size: 12px;">Noise Level</div>
          </div>
          <div class="metric-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="temperature-display" style="color: #F44336; font-size: 18px; font-weight: bold;">25°C</div>
            <div style="color: #AAA; font-size: 12px;">Motor Temp</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  updatePumpDisplay();
}

// Initialize Pump Controls
function initializePumpControls() {
  const container = document.getElementById('pump-control-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="pump-controls" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-cogs"></i> Pump Control Panel
      </h4>
      
      <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <!-- Pump Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Pump Control</h5>
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button id="pump-start-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; flex: 1;">
              <i class="fas fa-play"></i> START
            </button>
            <button id="pump-stop-btn" style="background: #F44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; flex: 1;">
              <i class="fas fa-stop"></i> STOP
            </button>
          </div>
          <div style="color: #FFFFFF; font-size: 12px;">
            Status: <span id="pump-control-status" style="color: #FF9800; font-weight: bold;">STOPPED</span>
          </div>
        </div>
        
        <!-- PWM Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">PWM Speed Control</h5>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">PWM Demand (%)</label>
            <input type="range" id="pwm-demand-slider" min="0" max="100" value="0" style="width: 100%; margin: 5px 0;">
            <span id="pwm-demand-value" style="color: #4CAF50; font-size: 14px; font-weight: bold;">0%</span>
          </div>
          <div style="color: #AAA; font-size: 11px;">
            Actual Speed: <span id="actual-speed-display" style="color: #2196F3;">0 RPM</span>
          </div>
        </div>
        
        <!-- Tank Level Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Tank Level Control</h5>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">Tank Level (%)</label>
            <input type="range" id="tank-level-slider" min="0" max="100" value="80" style="width: 100%; margin: 5px 0;">
            <span id="tank-level-slider-value" style="color: #2196F3; font-size: 14px; font-weight: bold;">80%</span>
          </div>
          <div style="color: #AAA; font-size: 11px;">
            Dry Run Protection: <span id="dry-run-status" style="color: #4CAF50;">ENABLED</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  addPumpControlEventListeners();
}

// Initialize Protection System
function initializeProtectionSystem() {
  const container = document.getElementById('pump-protection-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="protection-system" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-shield-alt"></i> Protection Systems
      </h4>
      
      <div class="protection-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div class="protection-card" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Dry Run Protection</h5>
          <div style="color: #AAA; font-size: 12px; margin-bottom: 5px;">Status: <span id="dry-run-protection-status" style="color: #4CAF50;">ACTIVE</span></div>
          <div style="color: #AAA; font-size: 12px; margin-bottom: 5px;">Trip Level: 20%</div>
          <div style="color: #AAA; font-size: 12px;">Current Level: <span id="current-tank-level" style="color: #2196F3;">80%</span></div>
        </div>
        
        <div class="protection-card" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid #FF9800;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Overload Protection</h5>
          <div style="color: #AAA; font-size: 12px; margin-bottom: 5px;">Status: <span id="overload-protection-status" style="color: #4CAF50;">ACTIVE</span></div>
          <div style="color: #AAA; font-size: 12px; margin-bottom: 5px;">Trip Current: 15A</div>
          <div style="color: #AAA; font-size: 12px;">Current: <span id="current-motor-current" style="color: #FF9800;">0A</span></div>
        </div>
        
        <div class="protection-card" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid #9C27B0;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Temperature Protection</h5>
          <div style="color: #AAA; font-size: 12px; margin-bottom: 5px;">Status: <span id="temp-protection-status" style="color: #4CAF50;">ACTIVE</span></div>
          <div style="color: #AAA; font-size: 12px; margin-bottom: 5px;">Trip Temp: 80°C</div>
          <div style="color: #AAA; font-size: 12px;">Current: <span id="current-motor-temp" style="color: #F44336;">25°C</span></div>
        </div>
      </div>
      
      <!-- Protection Alarms -->
      <div class="protection-alarms" style="background: #333; padding: 15px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Protection Alarms</h5>
        <div id="protection-alarms-list" style="min-height: 50px;">
          <div style="color: #AAA; font-size: 12px; text-align: center;">No active protection alarms</div>
        </div>
      </div>
    </div>
  `;
  
  updateProtectionDisplay();
}

// Initialize Fault Injection
function initializeFaultInjection() {
  const container = document.getElementById('pump-fault-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="fault-injection" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle"></i> Fault Injection
      </h4>
      
      <div class="fault-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <button id="block-outlet-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Block Outlet
        </button>
        <button id="simulate-wear-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Simulate Wear
        </button>
        <button id="seal-leak-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Seal Leak
        </button>
        <button id="clear-faults-btn" class="fault-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Clear Faults
        </button>
      </div>
      
      <!-- Fault Status -->
      <div class="fault-status" style="background: #333; padding: 15px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Fault Status</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
          <div>
            <span style="color: #AAA; font-size: 12px;">Blocked Outlet:</span>
            <div id="blocked-outlet-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Pump Wear:</span>
            <div id="pump-wear-status" style="color: #4CAF50; font-weight: bold;">0%</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Bearing Wear:</span>
            <div id="bearing-wear-status" style="color: #4CAF50; font-weight: bold;">0%</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Seal Leak:</span>
            <div id="seal-leak-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add fault injection event listeners
  addFaultInjectionEventListeners();
}

// Add Pump Control Event Listeners
function addPumpControlEventListeners() {
  // Pump start/stop buttons
  document.getElementById('pump-start-btn')?.addEventListener('click', startPump);
  document.getElementById('pump-stop-btn')?.addEventListener('click', stopPump);
  
  // PWM demand slider
  const pwmSlider = document.getElementById('pwm-demand-slider');
  const pwmValue = document.getElementById('pwm-demand-value');
  if (pwmSlider && pwmValue) {
    pwmSlider.addEventListener('input', function() {
      const value = this.value;
      pwmValue.textContent = value + '%';
      pumpData.pwmDemand = parseInt(value);
      updatePumpSpeed();
    });
  }
  
  // Tank level slider
  const tankSlider = document.getElementById('tank-level-slider');
  const tankValue = document.getElementById('tank-level-slider-value');
  if (tankSlider && tankValue) {
    tankSlider.addEventListener('input', function() {
      const value = this.value;
      tankValue.textContent = value + '%';
      pumpData.tankLevel = parseInt(value);
      updateTankLevel();
    });
  }
}

// Add Fault Injection Event Listeners
function addFaultInjectionEventListeners() {
  document.getElementById('block-outlet-btn')?.addEventListener('click', toggleBlockedOutlet);
  document.getElementById('simulate-wear-btn')?.addEventListener('click', simulateWear);
  document.getElementById('seal-leak-btn')?.addEventListener('click', toggleSealLeak);
  document.getElementById('clear-faults-btn')?.addEventListener('click', clearAllFaults);
}

// Start Pump
function startPump() {
  if (pumpData.dryRunProtection.tripped) {
    showNotification('Cannot start pump - dry run protection tripped', 'error');
    return;
  }
  
  pumpData.pumpStatus = 'running';
  updatePumpDisplay();
  updatePumpSpeed();
  
  showNotification('Pump started successfully', 'success');
}

// Stop Pump
function stopPump() {
  pumpData.pumpStatus = 'stopped';
  pumpData.pumpSpeed = 0;
  pumpData.actualFlow = 0;
  pumpData.motorCurrent = 0;
  
  updatePumpDisplay();
  
  showNotification('Pump stopped', 'info');
}

// Update Pump Speed
function updatePumpSpeed() {
  if (pumpData.pumpStatus === 'running') {
    // Calculate pump speed based on PWM demand and conditions
    let baseSpeed = (pumpData.pwmDemand / 100) * 1750; // Max RPM
    
    // Apply wear effects
    const wearFactor = 1 - (pumpData.pumpWear / 100) * 0.3;
    baseSpeed *= wearFactor;
    
    // Apply blocked outlet effects
    if (pumpData.blockedOutlet) {
      baseSpeed *= 0.8; // Reduced speed due to backpressure
    }
    
    pumpData.pumpSpeed = Math.round(baseSpeed);
    
    // Calculate flow rate
    updateFlowRate();
    
    // Calculate motor current
    updateMotorCurrent();
  }
  
  updatePumpDisplay();
}

// Update Flow Rate
function updateFlowRate() {
  let baseFlow = (pumpData.pumpSpeed / 1750) * 100; // Max flow 100 L/min
  
  // Apply wear effects
  const wearFactor = 1 - (pumpData.pumpWear / 100) * 0.4;
  baseFlow *= wearFactor;
  
  // Apply blocked outlet effects
  if (pumpData.blockedOutlet) {
    baseFlow *= 0.1; // Minimal flow when blocked
  }
  
  // Apply tank level effects
  if (pumpData.tankLevel < 30) {
    baseFlow *= 0.5; // Reduced flow at low levels
  }
  
  pumpData.actualFlow = Math.round(baseFlow * 10) / 10;
}

// Update Motor Current
function updateMotorCurrent() {
  let baseCurrent = (pumpData.pumpSpeed / 1750) * 10; // Max current 10A
  
  // Apply wear effects
  const wearFactor = 1 + (pumpData.pumpWear / 100) * 0.5;
  baseCurrent *= wearFactor;
  
  // Apply blocked outlet effects
  if (pumpData.blockedOutlet) {
    baseCurrent *= 1.5; // Higher current when blocked
  }
  
  // Apply seal leak effects
  if (pumpData.sealLeak) {
    baseCurrent *= 1.2; // Higher current due to seal leak
  }
  
  pumpData.motorCurrent = Math.round(baseCurrent * 10) / 10;
}

// Update Tank Level
function updateTankLevel() {
  const tankFill = document.getElementById('tank-level-fill');
  const tankText = document.getElementById('tank-level-text');
  const tankValue = document.getElementById('tank-level-value');
  
  if (tankFill) tankFill.style.height = pumpData.tankLevel + '%';
  if (tankText) tankText.textContent = pumpData.tankLevel + '%';
  if (tankValue) tankValue.textContent = pumpData.tankLevel + '%';
  
  // Check dry run protection
  checkDryRunProtection();
  
  updateProtectionDisplay();
}

// Check Dry Run Protection
function checkDryRunProtection() {
  if (pumpData.tankLevel <= pumpData.dryRunProtection.tripLevel) {
    pumpData.dryRunProtection.tripped = true;
    if (pumpData.pumpStatus === 'running') {
      stopPump();
      showNotification('Pump stopped - dry run protection tripped', 'warning');
    }
  } else {
    pumpData.dryRunProtection.tripped = false;
  }
}

// Toggle Blocked Outlet
function toggleBlockedOutlet() {
  pumpData.blockedOutlet = !pumpData.blockedOutlet;
  updateFaultStatus();
  updatePumpSpeed();
  
  const btn = document.getElementById('block-outlet-btn');
  if (btn) {
    btn.style.background = pumpData.blockedOutlet ? '#F44336' : '#666';
    btn.textContent = pumpData.blockedOutlet ? 'Unblock Outlet' : 'Block Outlet';
  }
  
  showNotification(pumpData.blockedOutlet ? 'Outlet blocked' : 'Outlet unblocked', 'info');
}

// Simulate Wear
function simulateWear() {
  pumpData.pumpWear = Math.min(100, pumpData.pumpWear + 20);
  pumpData.bearingWear = Math.min(100, pumpData.bearingWear + 15);
  
  updateFaultStatus();
  updatePumpSpeed();
  
  showNotification(`Wear simulated - Pump: ${pumpData.pumpWear}%, Bearings: ${pumpData.bearingWear}%`, 'warning');
}

// Toggle Seal Leak
function toggleSealLeak() {
  pumpData.sealLeak = !pumpData.sealLeak;
  updateFaultStatus();
  updatePumpSpeed();
  
  const btn = document.getElementById('seal-leak-btn');
  if (btn) {
    btn.style.background = pumpData.sealLeak ? '#F44336' : '#666';
    btn.textContent = pumpData.sealLeak ? 'Fix Seal' : 'Seal Leak';
  }
  
  showNotification(pumpData.sealLeak ? 'Seal leak simulated' : 'Seal leak fixed', 'info');
}

// Clear All Faults
function clearAllFaults() {
  pumpData.blockedOutlet = false;
  pumpData.pumpWear = 0;
  pumpData.bearingWear = 0;
  pumpData.sealLeak = false;
  
  updateFaultStatus();
  updatePumpSpeed();
  
  // Reset button styles
  document.getElementById('block-outlet-btn').style.background = '#666';
  document.getElementById('block-outlet-btn').textContent = 'Block Outlet';
  document.getElementById('seal-leak-btn').style.background = '#666';
  document.getElementById('seal-leak-btn').textContent = 'Seal Leak';
  
  showNotification('All faults cleared', 'success');
}

// Update Pump Display
function updatePumpDisplay() {
  // Update status displays
  const statusDisplay = document.getElementById('pump-status-display');
  const speedDisplay = document.getElementById('pump-speed-display');
  const flowDisplay = document.getElementById('flow-rate-display');
  const currentDisplay = document.getElementById('motor-current-display');
  const controlStatus = document.getElementById('pump-control-status');
  const actualSpeed = document.getElementById('actual-speed-display');
  
  if (statusDisplay) {
    statusDisplay.textContent = pumpData.pumpStatus.toUpperCase();
    statusDisplay.style.color = pumpData.pumpStatus === 'running' ? '#4CAF50' : '#F44336';
  }
  
  if (speedDisplay) speedDisplay.textContent = pumpData.pumpSpeed + ' RPM';
  if (flowDisplay) flowDisplay.textContent = pumpData.actualFlow + ' L/min';
  if (currentDisplay) currentDisplay.textContent = pumpData.motorCurrent + ' A';
  if (controlStatus) {
    controlStatus.textContent = pumpData.pumpStatus.toUpperCase();
    controlStatus.style.color = pumpData.pumpStatus === 'running' ? '#4CAF50' : '#F44336';
  }
  if (actualSpeed) actualSpeed.textContent = pumpData.pumpSpeed + ' RPM';
  
  // Update performance metrics
  updatePerformanceMetrics();
}

// Update Performance Metrics
function updatePerformanceMetrics() {
  // Calculate efficiency based on conditions
  let efficiency = 85;
  if (pumpData.pumpWear > 0) efficiency -= pumpData.pumpWear * 0.3;
  if (pumpData.blockedOutlet) efficiency -= 20;
  if (pumpData.sealLeak) efficiency -= 10;
  
  // Calculate vibration based on wear
  let vibration = 0.5 + (pumpData.bearingWear / 100) * 2;
  
  // Calculate noise based on speed and wear
  let noise = 65 + (pumpData.pumpSpeed / 1750) * 20 + (pumpData.bearingWear / 100) * 10;
  
  // Calculate temperature based on current and conditions
  let temperature = 25 + (pumpData.motorCurrent / 10) * 30;
  if (pumpData.sealLeak) temperature += 10;
  
  // Update displays
  const efficiencyDisplay = document.getElementById('efficiency-display');
  const vibrationDisplay = document.getElementById('vibration-display');
  const noiseDisplay = document.getElementById('noise-display');
  const temperatureDisplay = document.getElementById('temperature-display');
  
  if (efficiencyDisplay) efficiencyDisplay.textContent = Math.round(efficiency) + '%';
  if (vibrationDisplay) vibrationDisplay.textContent = vibration.toFixed(1) + ' mm/s';
  if (noiseDisplay) noiseDisplay.textContent = Math.round(noise) + ' dB';
  if (temperatureDisplay) temperatureDisplay.textContent = Math.round(temperature) + '°C';
  
  // Update motor temperature in data
  pumpData.motorTemperature = Math.round(temperature);
}

// Update Protection Display
function updateProtectionDisplay() {
  const dryRunStatus = document.getElementById('dry-run-protection-status');
  const overloadStatus = document.getElementById('overload-protection-status');
  const tempStatus = document.getElementById('temp-protection-status');
  const currentTankLevel = document.getElementById('current-tank-level');
  const currentMotorCurrent = document.getElementById('current-motor-current');
  const currentMotorTemp = document.getElementById('current-motor-temp');
  
  if (dryRunStatus) {
    dryRunStatus.textContent = pumpData.dryRunProtection.tripped ? 'TRIPPED' : 'ACTIVE';
    dryRunStatus.style.color = pumpData.dryRunProtection.tripped ? '#F44336' : '#4CAF50';
  }
  
  if (overloadStatus) {
    const overloaded = pumpData.motorCurrent > 15;
    overloadStatus.textContent = overloaded ? 'TRIPPED' : 'ACTIVE';
    overloadStatus.style.color = overloaded ? '#F44336' : '#4CAF50';
  }
  
  if (tempStatus) {
    const overheated = pumpData.motorTemperature > 80;
    tempStatus.textContent = overheated ? 'TRIPPED' : 'ACTIVE';
    tempStatus.style.color = overheated ? '#F44336' : '#4CAF50';
  }
  
  if (currentTankLevel) currentTankLevel.textContent = pumpData.tankLevel + '%';
  if (currentMotorCurrent) currentMotorCurrent.textContent = pumpData.motorCurrent + 'A';
  if (currentMotorTemp) currentMotorTemp.textContent = pumpData.motorTemperature + '°C';
  
  updateProtectionAlarms();
}

// Update Protection Alarms
function updateProtectionAlarms() {
  const alarmsList = document.getElementById('protection-alarms-list');
  if (!alarmsList) return;
  
  const alarms = [];
  
  if (pumpData.dryRunProtection.tripped) {
    alarms.push('Dry Run Protection Tripped');
  }
  
  if (pumpData.motorCurrent > 15) {
    alarms.push('Overload Protection Tripped');
  }
  
  if (pumpData.motorTemperature > 80) {
    alarms.push('Temperature Protection Tripped');
  }
  
  if (alarms.length === 0) {
    alarmsList.innerHTML = '<div style="color: #AAA; font-size: 12px; text-align: center;">No active protection alarms</div>';
  } else {
    alarmsList.innerHTML = alarms.map(alarm => 
      `<div style="color: #F44336; font-size: 12px; margin-bottom: 5px;">⚠ ${alarm}</div>`
    ).join('');
  }
}

// Update Fault Status
function updateFaultStatus() {
  const blockedStatus = document.getElementById('blocked-outlet-status');
  const wearStatus = document.getElementById('pump-wear-status');
  const bearingStatus = document.getElementById('bearing-wear-status');
  const sealStatus = document.getElementById('seal-leak-status');
  
  if (blockedStatus) {
    blockedStatus.textContent = pumpData.blockedOutlet ? 'YES' : 'NO';
    blockedStatus.style.color = pumpData.blockedOutlet ? '#F44336' : '#4CAF50';
  }
  
  if (wearStatus) {
    wearStatus.textContent = pumpData.pumpWear + '%';
    wearStatus.style.color = pumpData.pumpWear > 50 ? '#F44336' : pumpData.pumpWear > 20 ? '#FF9800' : '#4CAF50';
  }
  
  if (bearingStatus) {
    bearingStatus.textContent = pumpData.bearingWear + '%';
    bearingStatus.style.color = pumpData.bearingWear > 50 ? '#F44336' : pumpData.bearingWear > 20 ? '#FF9800' : '#4CAF50';
  }
  
  if (sealStatus) {
    sealStatus.textContent = pumpData.sealLeak ? 'YES' : 'NO';
    sealStatus.style.color = pumpData.sealLeak ? '#F44336' : '#4CAF50';
  }
}

// Start Pump Monitoring
function startPumpMonitoring() {
  if (pumpData.simulationInterval) {
    clearInterval(pumpData.simulationInterval);
  }
  
  pumpData.simulationInterval = setInterval(() => {
    if (pumpData.pumpStatus === 'running') {
      // Update pressures
      pumpData.outletPressure = 1.0 + (pumpData.pumpSpeed / 1750) * 0.5;
      if (pumpData.blockedOutlet) {
        pumpData.outletPressure = 2.5; // High pressure when blocked
      }
      
      // Update inlet pressure
      pumpData.inletPressure = 1.0 - (pumpData.tankLevel / 100) * 0.3;
      
      // Update displays
      const inletDisplay = document.getElementById('inlet-pressure-display');
      const outletDisplay = document.getElementById('outlet-pressure-display');
      
      if (inletDisplay) inletDisplay.textContent = pumpData.inletPressure.toFixed(1) + ' bar';
      if (outletDisplay) outletDisplay.textContent = pumpData.outletPressure.toFixed(1) + ' bar';
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
window.initializePumpSimulation = initializePumpSimulation;
window.pumpData = pumpData; 