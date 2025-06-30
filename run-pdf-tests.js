// Script to run PDF viewer tests
const { app } = require('electron');
const { runTests } = require('./pdf-viewer-test');

// Wait for Electron to initialize
app.whenReady().then(async () => {
  console.log('Starting PDF viewer tests...');
  
  try {
    // Run the tests
    const results = await runTests();
    
    // Exit with appropriate code
    process.exit(results.success ? 0 : 1);
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}); 