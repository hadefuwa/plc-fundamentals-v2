// Industrial Maintenance Procedures System
// Comprehensive maintenance training and procedures

// Maintenance System State
let maintenanceData = {
  // Maintenance Schedules
  schedules: {
    daily: [
      { id: 'daily_1', task: 'Check all safety systems', status: 'pending', priority: 'high' },
      { id: 'daily_2', task: 'Inspect pump operation', status: 'pending', priority: 'medium' },
      { id: 'daily_3', task: 'Monitor temperature readings', status: 'pending', priority: 'medium' },
      { id: 'daily_4', task: 'Check valve positions', status: 'pending', priority: 'low' },
      { id: 'daily_5', task: 'Verify float switch operation', status: 'pending', priority: 'high' }
    ],
    weekly: [
      { id: 'weekly_1', task: 'Calibrate temperature sensors', status: 'pending', priority: 'medium' },
      { id: 'weekly_2', task: 'Test emergency stop system', status: 'pending', priority: 'high' },
      { id: 'weekly_3', task: 'Inspect electrical connections', status: 'pending', priority: 'medium' },
      { id: 'weekly_4', task: 'Check pump vibration levels', status: 'pending', priority: 'low' },
      { id: 'weekly_5', task: 'Verify HMI alarm functions', status: 'pending', priority: 'medium' }
    ],
    monthly: [
      { id: 'monthly_1', task: 'Perform valve calibration', status: 'pending', priority: 'medium' },
      { id: 'monthly_2', task: 'Check PLC program backup', status: 'pending', priority: 'high' },
      { id: 'monthly_3', task: 'Inspect float switch mounting', status: 'pending', priority: 'low' },
      { id: 'monthly_4', task: 'Test proximity switch alignment', status: 'pending', priority: 'medium' },
      { id: 'monthly_5', task: 'Verify flow sensor accuracy', status: 'pending', priority: 'medium' }
    ],
    quarterly: [
      { id: 'quarterly_1', task: 'Complete system shutdown test', status: 'pending', priority: 'high' },
      { id: 'quarterly_2', task: 'Inspect pump bearings', status: 'pending', priority: 'medium' },
      { id: 'quarterly_3', task: 'Check valve actuator seals', status: 'pending', priority: 'low' },
      { id: 'quarterly_4', task: 'Verify all safety interlocks', status: 'pending', priority: 'high' },
      { id: 'quarterly_5', task: 'Update maintenance records', status: 'pending', priority: 'medium' }
    ]
  },
  
  // Troubleshooting Guides
  troubleshooting: {
    pumpIssues: [
      {
        symptom: 'Pump not starting',
        possibleCauses: [
          'Power supply failure',
          'Motor overload trip',
          'Control circuit fault',
          'Emergency stop activated',
          'Float switch preventing start'
        ],
        diagnosticSteps: [
          'Check power supply voltage',
          'Verify motor overload status',
          'Test control circuit continuity',
          'Check emergency stop circuit',
          'Verify float switch operation'
        ],
        correctiveActions: [
          'Restore power supply',
          'Reset motor overload',
          'Repair control circuit',
          'Reset emergency stop',
          'Adjust float switch'
        ]
      },
      {
        symptom: 'Low flow rate',
        possibleCauses: [
          'Blocked inlet strainer',
          'Worn pump impeller',
          'Incorrect valve position',
          'Air in system',
          'Insufficient tank level'
        ],
        diagnosticSteps: [
          'Inspect inlet strainer',
          'Check pump performance',
          'Verify valve position',
          'Bleed air from system',
          'Check tank level'
        ],
        correctiveActions: [
          'Clean or replace strainer',
          'Replace pump impeller',
          'Adjust valve position',
          'Purge air from system',
          'Refill tank'
        ]
      }
    ],
    valveIssues: [
      {
        symptom: 'Valve not responding',
        possibleCauses: [
          'Actuator power failure',
          'Control signal fault',
          'Mechanical binding',
          'Position sensor fault',
          'PLC output fault'
        ],
        diagnosticSteps: [
          'Check actuator power',
          'Verify control signal',
          'Inspect mechanical linkage',
          'Test position sensor',
          'Check PLC output'
        ],
        correctiveActions: [
          'Restore actuator power',
          'Repair control signal',
          'Lubricate or repair linkage',
          'Replace position sensor',
          'Repair PLC output'
        ]
      }
    ],
    sensorIssues: [
      {
        symptom: 'Incorrect sensor readings',
        possibleCauses: [
          'Sensor calibration drift',
          'Wiring fault',
          'Environmental interference',
          'Sensor damage',
          'Power supply issue'
        ],
        diagnosticSteps: [
          'Perform sensor calibration',
          'Check wiring continuity',
          'Verify environmental conditions',
          'Inspect sensor condition',
          'Test power supply'
        ],
        correctiveActions: [
          'Recalibrate sensor',
          'Repair wiring',
          'Improve shielding',
          'Replace sensor',
          'Fix power supply'
        ]
      }
    ]
  },
  
  // Safety Procedures
  safetyProcedures: {
    lockoutTagout: {
      steps: [
        'Notify affected personnel',
        'Identify all energy sources',
        'Shut down equipment',
        'Isolate energy sources',
        'Apply lockout devices',
        'Verify isolation',
        'Perform work',
        'Remove lockout devices',
        'Restore energy sources',
        'Test equipment operation'
      ],
      requirements: [
        'Authorized personnel only',
        'Proper lockout devices',
        'Clear identification tags',
        'Verification of isolation',
        'Documentation of procedure'
      ]
    },
    confinedSpace: {
      hazards: [
        'Oxygen deficiency',
        'Toxic gases',
        'Engulfment',
        'Entrapment',
        'Atmospheric conditions'
      ],
      precautions: [
        'Atmospheric testing',
        'Ventilation',
        'Personal protective equipment',
        'Communication systems',
        'Emergency rescue plan'
      ]
    },
    electricalSafety: {
      rules: [
        'Always assume circuits are live',
        'Use proper PPE',
        'Follow lockout procedures',
        'Test before touch',
        'Work with qualified personnel'
      ],
      ppe: [
        'Insulated gloves',
        'Safety glasses',
        'Arc flash protection',
        'Insulated tools',
        'Voltage-rated equipment'
      ]
    }
  },
  
  // Maintenance Records
  records: {
    completedTasks: [],
    equipmentHistory: [],
    spareParts: [],
    workOrders: []
  },
  
  // Current Maintenance Session
  currentSession: {
    active: false,
    startTime: null,
    tasks: [],
    safetyChecks: [],
    notes: ''
  }
};

// Initialize Maintenance Procedures
function initializeMaintenanceProcedures() {
  console.log('Initializing Maintenance Procedures...');
  
  initializeMaintenanceDashboard();
  initializeTroubleshootingGuides();
  initializeSafetyProcedures();
  initializeMaintenanceRecords();
  
  console.log('Maintenance Procedures initialized');
}

// Initialize Maintenance Dashboard
function initializeMaintenanceDashboard() {
  const container = document.getElementById('maintenance-dashboard-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="maintenance-dashboard" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-tools"></i> Industrial Maintenance Dashboard
      </h4>
      
      <!-- Maintenance Schedule Overview -->
      <div class="schedule-overview" style="background: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Maintenance Schedule</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div class="schedule-card" style="background: #222; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50;">
            <div style="color: #4CAF50; font-size: 18px; font-weight: bold;">Daily</div>
            <div style="color: #AAA; font-size: 12px;">5 tasks pending</div>
            <div style="color: #AAA; font-size: 12px;">2 high priority</div>
          </div>
          <div class="schedule-card" style="background: #222; padding: 15px; border-radius: 5px; border-left: 4px solid #FF9800;">
            <div style="color: #FF9800; font-size: 18px; font-weight: bold;">Weekly</div>
            <div style="color: #AAA; font-size: 12px;">5 tasks pending</div>
            <div style="color: #AAA; font-size: 12px;">1 high priority</div>
          </div>
          <div class="schedule-card" style="background: #222; padding: 15px; border-radius: 5px; border-left: 4px solid #2196F3;">
            <div style="color: #2196F3; font-size: 18px; font-weight: bold;">Monthly</div>
            <div style="color: #AAA; font-size: 12px;">5 tasks pending</div>
            <div style="color: #AAA; font-size: 12px;">1 high priority</div>
          </div>
          <div class="schedule-card" style="background: #222; padding: 15px; border-radius: 5px; border-left: 4px solid #9C27B0;">
            <div style="color: #9C27B0; font-size: 18px; font-weight: bold;">Quarterly</div>
            <div style="color: #AAA; font-size: 12px;">5 tasks pending</div>
            <div style="color: #AAA; font-size: 12px;">2 high priority</div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions" style="background: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Quick Actions</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
          <button id="start-maintenance-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
            <i class="fas fa-play"></i> Start Maintenance
          </button>
          <button id="view-schedule-btn" style="background: #2196F3; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
            <i class="fas fa-calendar"></i> View Schedule
          </button>
          <button id="troubleshoot-btn" style="background: #FF9800; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
            <i class="fas fa-search"></i> Troubleshoot
          </button>
          <button id="safety-procedures-btn" style="background: #F44336; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
            <i class="fas fa-shield-alt"></i> Safety Procedures
          </button>
        </div>
      </div>
      
      <!-- Maintenance Statistics -->
      <div class="maintenance-stats" style="background: #333; padding: 20px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Maintenance Statistics</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
          <div class="stat-card" style="text-align: center;">
            <div style="color: #4CAF50; font-size: 24px; font-weight: bold;">85%</div>
            <div style="color: #AAA; font-size: 12px;">Completion Rate</div>
          </div>
          <div class="stat-card" style="text-align: center;">
            <div style="color: #2196F3; font-size: 24px; font-weight: bold;">12</div>
            <div style="color: #AAA; font-size: 12px;">Tasks This Week</div>
          </div>
          <div class="stat-card" style="text-align: center;">
            <div style="color: #FF9800; font-size: 24px; font-weight: bold;">3</div>
            <div style="color: #AAA; font-size: 12px;">Pending Issues</div>
          </div>
          <div class="stat-card" style="text-align: center;">
            <div style="color: #9C27B0; font-size: 24px; font-weight: bold;">98%</div>
            <div style="color: #AAA; font-size: 12px;">Safety Score</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  addMaintenanceDashboardEventListeners();
}

// Initialize Troubleshooting Guides
function initializeTroubleshootingGuides() {
  const container = document.getElementById('troubleshooting-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="troubleshooting-guides" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #FF9800; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-search"></i> Troubleshooting Guides
      </h4>
      
      <div class="troubleshooting-categories" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="category-card" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Pump Issues</h5>
          <div id="pump-troubleshooting" style="display: grid; gap: 8px;">
            <button class="issue-btn" data-issue="pump_not_starting" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Pump Not Starting
            </button>
            <button class="issue-btn" data-issue="low_flow_rate" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Low Flow Rate
            </button>
            <button class="issue-btn" data-issue="pump_vibration" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Excessive Vibration
            </button>
            <button class="issue-btn" data-issue="pump_noise" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Unusual Noise
            </button>
          </div>
        </div>
        
        <div class="category-card" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Valve Issues</h5>
          <div id="valve-troubleshooting" style="display: grid; gap: 8px;">
            <button class="issue-btn" data-issue="valve_not_responding" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Valve Not Responding
            </button>
            <button class="issue-btn" data-issue="valve_stuck" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Valve Stuck
            </button>
            <button class="issue-btn" data-issue="valve_leak" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Valve Leakage
            </button>
            <button class="issue-btn" data-issue="valve_calibration" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Calibration Issues
            </button>
          </div>
        </div>
        
        <div class="category-card" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Sensor Issues</h5>
          <div id="sensor-troubleshooting" style="display: grid; gap: 8px;">
            <button class="issue-btn" data-issue="sensor_incorrect_readings" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Incorrect Readings
            </button>
            <button class="issue-btn" data-issue="sensor_no_signal" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              No Signal
            </button>
            <button class="issue-btn" data-issue="sensor_drift" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Signal Drift
            </button>
            <button class="issue-btn" data-issue="sensor_interference" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; text-align: left;">
              Interference
            </button>
          </div>
        </div>
      </div>
      
      <!-- Troubleshooting Results -->
      <div class="troubleshooting-results" style="background: #333; padding: 20px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Troubleshooting Results</h5>
        <div id="troubleshooting-content" style="min-height: 200px; background: #222; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px; color: #FFFFFF;">
          <div style="color: #AAA; text-align: center;">Select an issue above to view troubleshooting steps</div>
        </div>
      </div>
    </div>
  `;
  
  // Add troubleshooting event listeners
  addTroubleshootingEventListeners();
}

// Initialize Safety Procedures
function initializeSafetyProcedures() {
  const container = document.getElementById('safety-procedures-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="safety-procedures" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-shield-alt"></i> Safety Procedures
      </h4>
      
      <div class="safety-categories" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="safety-card" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid #F44336;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Lockout/Tagout (LOTO)</h5>
          <p style="color: #AAA; font-size: 12px; margin-bottom: 10px;">Procedures for safely isolating equipment from energy sources</p>
          <button id="loto-procedure-btn" style="background: #F44336; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            View Procedure
          </button>
        </div>
        
        <div class="safety-card" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid #FF9800;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Confined Space Entry</h5>
          <p style="color: #AAA; font-size: 12px; margin-bottom: 10px;">Safety procedures for working in confined spaces</p>
          <button id="confined-space-btn" style="background: #FF9800; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            View Procedure
          </button>
        </div>
        
        <div class="safety-card" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Electrical Safety</h5>
          <p style="color: #AAA; font-size: 12px; margin-bottom: 10px;">Guidelines for working with electrical equipment</p>
          <button id="electrical-safety-btn" style="background: #2196F3; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            View Procedure
          </button>
        </div>
        
        <div class="safety-card" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Personal Protective Equipment</h5>
          <p style="color: #AAA; font-size: 12px; margin-bottom: 10px;">Required PPE for different maintenance tasks</p>
          <button id="ppe-guide-btn" style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            View Guide
          </button>
        </div>
      </div>
      
      <!-- Safety Checklist -->
      <div class="safety-checklist" style="background: #333; padding: 20px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Pre-Maintenance Safety Checklist</h5>
        <div id="safety-checklist-items" style="display: grid; gap: 10px;">
          <div class="checklist-item" style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="safety-1" style="width: 16px; height: 16px;">
            <label for="safety-1" style="color: #FFFFFF; font-size: 14px;">Equipment properly isolated from energy sources</label>
          </div>
          <div class="checklist-item" style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="safety-2" style="width: 16px; height: 16px;">
            <label for="safety-2" style="color: #FFFFFF; font-size: 14px;">Lockout/tagout devices applied and verified</label>
          </div>
          <div class="checklist-item" style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="safety-3" style="width: 16px; height: 16px;">
            <label for="safety-3" style="color: #FFFFFF; font-size: 14px;">Proper PPE worn for the task</label>
          </div>
          <div class="checklist-item" style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="safety-4" style="width: 16px; height: 16px;">
            <label for="safety-4" style="color: #FFFFFF; font-size: 14px;">Work area properly ventilated</label>
          </div>
          <div class="checklist-item" style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="safety-5" style="width: 16px; height: 16px;">
            <label for="safety-5" style="color: #FFFFFF; font-size: 14px;">Emergency procedures reviewed</label>
          </div>
        </div>
        <button id="complete-safety-checklist-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
          Complete Safety Checklist
        </button>
      </div>
    </div>
  `;
  
  // Add safety procedure event listeners
  addSafetyProcedureEventListeners();
}

// Initialize Maintenance Records
function initializeMaintenanceRecords() {
  const container = document.getElementById('maintenance-records-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="maintenance-records" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #9C27B0; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-clipboard-list"></i> Maintenance Records
      </h4>
      
      <div class="records-tabs" style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button class="tab-btn active" data-tab="completed" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Completed Tasks
        </button>
        <button class="tab-btn" data-tab="equipment" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Equipment History
        </button>
        <button class="tab-btn" data-tab="spare-parts" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Spare Parts
        </button>
        <button class="tab-btn" data-tab="work-orders" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Work Orders
        </button>
      </div>
      
      <div class="records-content" style="background: #333; padding: 20px; border-radius: 8px; min-height: 300px;">
        <div id="completed-tasks-tab" class="tab-content active">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Recently Completed Tasks</h5>
          <div id="completed-tasks-list" style="display: grid; gap: 10px;">
            <div class="task-record" style="background: #222; padding: 10px; border-radius: 5px; border-left: 4px solid #4CAF50;">
              <div style="color: #FFFFFF; font-weight: bold;">Pump Bearing Inspection</div>
              <div style="color: #AAA; font-size: 12px;">Completed: 2024-01-15 | Technician: John Smith</div>
              <div style="color: #AAA; font-size: 12px;">Status: Normal wear, no action required</div>
            </div>
            <div class="task-record" style="background: #222; padding: 10px; border-radius: 5px; border-left: 4px solid #4CAF50;">
              <div style="color: #FFFFFF; font-weight: bold;">Valve Calibration</div>
              <div style="color: #AAA; font-size: 12px;">Completed: 2024-01-14 | Technician: Sarah Johnson</div>
              <div style="color: #AAA; font-size: 12px;">Status: Calibration successful, accuracy improved</div>
            </div>
            <div class="task-record" style="background: #222; padding: 10px; border-radius: 5px; border-left: 4px solid #FF9800;">
              <div style="color: #FFFFFF; font-weight: bold;">Emergency Stop Test</div>
              <div style="color: #AAA; font-size: 12px;">Completed: 2024-01-13 | Technician: Mike Davis</div>
              <div style="color: #AAA; font-size: 12px;">Status: Minor adjustment required, completed</div>
            </div>
          </div>
        </div>
        
        <div id="equipment-history-tab" class="tab-content" style="display: none;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Equipment Maintenance History</h5>
          <div style="color: #AAA; text-align: center;">Equipment history will be displayed here</div>
        </div>
        
        <div id="spare-parts-tab" class="tab-content" style="display: none;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Spare Parts Inventory</h5>
          <div style="color: #AAA; text-align: center;">Spare parts inventory will be displayed here</div>
        </div>
        
        <div id="work-orders-tab" class="tab-content" style="display: none;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Active Work Orders</h5>
          <div style="color: #AAA; text-align: center;">Work orders will be displayed here</div>
        </div>
      </div>
    </div>
  `;
  
  // Add maintenance records event listeners
  addMaintenanceRecordsEventListeners();
}

// Add Maintenance Dashboard Event Listeners
function addMaintenanceDashboardEventListeners() {
  document.getElementById('start-maintenance-btn')?.addEventListener('click', startMaintenanceSession);
  document.getElementById('view-schedule-btn')?.addEventListener('click', viewMaintenanceSchedule);
  document.getElementById('troubleshoot-btn')?.addEventListener('click', openTroubleshooting);
  document.getElementById('safety-procedures-btn')?.addEventListener('click', openSafetyProcedures);
}

// Add Troubleshooting Event Listeners
function addTroubleshootingEventListeners() {
  document.querySelectorAll('.issue-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const issue = this.dataset.issue;
      showTroubleshootingGuide(issue);
    });
  });
}

// Add Safety Procedure Event Listeners
function addSafetyProcedureEventListeners() {
  document.getElementById('loto-procedure-btn')?.addEventListener('click', () => showSafetyProcedure('lockoutTagout'));
  document.getElementById('confined-space-btn')?.addEventListener('click', () => showSafetyProcedure('confinedSpace'));
  document.getElementById('electrical-safety-btn')?.addEventListener('click', () => showSafetyProcedure('electricalSafety'));
  document.getElementById('ppe-guide-btn')?.addEventListener('click', () => showSafetyProcedure('ppe'));
  document.getElementById('complete-safety-checklist-btn')?.addEventListener('click', completeSafetyChecklist);
}

// Add Maintenance Records Event Listeners
function addMaintenanceRecordsEventListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.dataset.tab;
      switchTab(tab);
    });
  });
}

// Show Troubleshooting Guide
function showTroubleshootingGuide(issue) {
  const content = document.getElementById('troubleshooting-content');
  if (!content) return;
  
  let guide = null;
  
  // Find the appropriate troubleshooting guide
  if (issue.startsWith('pump_')) {
    guide = maintenanceData.troubleshooting.pumpIssues.find(g => g.symptom.toLowerCase().includes(issue.replace('_', ' ')));
  } else if (issue.startsWith('valve_')) {
    guide = maintenanceData.troubleshooting.valveIssues.find(g => g.symptom.toLowerCase().includes(issue.replace('_', ' ')));
  } else if (issue.startsWith('sensor_')) {
    guide = maintenanceData.troubleshooting.sensorIssues.find(g => g.symptom.toLowerCase().includes(issue.replace('_', ' ')));
  }
  
  if (guide) {
    content.innerHTML = `
      <div style="color: #FF9800; font-weight: bold; margin-bottom: 10px;">${guide.symptom}</div>
      
      <div style="margin-bottom: 15px;">
        <div style="color: #4CAF50; font-weight: bold; margin-bottom: 5px;">Possible Causes:</div>
        <ul style="color: #AAA; margin-left: 20px;">
          ${guide.possibleCauses.map(cause => `<li>${cause}</li>`).join('')}
        </ul>
      </div>
      
      <div style="margin-bottom: 15px;">
        <div style="color: #2196F3; font-weight: bold; margin-bottom: 5px;">Diagnostic Steps:</div>
        <ol style="color: #AAA; margin-left: 20px;">
          ${guide.diagnosticSteps.map((step, index) => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      
      <div>
        <div style="color: #9C27B0; font-weight: bold; margin-bottom: 5px;">Corrective Actions:</div>
        <ul style="color: #AAA; margin-left: 20px;">
          ${guide.correctiveActions.map(action => `<li>${action}</li>`).join('')}
        </ul>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div style="color: #AAA; text-align: center;">Troubleshooting guide not found for this issue</div>
    `;
  }
}

// Show Safety Procedure
function showSafetyProcedure(procedure) {
  const content = document.getElementById('troubleshooting-content');
  if (!content) return;
  
  let procedureData = null;
  
  switch (procedure) {
    case 'lockoutTagout':
      procedureData = maintenanceData.safetyProcedures.lockoutTagout;
      break;
    case 'confinedSpace':
      procedureData = maintenanceData.safetyProcedures.confinedSpace;
      break;
    case 'electricalSafety':
      procedureData = maintenanceData.safetyProcedures.electricalSafety;
      break;
    case 'ppe':
      procedureData = {
        steps: ['Select appropriate PPE for the task', 'Inspect PPE for damage', 'Don PPE correctly', 'Verify fit and function'],
        requirements: ['Safety glasses', 'Hard hat', 'Steel-toed boots', 'Gloves', 'Hearing protection']
      };
      break;
  }
  
  if (procedureData) {
    content.innerHTML = `
      <div style="color: #F44336; font-weight: bold; margin-bottom: 10px;">Safety Procedure</div>
      
      <div style="margin-bottom: 15px;">
        <div style="color: #4CAF50; font-weight: bold; margin-bottom: 5px;">Steps:</div>
        <ol style="color: #AAA; margin-left: 20px;">
          ${procedureData.steps.map((step, index) => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      
      <div>
        <div style="color: #2196F3; font-weight: bold; margin-bottom: 5px;">Requirements:</div>
        <ul style="color: #AAA; margin-left: 20px;">
          ${procedureData.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}

// Start Maintenance Session
function startMaintenanceSession() {
  maintenanceData.currentSession.active = true;
  maintenanceData.currentSession.startTime = new Date();
  
  showNotification('Maintenance session started. Complete safety checklist first.', 'info');
  
  // Show safety checklist
  openSafetyProcedures();
}

// View Maintenance Schedule
function viewMaintenanceSchedule() {
  showNotification('Opening maintenance schedule...', 'info');
  // Implementation for viewing detailed schedule
}

// Open Troubleshooting
function openTroubleshooting() {
  showNotification('Opening troubleshooting guides...', 'info');
  // Implementation for opening troubleshooting panel
}

// Open Safety Procedures
function openSafetyProcedures() {
  showNotification('Opening safety procedures...', 'info');
  // Implementation for opening safety procedures panel
}

// Complete Safety Checklist
function completeSafetyChecklist() {
  const checkboxes = document.querySelectorAll('#safety-checklist-items input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  if (allChecked) {
    showNotification('Safety checklist completed. Maintenance can proceed.', 'success');
    maintenanceData.currentSession.safetyChecks = Array.from(checkboxes).map(cb => cb.checked);
  } else {
    showNotification('Please complete all safety checklist items before proceeding.', 'warning');
  }
}

// Switch Tab
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = '#666';
  });
  
  // Show selected tab content
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
  
  // Activate tab button
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.background = '#4CAF50';
  }
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
window.initializeMaintenanceProcedures = initializeMaintenanceProcedures;
window.maintenanceData = maintenanceData; 