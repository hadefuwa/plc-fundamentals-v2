// Worksheet Debug Helper
// This file helps debug worksheet loading issues

// Debug flag - set to true to enable detailed logging
window.WORKSHEET_DEBUG = false;

// Enhanced console logging
function debugLog(message, data = null) {
  if (window.WORKSHEET_DEBUG) {
    console.log(`[WORKSHEET DEBUG] ${message}`, data || '');
  }
}

// Check if all required functions are available
function checkRequiredFunctions() {
  debugLog('=== Checking Required Functions ===');
  
  const requiredFunctions = [
    'loadWorksheet',
    'submitAnswer', 
    'submitMultipleChoiceQuestion',
    'getUrlParameter',
    'showInteractiveWorksheet1'
  ];
  
  requiredFunctions.forEach(funcName => {
    const exists = typeof window[funcName] === 'function';
    debugLog(`${funcName}: ${exists ? '✅ Available' : '❌ Missing'}`);
  });
}

// Check DOM elements
function checkDOMElements() {
  debugLog('=== Checking DOM Elements ===');
  
  const requiredElements = [
    'loading-container',
    'main-content', 
    'worksheet-content',
    'error-container'
  ];
  
  requiredElements.forEach(elementId => {
    const element = document.getElementById(elementId);
    debugLog(`#${elementId}: ${element ? '✅ Found' : '❌ Missing'}`);
  });
}

// Check loaded scripts
function checkLoadedScripts() {
  debugLog('=== Checking Loaded Scripts ===');
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const scriptSrcs = scripts.map(script => script.src.split('/').pop()).filter(src => src);
  
  debugLog('Loaded scripts:', scriptSrcs);
  
  // Check for specific required scripts
  const requiredScripts = [
    'worksheet-core.js',
    'scenario-popup.js',
    'worksheet-maintenance-handler.js'
  ];
  
  requiredScripts.forEach(scriptName => {
    const loaded = scriptSrcs.some(src => src === scriptName);
    debugLog(`${scriptName}: ${loaded ? '✅ Loaded' : '❌ Not loaded'}`);
  });
}

// Check current worksheet parameters
function checkWorksheetParams() {
  debugLog('=== Checking Worksheet Parameters ===');
  
  const worksheetId = getUrlParameter('id');
  const type = getUrlParameter('type') || 'maintenance';
  
  debugLog(`Worksheet ID: ${worksheetId}`);
  debugLog(`Worksheet Type: ${type}`);
  debugLog(`Current URL: ${window.location.href}`);
}

// Check for JavaScript errors
function setupErrorHandling() {
  window.addEventListener('error', function(event) {
    debugLog('❌ JavaScript Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
  
  window.addEventListener('unhandledrejection', function(event) {
    debugLog('❌ Unhandled Promise Rejection:', event.reason);
  });
}

// Run comprehensive debug check
function runFullDebugCheck() {
  debugLog('🔍 Starting comprehensive debug check...');
  
  checkWorksheetParams();
  checkDOMElements();
  checkLoadedScripts();
  checkRequiredFunctions();
  
  debugLog('✅ Debug check complete - check console for issues');
}

// Auto-run debug check when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(runFullDebugCheck, 1000);
  });
} else {
  setTimeout(runFullDebugCheck, 1000);
}

// Setup error handling immediately
setupErrorHandling();

// Expose debug functions globally
window.debugLog = debugLog;
window.runFullDebugCheck = runFullDebugCheck;
window.checkRequiredFunctions = checkRequiredFunctions;
window.checkDOMElements = checkDOMElements;
window.checkLoadedScripts = checkLoadedScripts; 