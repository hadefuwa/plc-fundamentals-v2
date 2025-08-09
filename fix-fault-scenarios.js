// Quick fix script for fault scenarios 5-8
// This script will apply the proper Investigation Tools structure and System Simulation fixes

const fs = require('fs');

// Function to fix fault scenario files
function fixFaultScenario(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix Investigation Tools section structure
  content = content.replace(
    /<!-- Interactive Tools Section -->\s*<div class="worksheet-section tools-section">\s*<h2 class="section-header"><i class="fas fa-tools"><\/i> Investigation Tools<\/h2>\s*<div class="worksheet-content">\s*<div class="tools-grid">\s*<div class="tool-card" onclick="useTool\('([^']+)'\)">\s*<i class="fas fa-([^"]+)"><\/i>\s*<h3>([^<]+)<\/h3>\s*<p>([^<]+)<\/p>\s*<\/div>/g,
    '<!-- Investigation Tools Section -->\n    <div class="worksheet-section tools-section">\n      <h2 class="section-header"><i class="fas fa-tools"></i> Investigation Tools</h2>\n      <div class="worksheet-content">\n        <div class="tools-grid">\n          <div class="tool-card" data-tool="$1">\n            <h4><i class="fas fa-$2"></i> $3</h4>\n            <p>$4</p>\n            <button class="tool-btn" onclick="useTool(\'$1\')">Use Tool</button>\n          </div>'
  );
  
  // Add Investigation Results section
  content = content.replace(
    /<div id="tool-results" class="tool-results"><\/div>\s*<\/div>\s*<\/div>/,
    `        </div>
        
        <!-- Investigation Results Section -->
        <div id="investigation-results" class="investigation-results" style="display: none;">
          <h3 class="section-header"><i class="fas fa-search"></i> Investigation Results</h3>
          <div id="results-content">
            <!-- Results will be populated by JavaScript -->
          </div>
        </div>
      </div>
    </div>`
  );
  
  // Fix System Simulation section
  content = content.replace(
    /<div id="[^"]*-simulation" class="simulation-container">\s*<div class="simulation-loading">\s*<i class="fas fa-spinner fa-spin"><\/i>\s*<p>Loading[^<]*<\/p>\s*<\/div>\s*<\/div>/g,
    `<div id="hmi-display-panel" class="simulation-container">
          <div class="simulation-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading HMI simulation...</p>
          </div>
        </div>
        <div id="plc-io-panel" class="simulation-container" style="margin-top: 20px;">
          <div class="simulation-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading PLC I/O simulation...</p>
          </div>
        </div>
        <div id="pump-simulation-panel" class="simulation-container" style="margin-top: 20px;">
          <div class="simulation-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading pump simulation...</p>
          </div>
        </div>
        <div id="valve-simulation-panel" class="simulation-container" style="margin-top: 20px;">
          <div class="simulation-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading valve simulation...</p>
          </div>
        </div>`
  );
  
  // Add simulation initialization
  content = content.replace(
    /document\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?\}\);(\s*<\/script>)/,
    `document.addEventListener('DOMContentLoaded', function() {
      // Load saved answers
      const savedAnswer = localStorage.getItem('fault-scenario-${filePath.match(/fault-scenario-(\d+)/)[1]}-${filePath.match(/fault-scenario-(\d+)/)[1]}.1');
      if (savedAnswer !== null) {
        const radio = document.querySelector(\`input[name="q${filePath.match(/fault-scenario-(\d+)/)[1]}.1"][value="\${savedAnswer}"]\`);
        if (radio) radio.checked = true;
      }
      
      // Initialize simulations
      setTimeout(() => {
        if (typeof initializeHMISimulation === 'function') {
          initializeHMISimulation();
        }
        if (typeof initializePLCSimulation === 'function') {
          initializePLCSimulation();
        }
        if (typeof initializePumpSimulation === 'function') {
          initializePumpSimulation();
        }
        if (typeof initializeValveSimulation === 'function') {
          initializeValveSimulation();
        }
      }, 1000);
    });$1`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

// Apply fixes to all fault scenarios
['fault-scenario-5.html', 'fault-scenario-6.html', 'fault-scenario-7.html', 'fault-scenario-8.html'].forEach(fixFaultScenario); 