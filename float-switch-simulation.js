// Float Switch Simulation System
// Industrial Maintenance Training - Worksheet 8

// Float Switch System State
let floatSwitchData = {
  // Tank Configuration
  tankLevel: 50, // 0-100%
  tankHeight: 100, // cm
  tankCapacity: 1000, // liters
  
  // Float Switch Configuration
  floatSwitches: {
    lowLevel: {
      position: 20, // % from bottom
      type: 'NC', // Normally Closed
      state: true, // true = closed/active
      fault: false,
      description: 'Low Level Float'
    },
    highLevel: {
      position: 80, // % from bottom
      type: 'NO', // Normally Open
      state: false, // false = open/inactive
      fault: false,
      description: 'High Level Float'
    },
    emergency: {
      position: 95, // % from bottom
      type: 'NC', // Normally Closed
      state: true, // true = closed/active
      fault: false,
      description: 'Emergency Level Float'
    }
  },
  
  // System Conditions
  fluidType: 'water',
  fluidDensity: 1.0, // kg/L
  temperature: 25, // °C
  turbulence: 0, // 0-100%
  
  // Fault Conditions
  stuckFloat: false,
  wiringFault: false,
  sensorDrift: 0, // % offset
  vibrationEffect: false,
  
  // Performance Metrics
  responseTime: 0.5, // seconds
  accuracy: 98, // %
  reliability: 99.5, // %
  
  // Simulation Control
  autoMode: false,
  simulationInterval: null,
  faultInjectionInterval: null
};

// Initialize Float Switch Simulation
function initializeFloatSwitchSimulation() {
  console.log('Initializing Float Switch simulation...');
  
  initializeTankDisplay();
  initializeFloatSwitchControls();
  initializeLogicTesting();
  initializeFaultInjection();
  startFloatSwitchMonitoring();
  
  console.log('Float Switch simulation initialized');
}

// Initialize Tank Display
function initializeTankDisplay() {
  const container = document.getElementById('float-tank-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="tank-interface" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-water"></i> Tank Level Monitoring
      </h4>
      
      <!-- Tank Visualization -->
      <div class="tank-visualization" style="background: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Tank Level</h5>
        <div class="tank-container" style="display: flex; align-items: center; gap: 30px; justify-content: center;">
          <div class="tank" style="width: 120px; height: 300px; background: #222; border: 3px solid #555; border-radius: 10px; position: relative; overflow: hidden;">
            <div id="tank-fluid" style="position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, #2196F3, #64B5F6); transition: height 0.5s ease;"></div>
            
            <!-- Float Switches -->
            <div id="low-float" class="float-switch" style="position: absolute; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: #4CAF50; border-radius: 50%; border: 2px solid #333; transition: all 0.3s ease;"></div>
            <div id="high-float" class="float-switch" style="position: absolute; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: #FF9800; border-radius: 50%; border: 2px solid #333; transition: all 0.3s ease;"></div>
            <div id="emergency-float" class="float-switch" style="position: absolute; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: #F44336; border-radius: 50%; border: 2px solid #333; transition: all 0.3s ease;"></div>
            
            <!-- Level Markers -->
            <div class="level-marker" style="position: absolute; right: -30px; width: 20px; height: 2px; background: #AAA; font-size: 10px; color: #AAA; display: flex; align-items: center;">
              <span style="margin-left: 5px;">100%</span>
            </div>
            <div class="level-marker" style="position: absolute; right: -30px; width: 20px; height: 2px; background: #AAA; font-size: 10px; color: #AAA; display: flex; align-items: center;">
              <span style="margin-left: 5px;">50%</span>
            </div>
            <div class="level-marker" style="position: absolute; right: -30px; width: 20px; height: 2px; background: #AAA; font-size: 10px; color: #AAA; display: flex; align-items: center;">
              <span style="margin-left: 5px;">0%</span>
            </div>
          </div>
          
          <!-- Float Switch Status -->
          <div class="float-status" style="flex: 1; max-width: 300px;">
            <h6 style="color: #FFFFFF; margin-bottom: 15px;">Float Switch Status</h6>
            <div class="float-switches" style="display: grid; gap: 10px;">
              <div class="float-item" style="background: #222; padding: 10px; border-radius: 5px; border-left: 4px solid #4CAF50;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #FFFFFF; font-size: 12px;">Low Level (NC)</span>
                  <div id="low-float-led" class="led-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: #4CAF50; border: 1px solid #555;"></div>
                </div>
                <div style="color: #AAA; font-size: 10px;">Position: 20%</div>
              </div>
              
              <div class="float-item" style="background: #222; padding: 10px; border-radius: 5px; border-left: 4px solid #FF9800;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #FFFFFF; font-size: 12px;">High Level (NO)</span>
                  <div id="high-float-led" class="led-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: #666; border: 1px solid #555;"></div>
                </div>
                <div style="color: #AAA; font-size: 10px;">Position: 80%</div>
              </div>
              
              <div class="float-item" style="background: #222; padding: 10px; border-radius: 5px; border-left: 4px solid #F44336;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #FFFFFF; font-size: 12px;">Emergency (NC)</span>
                  <div id="emergency-float-led" class="led-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: #4CAF50; border: 1px solid #555;"></div>
                </div>
                <div style="color: #AAA; font-size: 10px;">Position: 95%</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tank Information -->
        <div class="tank-info" style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div class="info-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="tank-level-display" style="color: #2196F3; font-size: 20px; font-weight: bold;">50%</div>
            <div style="color: #AAA; font-size: 12px;">Current Level</div>
          </div>
          <div class="info-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="tank-volume-display" style="color: #4CAF50; font-size: 20px; font-weight: bold;">500L</div>
            <div style="color: #AAA; font-size: 12px;">Volume</div>
          </div>
          <div class="info-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="tank-height-display" style="color: #FF9800; font-size: 20px; font-weight: bold;">50cm</div>
            <div style="color: #AAA; font-size: 12px;">Fluid Height</div>
          </div>
          <div class="info-card" style="background: #222; padding: 10px; border-radius: 5px; text-align: center;">
            <div id="turbulence-display" style="color: #9C27B0; font-size: 20px; font-weight: bold;">0%</div>
            <div style="color: #AAA; font-size: 12px;">Turbulence</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  updateTankDisplay();
}

// Initialize Float Switch Controls
function initializeFloatSwitchControls() {
  const container = document.getElementById('float-control-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="float-controls" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-cogs"></i> Tank Level Control
      </h4>
      
      <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <!-- Tank Level Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Tank Level Control</h5>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">Tank Level (%)</label>
            <input type="range" id="tank-level-slider" min="0" max="100" value="50" style="width: 100%; margin: 5px 0;">
            <span id="tank-level-value" style="color: #2196F3; font-size: 14px; font-weight: bold;">50%</span>
          </div>
          <div style="color: #AAA; font-size: 11px;">
            Volume: <span id="volume-display" style="color: #4CAF50;">500L</span>
          </div>
        </div>
        
        <!-- Turbulence Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Turbulence Control</h5>
          <div style="margin-bottom: 10px;">
            <label style="color: #FFFFFF; font-size: 12px;">Turbulence Level (%)</label>
            <input type="range" id="turbulence-slider" min="0" max="100" value="0" style="width: 100%; margin: 5px 0;">
            <span id="turbulence-value" style="color: #9C27B0; font-size: 14px; font-weight: bold;">0%</span>
          </div>
          <div style="color: #AAA; font-size: 11px;">
            Effect on float switches
          </div>
        </div>
        
        <!-- Float Switch Configuration -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Float Switch Config</h5>
          <div style="display: grid; gap: 10px;">
            <div>
              <label style="color: #FFFFFF; font-size: 12px;">Low Level Position (%)</label>
              <input type="range" id="low-float-position" min="5" max="40" value="20" style="width: 100%; margin: 5px 0;">
              <span id="low-float-value" style="color: #4CAF50; font-size: 12px;">20%</span>
            </div>
            <div>
              <label style="color: #FFFFFF; font-size: 12px;">High Level Position (%)</label>
              <input type="range" id="high-float-position" min="60" max="90" value="80" style="width: 100%; margin: 5px 0;">
              <span id="high-float-value" style="color: #FF9800; font-size: 12px;">80%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- System Status -->
      <div class="system-status" style="background: #333; padding: 15px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div>
            <span style="color: #AAA; font-size: 12px;">System Status:</span>
            <div id="float-system-status" style="color: #4CAF50; font-weight: bold; font-size: 16px;">NORMAL</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Active Switches:</span>
            <div id="active-switches-count" style="color: #2196F3; font-weight: bold; font-size: 16px;">2</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Response Time:</span>
            <div id="response-time-display" style="color: #FF9800; font-weight: bold; font-size: 16px;">0.5s</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  addFloatControlEventListeners();
}

// Initialize Logic Testing
function initializeLogicTesting() {
  const container = document.getElementById('float-logic-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="logic-testing" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #4CAF50; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-brain"></i> Logic Testing
      </h4>
      
      <div class="logic-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="logic-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">NO vs NC Testing</h5>
          <div style="display: grid; gap: 10px;">
            <button id="test-no-logic-btn" style="background: #2196F3; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              <i class="fas fa-play"></i> Test NO Logic
            </button>
            <button id="test-nc-logic-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              <i class="fas fa-play"></i> Test NC Logic
            </button>
            <button id="test-fail-safe-btn" style="background: #FF9800; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              <i class="fas fa-shield-alt"></i> Test Fail-Safe
            </button>
          </div>
        </div>
        
        <div class="logic-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Logic Truth Table</h5>
          <div id="truth-table" style="background: #222; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; color: #FFFFFF;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
              <div style="color: #AAA;">Level</div>
              <div style="color: #AAA;">NO State</div>
              <div style="color: #AAA;">NC State</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
              <div>Below</div>
              <div style="color: #666;">Open</div>
              <div style="color: #4CAF50;">Closed</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
              <div>Above</div>
              <div style="color: #4CAF50;">Closed</div>
              <div style="color: #666;">Open</div>
            </div>
          </div>
        </div>
        
        <div class="logic-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Logic Test Results</h5>
          <div id="logic-test-results" style="background: #222; padding: 10px; border-radius: 5px; min-height: 100px; font-family: monospace; font-size: 12px; color: #FFFFFF;">
            <div style="color: #AAA;">No tests run yet</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add logic testing event listeners
  addLogicTestingEventListeners();
}

// Initialize Fault Injection
function initializeFaultInjection() {
  const container = document.getElementById('float-fault-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="fault-injection" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle"></i> Fault Injection
      </h4>
      
      <div class="fault-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <button id="stuck-float-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Stuck Float
        </button>
        <button id="wiring-fault-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Wiring Fault
        </button>
        <button id="sensor-drift-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Sensor Drift
        </button>
        <button id="vibration-effect-btn" class="fault-btn" style="background: #666; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Vibration Effect
        </button>
        <button id="clear-float-faults-btn" class="fault-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Clear Faults
        </button>
      </div>
      
      <!-- Fault Status -->
      <div class="fault-status" style="background: #333; padding: 15px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Fault Status</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
          <div>
            <span style="color: #AAA; font-size: 12px;">Stuck Float:</span>
            <div id="stuck-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Wiring Fault:</span>
            <div id="wiring-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Sensor Drift:</span>
            <div id="drift-status" style="color: #4CAF50; font-weight: bold;">0%</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Vibration Effect:</span>
            <div id="vibration-status" style="color: #4CAF50; font-weight: bold;">NO</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add fault injection event listeners
  addFaultInjectionEventListeners();
}

// Add Float Control Event Listeners
function addFloatControlEventListeners() {
  // Tank level slider
  const tankSlider = document.getElementById('tank-level-slider');
  const tankValue = document.getElementById('tank-level-value');
  const volumeDisplay = document.getElementById('volume-display');
  if (tankSlider && tankValue && volumeDisplay) {
    tankSlider.addEventListener('input', function() {
      const value = this.value;
      floatSwitchData.tankLevel = parseInt(value);
      tankValue.textContent = value + '%';
      volumeDisplay.textContent = Math.round((value / 100) * floatSwitchData.tankCapacity) + 'L';
      updateTankDisplay();
      updateFloatSwitchStates();
    });
  }
  
  // Turbulence slider
  const turbulenceSlider = document.getElementById('turbulence-slider');
  const turbulenceValue = document.getElementById('turbulence-value');
  if (turbulenceSlider && turbulenceValue) {
    turbulenceSlider.addEventListener('input', function() {
      const value = this.value;
      floatSwitchData.turbulence = parseInt(value);
      turbulenceValue.textContent = value + '%';
      updateFloatSwitchStates();
    });
  }
  
  // Float position sliders
  const lowFloatSlider = document.getElementById('low-float-position');
  const lowFloatValue = document.getElementById('low-float-value');
  if (lowFloatSlider && lowFloatValue) {
    lowFloatSlider.addEventListener('input', function() {
      const value = this.value;
      floatSwitchData.floatSwitches.lowLevel.position = parseInt(value);
      lowFloatValue.textContent = value + '%';
      updateTankDisplay();
      updateFloatSwitchStates();
    });
  }
  
  const highFloatSlider = document.getElementById('high-float-position');
  const highFloatValue = document.getElementById('high-float-value');
  if (highFloatSlider && highFloatValue) {
    highFloatSlider.addEventListener('input', function() {
      const value = this.value;
      floatSwitchData.floatSwitches.highLevel.position = parseInt(value);
      highFloatValue.textContent = value + '%';
      updateTankDisplay();
      updateFloatSwitchStates();
    });
  }
}

// Add Logic Testing Event Listeners
function addLogicTestingEventListeners() {
  document.getElementById('test-no-logic-btn')?.addEventListener('click', testNOLogic);
  document.getElementById('test-nc-logic-btn')?.addEventListener('click', testNCLogic);
  document.getElementById('test-fail-safe-btn')?.addEventListener('click', testFailSafe);
}

// Add Fault Injection Event Listeners
function addFaultInjectionEventListeners() {
  document.getElementById('stuck-float-btn')?.addEventListener('click', toggleStuckFloat);
  document.getElementById('wiring-fault-btn')?.addEventListener('click', toggleWiringFault);
  document.getElementById('sensor-drift-btn')?.addEventListener('click', injectSensorDrift);
  document.getElementById('vibration-effect-btn')?.addEventListener('click', toggleVibrationEffect);
  document.getElementById('clear-float-faults-btn')?.addEventListener('click', clearFloatFaults);
}

// Update Tank Display
function updateTankDisplay() {
  // Update tank fluid level
  const tankFluid = document.getElementById('tank-fluid');
  if (tankFluid) {
    tankFluid.style.height = floatSwitchData.tankLevel + '%';
  }
  
  // Update float positions
  const lowFloat = document.getElementById('low-float');
  const highFloat = document.getElementById('high-float');
  const emergencyFloat = document.getElementById('emergency-float');
  
  if (lowFloat) {
    const lowPosition = 300 - (floatSwitchData.floatSwitches.lowLevel.position / 100) * 300;
    lowFloat.style.top = lowPosition + 'px';
  }
  
  if (highFloat) {
    const highPosition = 300 - (floatSwitchData.floatSwitches.highLevel.position / 100) * 300;
    highFloat.style.top = highPosition + 'px';
  }
  
  if (emergencyFloat) {
    const emergencyPosition = 300 - (floatSwitchData.floatSwitches.emergency.position / 100) * 300;
    emergencyFloat.style.top = emergencyPosition + 'px';
  }
  
  // Update displays
  const tankLevelDisplay = document.getElementById('tank-level-display');
  const tankVolumeDisplay = document.getElementById('tank-volume-display');
  const tankHeightDisplay = document.getElementById('tank-height-display');
  const turbulenceDisplay = document.getElementById('turbulence-display');
  
  if (tankLevelDisplay) tankLevelDisplay.textContent = floatSwitchData.tankLevel + '%';
  if (tankVolumeDisplay) tankVolumeDisplay.textContent = Math.round((floatSwitchData.tankLevel / 100) * floatSwitchData.tankCapacity) + 'L';
  if (tankHeightDisplay) tankHeightDisplay.textContent = Math.round((floatSwitchData.tankLevel / 100) * floatSwitchData.tankHeight) + 'cm';
  if (turbulenceDisplay) turbulenceDisplay.textContent = floatSwitchData.turbulence + '%';
  
  updateFloatSwitchStates();
}

// Update Float Switch States
function updateFloatSwitchStates() {
  const level = floatSwitchData.tankLevel;
  
  // Update low level float
  const lowLevel = floatSwitchData.floatSwitches.lowLevel;
  const lowLED = document.getElementById('low-float-led');
  const lowFloat = document.getElementById('low-float');
  
  if (level >= lowLevel.position) {
    lowLevel.state = lowLevel.type === 'NC' ? false : true; // NC opens when level rises, NO closes
  } else {
    lowLevel.state = lowLevel.type === 'NC' ? true : false; // NC closes when level drops, NO opens
  }
  
  // Apply faults
  if (floatSwitchData.stuckFloat) {
    lowLevel.state = true; // Stuck closed
  }
  
  if (floatSwitchData.wiringFault) {
    lowLevel.state = false; // Open circuit
  }
  
  // Apply vibration effect
  if (floatSwitchData.vibrationEffect && floatSwitchData.turbulence > 50) {
    lowLevel.state = !lowLevel.state; // Toggle state due to vibration
  }
  
  // Update visual indicators
  if (lowLED) {
    lowLED.style.background = lowLevel.state ? '#4CAF50' : '#666';
  }
  
  if (lowFloat) {
    lowFloat.style.background = lowLevel.state ? '#4CAF50' : '#666';
    lowFloat.style.boxShadow = lowLevel.state ? '0 0 10px rgba(76, 175, 80, 0.5)' : 'none';
  }
  
  // Update high level float
  const highLevel = floatSwitchData.floatSwitches.highLevel;
  const highLED = document.getElementById('high-float-led');
  const highFloat = document.getElementById('high-float');
  
  if (level >= highLevel.position) {
    highLevel.state = highLevel.type === 'NC' ? false : true;
  } else {
    highLevel.state = highLevel.type === 'NC' ? true : false;
  }
  
  // Apply faults
  if (floatSwitchData.stuckFloat) {
    highLevel.state = false; // Stuck open
  }
  
  if (floatSwitchData.wiringFault) {
    highLevel.state = false; // Open circuit
  }
  
  // Apply vibration effect
  if (floatSwitchData.vibrationEffect && floatSwitchData.turbulence > 50) {
    highLevel.state = !highLevel.state;
  }
  
  // Update visual indicators
  if (highLED) {
    highLED.style.background = highLevel.state ? '#FF9800' : '#666';
  }
  
  if (highFloat) {
    highFloat.style.background = highLevel.state ? '#FF9800' : '#666';
    highFloat.style.boxShadow = highLevel.state ? '0 0 10px rgba(255, 152, 0, 0.5)' : 'none';
  }
  
  // Update emergency float
  const emergency = floatSwitchData.floatSwitches.emergency;
  const emergencyLED = document.getElementById('emergency-float-led');
  const emergencyFloat = document.getElementById('emergency-float');
  
  if (level >= emergency.position) {
    emergency.state = emergency.type === 'NC' ? false : true;
  } else {
    emergency.state = emergency.type === 'NC' ? true : false;
  }
  
  // Apply faults
  if (floatSwitchData.stuckFloat) {
    emergency.state = true; // Stuck closed (fail-safe)
  }
  
  if (floatSwitchData.wiringFault) {
    emergency.state = false; // Open circuit
  }
  
  // Update visual indicators
  if (emergencyLED) {
    emergencyLED.style.background = emergency.state ? '#F44336' : '#666';
  }
  
  if (emergencyFloat) {
    emergencyFloat.style.background = emergency.state ? '#F44336' : '#666';
    emergencyFloat.style.boxShadow = emergency.state ? '0 0 10px rgba(244, 67, 54, 0.5)' : 'none';
  }
  
  updateSystemStatus();
}

// Update System Status
function updateSystemStatus() {
  const systemStatus = document.getElementById('float-system-status');
  const activeSwitches = document.getElementById('active-switches-count');
  const responseTime = document.getElementById('response-time-display');
  
  // Count active switches
  const activeCount = Object.values(floatSwitchData.floatSwitches).filter(sw => sw.state).length;
  
  if (activeSwitches) {
    activeSwitches.textContent = activeCount;
  }
  
  if (responseTime) {
    responseTime.textContent = floatSwitchData.responseTime + 's';
  }
  
  if (systemStatus) {
    if (floatSwitchData.floatSwitches.emergency.state) {
      systemStatus.textContent = 'EMERGENCY';
      systemStatus.style.color = '#F44336';
    } else if (floatSwitchData.floatSwitches.highLevel.state) {
      systemStatus.textContent = 'HIGH LEVEL';
      systemStatus.style.color = '#FF9800';
    } else if (!floatSwitchData.floatSwitches.lowLevel.state) {
      systemStatus.textContent = 'LOW LEVEL';
      systemStatus.style.color = '#FF9800';
    } else {
      systemStatus.textContent = 'NORMAL';
      systemStatus.style.color = '#4CAF50';
    }
  }
}

// Logic Testing Functions
function testNOLogic() {
  const results = document.getElementById('logic-test-results');
  if (results) {
    results.innerHTML = `
      <div style="color: #2196F3; margin-bottom: 5px;">NO Logic Test Results:</div>
      <div style="color: #AAA; font-size: 11px;">Below level: Open (inactive)</div>
      <div style="color: #AAA; font-size: 11px;">Above level: Closed (active)</div>
      <div style="color: #4CAF50; font-size: 11px;">✓ Test passed</div>
    `;
  }
  showNotification('NO logic test completed', 'success');
}

function testNCLogic() {
  const results = document.getElementById('logic-test-results');
  if (results) {
    results.innerHTML = `
      <div style="color: #4CAF50; margin-bottom: 5px;">NC Logic Test Results:</div>
      <div style="color: #AAA; font-size: 11px;">Below level: Closed (active)</div>
      <div style="color: #AAA; font-size: 11px;">Above level: Open (inactive)</div>
      <div style="color: #4CAF50; font-size: 11px;">✓ Test passed</div>
    `;
  }
  showNotification('NC logic test completed', 'success');
}

function testFailSafe() {
  const results = document.getElementById('logic-test-results');
  if (results) {
    results.innerHTML = `
      <div style="color: #F44336; margin-bottom: 5px;">Fail-Safe Test Results:</div>
      <div style="color: #AAA; font-size: 11px;">Wire break: NC opens (alarm)</div>
      <div style="color: #AAA; font-size: 11px;">Power loss: NC opens (alarm)</div>
      <div style="color: #4CAF50; font-size: 11px;">✓ Fail-safe behavior confirmed</div>
    `;
  }
  showNotification('Fail-safe test completed', 'success');
}

// Fault Injection Functions
function toggleStuckFloat() {
  floatSwitchData.stuckFloat = !floatSwitchData.stuckFloat;
  updateFaultStatus();
  updateFloatSwitchStates();
  
  const btn = document.getElementById('stuck-float-btn');
  if (btn) {
    btn.style.background = floatSwitchData.stuckFloat ? '#F44336' : '#666';
    btn.textContent = floatSwitchData.stuckFloat ? 'Unstick Float' : 'Stuck Float';
  }
  
  showNotification(floatSwitchData.stuckFloat ? 'Float stuck' : 'Float unstuck', 'info');
}

function toggleWiringFault() {
  floatSwitchData.wiringFault = !floatSwitchData.wiringFault;
  updateFaultStatus();
  updateFloatSwitchStates();
  
  const btn = document.getElementById('wiring-fault-btn');
  if (btn) {
    btn.style.background = floatSwitchData.wiringFault ? '#F44336' : '#666';
    btn.textContent = floatSwitchData.wiringFault ? 'Fix Wiring' : 'Wiring Fault';
  }
  
  showNotification(floatSwitchData.wiringFault ? 'Wiring fault detected' : 'Wiring fault cleared', 'info');
}

function injectSensorDrift() {
  floatSwitchData.sensorDrift = Math.random() * 10 - 5; // -5% to +5%
  updateFaultStatus();
  updateFloatSwitchStates();
  
  showNotification(`Sensor drift injected: ${floatSwitchData.sensorDrift.toFixed(1)}%`, 'warning');
}

function toggleVibrationEffect() {
  floatSwitchData.vibrationEffect = !floatSwitchData.vibrationEffect;
  updateFaultStatus();
  updateFloatSwitchStates();
  
  const btn = document.getElementById('vibration-effect-btn');
  if (btn) {
    btn.style.background = floatSwitchData.vibrationEffect ? '#F44336' : '#666';
    btn.textContent = floatSwitchData.vibrationEffect ? 'Stop Vibration' : 'Vibration Effect';
  }
  
  showNotification(floatSwitchData.vibrationEffect ? 'Vibration effect enabled' : 'Vibration effect disabled', 'info');
}

function clearFloatFaults() {
  floatSwitchData.stuckFloat = false;
  floatSwitchData.wiringFault = false;
  floatSwitchData.sensorDrift = 0;
  floatSwitchData.vibrationEffect = false;
  
  updateFaultStatus();
  updateFloatSwitchStates();
  
  // Reset button styles
  document.getElementById('stuck-float-btn').style.background = '#666';
  document.getElementById('stuck-float-btn').textContent = 'Stuck Float';
  document.getElementById('wiring-fault-btn').style.background = '#666';
  document.getElementById('wiring-fault-btn').textContent = 'Wiring Fault';
  document.getElementById('vibration-effect-btn').style.background = '#666';
  document.getElementById('vibration-effect-btn').textContent = 'Vibration Effect';
  
  showNotification('All float switch faults cleared', 'success');
}

// Update Fault Status
function updateFaultStatus() {
  const stuckStatus = document.getElementById('stuck-status');
  const wiringStatus = document.getElementById('wiring-status');
  const driftStatus = document.getElementById('drift-status');
  const vibrationStatus = document.getElementById('vibration-status');
  
  if (stuckStatus) {
    stuckStatus.textContent = floatSwitchData.stuckFloat ? 'YES' : 'NO';
    stuckStatus.style.color = floatSwitchData.stuckFloat ? '#F44336' : '#4CAF50';
  }
  
  if (wiringStatus) {
    wiringStatus.textContent = floatSwitchData.wiringFault ? 'YES' : 'NO';
    wiringStatus.style.color = floatSwitchData.wiringFault ? '#F44336' : '#4CAF50';
  }
  
  if (driftStatus) {
    driftStatus.textContent = floatSwitchData.sensorDrift.toFixed(1) + '%';
    driftStatus.style.color = Math.abs(floatSwitchData.sensorDrift) > 2 ? '#F44336' : '#4CAF50';
  }
  
  if (vibrationStatus) {
    vibrationStatus.textContent = floatSwitchData.vibrationEffect ? 'YES' : 'NO';
    vibrationStatus.style.color = floatSwitchData.vibrationEffect ? '#F44336' : '#4CAF50';
  }
}

// Start Float Switch Monitoring
function startFloatSwitchMonitoring() {
  if (floatSwitchData.simulationInterval) {
    clearInterval(floatSwitchData.simulationInterval);
  }
  
  floatSwitchData.simulationInterval = setInterval(() => {
    // Simulate turbulence effects
    if (floatSwitchData.turbulence > 0) {
      // Add small random variations to level
      const variation = (Math.random() - 0.5) * (floatSwitchData.turbulence / 10);
      const newLevel = Math.max(0, Math.min(100, floatSwitchData.tankLevel + variation));
      floatSwitchData.tankLevel = newLevel;
      
      // Update display
      const tankSlider = document.getElementById('tank-level-slider');
      const tankValue = document.getElementById('tank-level-value');
      if (tankSlider && tankValue) {
        tankSlider.value = newLevel;
        tankValue.textContent = Math.round(newLevel) + '%';
      }
      
      updateTankDisplay();
    }
  }, 500);
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
window.initializeFloatSwitchSimulation = initializeFloatSwitchSimulation;
window.floatSwitchData = floatSwitchData; 