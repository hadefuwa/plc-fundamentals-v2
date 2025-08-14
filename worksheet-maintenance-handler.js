// Maintenance Worksheet Handler
// This file contains specific logic for handling maintenance worksheets

// Enhanced content templates for maintenance worksheets
const maintenanceContentTemplates = {
  1: {
    instructions: "Select Start and observe the system start up. Once the pump is running you should see water flow through the flow gauge. Ensure the hand valve is in the open position, (the handle should be in line with the piping).",
    steps: [
      { title: "Set a Flow Rate", description: "Enter a target flow rate on the HMI. You can adjust in increments of 20 using the +/- buttons." },
      { title: "Observe Feedback", description: "Watch the flow sensor reading on the HMI and compare it to the setpoint." },
      { title: "Watch the System Adjust", description: "Note how the pump speed and valve position change to bring the flow rate to the setpoint." },
      { title: "Introduce a Disturbance", description: "Temporarily restrict the flow (e.g., partially close the shut-off valve) and observe how the system reacts to maintain the flow rate." }
    ],
    soWhat: {
      intro: "This is part of a control system, which automates processes in Industry. At the heart of this system is a PLC (Programmable Logic Controller), a computer that makes real-time decisions based on sensor data. The HMI (Human-Machine Interface) allows you to monitor and adjust settings easily.",
      keyPoints: [
        { title: "Feedback Control", description: "The system continuously measures the actual flow rate and compares it to the desired setpoint. If there's a difference, it automatically adjusts the pump speed or valve position to correct it." },
        { title: "Real-Time Automation", description: "The PLC processes sensor data and makes control decisions in milliseconds, far faster than any human could react. This ensures consistent, accurate control even when conditions change." },
        { title: "Stability & Reliability", description: "Closed-loop systems are self-correcting. If something tries to disturb the process (like partially closing a valve), the system automatically compensates to maintain the desired flow rate." },
        { title: "Industrial Applications", description: "These principles are used everywhere in industry - from temperature control in manufacturing to pressure regulation in chemical plants. Understanding this system gives you insight into how modern automation works." }
      ]
    },
    hasSimulation: true,
    simulationType: 'pid-control'
  },
  2: {
    instructions: "Examine the emergency stop systems located throughout the facility. These critical safety devices must be tested regularly to ensure they function properly when needed.",
    steps: [
      { title: "Visual Inspection", description: "Check each E-stop button for physical damage, proper mounting, and clear labeling. Ensure the button is not stuck or damaged." },
      { title: "Mechanical Test", description: "Press each E-stop button to verify it latches properly and requires intentional rotation to reset." },
      { title: "Circuit Verification", description: "Use a multimeter to verify the E-stop contacts open properly when activated and close when reset." },
      { title: "System Response Test", description: "Test that the system properly shuts down when E-stop is activated and requires proper reset sequence to restart." }
    ],
    soWhat: {
      intro: "Emergency stop systems are the last line of defense in industrial safety. They must be 100% reliable because lives depend on them. Understanding how they work and how to maintain them is crucial for any maintenance technician.",
      keyPoints: [
        { title: "Safety First", description: "E-stop systems are designed to fail safe - if anything goes wrong with the system, it defaults to the stopped state to protect people and equipment." },
        { title: "Redundancy", description: "Critical systems often have multiple E-stop buttons and redundant safety circuits to ensure the system can always be stopped, even if one component fails." },
        { title: "Compliance", description: "E-stop systems must meet strict safety standards (like ISO 13850) and require regular testing and documentation to maintain safety certification." },
        { title: "Maintenance Responsibility", description: "As a maintenance technician, you're responsible for ensuring these systems work when needed. Regular testing and proper documentation can save lives." }
      ]
    },
    hasSimulation: true,
    simulationType: 'emergency-stop'
  },
  3: {
    instructions: "Observe the various LED indicators on the control panel. These visual signals provide instant feedback about system status and are essential for quick diagnosis.",
    steps: [
      { title: "Identify LED Functions", description: "Document what each LED indicates - power, run status, alarms, communication, etc. Check the system documentation if needed." },
      { title: "Test LED Operation", description: "Verify each LED illuminates properly by changing system conditions or using test functions if available." },
      { title: "Check Visibility", description: "Ensure all LEDs are clearly visible from the operator position and not obscured by dirt, labels, or other equipment." },
      { title: "Verify Color Coding", description: "Confirm LEDs follow standard color conventions (green=normal, red=alarm, yellow=warning, blue=information)." }
    ],
    soWhat: {
      intro: "Status LEDs are the simplest form of human-machine interface, providing instant visual feedback about system conditions. They're often the first indication of problems and are crucial for quick troubleshooting.",
      keyPoints: [
        { title: "Instant Feedback", description: "LEDs provide immediate visual indication of system status without needing to navigate through screens or menus - critical for emergency situations." },
        { title: "Standard Color Coding", description: "Industrial LEDs follow international standards for colors, making it easier for technicians to quickly understand system status regardless of the specific equipment." },
        { title: "Diagnostic Tool", description: "LED patterns can indicate specific fault conditions, helping technicians quickly identify problems without needing complex diagnostic equipment." },
        { title: "Maintenance Indicator", description: "Many systems use LEDs to indicate when maintenance is due, helping prevent unexpected failures through predictive maintenance." }
      ]
    },
    hasSimulation: true,
    simulationType: 'status-led'
  },
  4: {
    instructions: "Examine the PLC (Programmable Logic Controller) that controls the automation system. This is the 'brain' of the operation and requires careful maintenance.",
    steps: [
      { title: "Physical Inspection", description: "Check the PLC cabinet for proper ventilation, clean filters, secure mounting, and no signs of overheating or corrosion." },
      { title: "Power Supply Check", description: "Verify input voltage is within specifications and check backup battery status if equipped." },
      { title: "I/O Module Status", description: "Check all input/output modules for proper LED indication and verify no loose connections." },
      { title: "Program Backup", description: "Ensure the PLC program is backed up and verify the backup is current and complete." }
    ],
    soWhat: {
      intro: "The PLC is the central nervous system of modern industrial automation. It makes thousands of decisions per second, controlling everything from simple on/off functions to complex process control algorithms.",
      keyPoints: [
        { title: "Central Control", description: "The PLC coordinates all system functions, reading sensors, making control decisions, and operating actuators - all in real-time with precise timing." },
        { title: "Programmable Logic", description: "Unlike hardwired control systems, PLCs can be reprogrammed to change system behavior without rewiring, making them incredibly flexible for different applications." },
        { title: "Reliability", description: "Industrial PLCs are designed to operate 24/7 in harsh environments for years without failure, but they require proper maintenance to achieve this reliability." },
        { title: "Diagnostic Capabilities", description: "Modern PLCs provide extensive diagnostic information, helping technicians quickly identify and resolve problems before they cause system failures." }
      ]
    },
    hasSimulation: true,
    simulationType: 'plc'
  },
  5: {
    instructions: "Interact with the HMI (Human-Machine Interface) touchscreen. This is how operators monitor and control the system, so it must be properly maintained.",
    steps: [
      { title: "Screen Calibration", description: "Test touchscreen accuracy by pressing various buttons and verify the system responds to the correct touch points." },
      { title: "Display Quality", description: "Check for dead pixels, scratches, or areas of poor visibility that could affect operator ability to read information." },
      { title: "Navigation Test", description: "Navigate through all available screens to ensure proper operation and verify all functions are accessible." },
      { title: "Alarm Testing", description: "Test alarm acknowledgment and verify that critical alarms are properly displayed and cannot be missed." }
    ],
    soWhat: {
      intro: "The HMI is the primary interface between humans and the automated system. It must be intuitive, reliable, and always available because operators depend on it to monitor and control critical processes.",
      keyPoints: [
        { title: "Human Factors", description: "HMI design follows human factors engineering principles to reduce operator error and improve response time during normal and emergency conditions." },
        { title: "Process Visualization", description: "Good HMI design provides clear, intuitive visualization of complex processes, helping operators understand system status at a glance." },
        { title: "Alarm Management", description: "The HMI manages alarms and alerts, prioritizing critical information and guiding operators through proper response procedures." },
        { title: "Data Logging", description: "HMIs often log operator actions and system events, providing valuable data for troubleshooting and process improvement." }
      ]
    },
    hasSimulation: true,
    simulationType: 'hmi'
  },
  6: {
    instructions: "Examine the pump system that provides the driving force for fluid movement. Pumps are critical components that require regular maintenance to ensure reliable operation.",
    steps: [
      { title: "Visual Inspection", description: "Check for leaks, unusual vibration, noise, or overheating. Inspect seals, gaskets, and connections for signs of wear." },
      { title: "Performance Check", description: "Verify pump pressure, flow rate, and power consumption are within normal operating ranges." },
      { title: "Lubrication", description: "Check bearing lubrication levels and condition. Add or replace lubricant according to maintenance schedule." },
      { title: "Coupling Alignment", description: "Verify motor-to-pump coupling alignment and check for excessive wear or damage." }
    ],
    soWhat: {
      intro: "Pumps are the heart of fluid systems, converting mechanical energy into fluid flow and pressure. Proper maintenance is essential because pump failures can shut down entire processes and cause expensive damage.",
      keyPoints: [
        { title: "Energy Conversion", description: "Pumps convert rotational mechanical energy from motors into fluid kinetic and potential energy, creating the flow and pressure needed for system operation." },
        { title: "Wear Components", description: "Pumps have many wear components including seals, bearings, and impellers that require regular inspection and replacement to maintain efficiency." },
        { title: "System Impact", description: "Pump performance directly affects entire system operation - reduced pump efficiency can cause poor system performance, increased energy costs, and process problems." },
        { title: "Predictive Maintenance", description: "Monitoring pump vibration, temperature, and power consumption can predict failures before they occur, allowing planned maintenance instead of emergency repairs." }
      ]
    },
    hasSimulation: true,
    simulationType: 'pump'
  },
  7: {
    instructions: "Examine the control valve that regulates fluid flow through the system. Valves are precision instruments that require careful maintenance to ensure accurate control.",
    steps: [
      { title: "Actuator Check", description: "Test valve actuator operation by commanding full open and close positions. Check for smooth operation and proper positioning." },
      { title: "Seat Leakage Test", description: "Test valve seat tightness by checking for leakage when valve is in the closed position." },
      { title: "Position Feedback", description: "Verify valve position feedback accuracy by comparing commanded position with actual position." },
      { title: "Packing Inspection", description: "Check valve stem packing for leaks and proper compression. Replace if excessive leakage is observed." }
    ],
    soWhat: {  
      intro: "Control valves are the final control elements in most process control systems. They directly control the process by regulating flow, and their proper operation is critical for maintaining product quality and process stability.",
      keyPoints: [
        { title: "Process Control", description: "Control valves are the 'hands' of the control system, actually manipulating the process based on control system commands to maintain desired setpoints." },
        { title: "Precision Instruments", description: "Modern control valves are precision instruments capable of very accurate flow control, but they require proper calibration and maintenance to maintain this precision." },
        { title: "Harsh Service", description: "Valves often operate in harsh conditions with high pressures, temperatures, or corrosive fluids that can cause wear and require regular maintenance." },
        { title: "Safety Functions", description: "Many control valves have safety functions like failing to a safe position on power loss, making their proper maintenance critical for plant safety." }
      ]
    },
    hasSimulation: true,
    simulationType: 'valve'
  },
  8: {
    instructions: "Examine the float switch used for level detection. These simple but critical devices must be properly maintained to ensure reliable level control.",
    steps: [
      { title: "Float Movement", description: "Manually lift and lower the float to verify smooth movement without binding or sticking." },
      { title: "Switch Operation", description: "Test the electrical switch by moving the float through its operating range and verifying proper switching action." },
      { title: "Mounting Security", description: "Check that the float switch is securely mounted and properly positioned for accurate level detection." },
      { title: "Electrical Connections", description: "Inspect wiring and connections for corrosion, looseness, or damage that could cause intermittent operation." }
    ],
    soWhat: {
      intro: "Float switches are simple but essential safety devices that prevent tank overflows and pump dry-running. Despite their simplicity, they must be properly maintained because failures can cause expensive damage or safety hazards.",
      keyPoints: [
        { title: "Simple but Critical", description: "Float switches have few moving parts but perform critical safety functions like preventing tank overflows or protecting pumps from running dry." },
        { title: "Environmental Challenges", description: "Float switches often operate in harsh environments with corrosive fluids, extreme temperatures, or debris that can affect operation." },
        { title: "Fail-Safe Design", description: "Properly designed float switch systems fail in a safe condition - if the switch fails, the system shuts down safely rather than causing damage." },
        { title: "Regular Testing", description: "Because float switches are often in remote or difficult-to-access locations, regular testing ensures they'll work when needed." }
      ]
    },
    hasSimulation: true,
    simulationType: 'float-switch'
  }
};

// Get maintenance content for a specific worksheet
function getMaintenanceContent(worksheetId) {
  return maintenanceContentTemplates[worksheetId] || getDefaultMaintenanceContent();
}

// Default maintenance content template
function getDefaultMaintenanceContent() {
  return {
    instructions: "Follow the maintenance procedures as outlined in the system documentation.",
    steps: [
      { title: "Initial Inspection", description: "Perform a visual inspection of the system components." },
      { title: "Functional Testing", description: "Test the system operation according to procedures." },
      { title: "Documentation", description: "Record all observations and measurements." },
      { title: "Corrective Actions", description: "Implement any necessary corrective actions." }
    ],
    soWhat: {
      intro: "Understanding system maintenance is important for maintaining reliable industrial systems.",
      keyPoints: [
        { title: "System Reliability", description: "Proper maintenance ensures reliable operation and prevents unexpected failures." },
        { title: "Safety", description: "Well-maintained systems operate safely and protect personnel and equipment." },
        { title: "Efficiency", description: "Regular maintenance maintains system efficiency and reduces operating costs." },
        { title: "Compliance", description: "Proper maintenance ensures compliance with safety and regulatory requirements." }
      ]
    },
    hasSimulation: false,
    simulationType: null
  };
}

// Specialized rendering for maintenance worksheets with simulations
function renderEnhancedMaintenanceWorksheet(scenario, worksheetId) {
  const enhancedContent = getMaintenanceContent(worksheetId);
  
  // Start with the basic maintenance worksheet rendering
  renderMaintenanceWorksheet(scenario);
  
  // Add simulation section if this worksheet has a simulation
  if (enhancedContent.hasSimulation) {
    addSimulationSection(worksheetId, enhancedContent.simulationType);
  }
  
  // Add PID control simulation for worksheet 1
  if (worksheetId === 1) {
    addPIDControlSimulation();
  }
}

// Add simulation section based on type
function addSimulationSection(worksheetId, simulationType) {
  const container = document.getElementById('worksheet-content');
  
  // Create the specific container ID that the simulation script expects
  let specificContainerId = 'simulation-container';
  let initFunction = null;
  
  switch(simulationType) {
    case 'pid-control':
      // For flow control (worksheet 1), don't add simulation here - it's handled by PID section
      return;
    case 'emergency-stop':
      specificContainerId = 'emergency-stop-panel';
      initFunction = 'initializeEmergencyStopSimulation';
      break;
    case 'status-led':
      specificContainerId = 'status-led-panel';
      initFunction = 'initializeStatusLEDSimulation';
      break;
    case 'plc':
      specificContainerId = 'plc-display-panel';
      initFunction = 'initializePLCSimulation';
      break;
    case 'hmi':
      specificContainerId = 'hmi-display-panel';
      initFunction = 'initializeHMISimulation';
      break;
    case 'float-switch':
      specificContainerId = 'float-switch-panel';
      initFunction = 'initializeFloatSwitchSimulation';
      break;
    case 'pump':
      specificContainerId = 'pump-display-panel';
      initFunction = 'initializePumpSimulation';
      break;
    case 'valve':
      specificContainerId = 'valve-display-panel';
      initFunction = 'initializeValveSimulation';
      break;
    default:
      specificContainerId = `${simulationType}-panel`;
  }
  
  const simulationHTML = `
    <div class="simulation-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-top: 40px; border: 2px solid #FF5722; box-shadow: 0 8px 20px rgba(255, 87, 34, 0.3);">
      <h2 class="section-header" style="color: #FF5722; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-cogs"></i> Interactive Simulation</h2>
      <div id="${specificContainerId}" style="background: #333; padding: 20px; border-radius: 8px; min-height: 300px;">
        <div class="simulation-loading" style="text-align: center; color: #FFFFFF; padding: 50px;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 15px;"></i>
          <p>Loading ${simulationType} simulation...</p>
          <p style="color: #AAA; font-size: 14px;">Simulation script will be loaded automatically</p>
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', simulationHTML);
  
  // Try to initialize the simulation if the function is available
  setTimeout(() => {
    if (initFunction && typeof window[initFunction] === 'function') {
      console.log(`Initializing ${simulationType} simulation with ${initFunction}`);
      window[initFunction]();
    } else {
      console.log(`Simulation init function ${initFunction} not found, waiting for script to load...`);
    }
  }, 1000);
}

// Add PID control simulation for worksheet 1
function addPIDControlSimulation() {
  const container = document.getElementById('worksheet-content');
  
  const pidSimulationHTML = `
    <div class="simulation-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-top: 40px; border: 2px solid #E91E63; box-shadow: 0 8px 20px rgba(233, 30, 99, 0.3);">
      <h2 class="section-header" style="color: #E91E63; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-chart-line"></i> PID Control Simulation</h2>
      
      <div class="pid-simulation-tabs" style="margin-bottom: 30px;">
        <div class="tab-buttons" style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button class="tab-btn active" data-tab="tuning" style="background: #E91E63; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">PID Tuning</button>
          <button class="tab-btn" data-tab="response" style="background: #555; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">System Response</button>
          <button class="tab-btn" data-tab="challenges" style="background: #555; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Challenges</button>
        </div>
        
        <div class="tab-content" id="tuning-tab" style="display: block;">
          <div id="pid-tuning-container" style="background: #333; padding: 20px; border-radius: 8px; min-height: 400px;">
            <div class="simulation-loading" style="text-align: center; color: #FFFFFF; padding: 50px;">
              <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 15px;"></i>
              <p>Loading PID Tuning Interface...</p>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="response-tab" style="display: none;">
          <div id="response-analysis-container" style="background: #333; padding: 20px; border-radius: 8px; min-height: 400px;">
            <div class="simulation-loading" style="text-align: center; color: #FFFFFF; padding: 50px;">
              <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 15px;"></i>
              <p>Loading Response Analysis...</p>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="challenges-tab" style="display: none;">
          <div id="challenges-container" style="background: #333; padding: 20px; border-radius: 8px; min-height: 400px;">
            <div class="simulation-loading" style="text-align: center; color: #FFFFFF; padding: 50px;">
              <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 15px;"></i>
              <p>Loading PID Challenges...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', pidSimulationHTML);
  
  // Initialize tab switching
  setTimeout(() => {
    initializePIDTabs();
  }, 100);
}

// Initialize PID simulation tabs
function initializePIDTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Update button states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#555';
      });
      this.classList.add('active');
      this.style.background = '#E91E63';
      
      // Update tab content visibility
      tabContents.forEach(content => {
        content.style.display = 'none';
      });
      document.getElementById(`${targetTab}-tab`).style.display = 'block';
    });
  });
}

// Check if this file should handle the current worksheet
function shouldUseMaintenanceHandler() {
  return getUrlParameter('type') === 'maintenance' || !getUrlParameter('type');
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getMaintenanceContent,
    renderEnhancedMaintenanceWorksheet,
    shouldUseMaintenanceHandler
  };
} 