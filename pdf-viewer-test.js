// PDF Viewer Unit Tests
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

// Configuration
const TEST_TIMEOUT = 10000; // 10 seconds
const PDF_PATH = 'docs/sample-manual.pdf';
const FULL_PDF_PATH = path.join(__dirname, PDF_PATH);

// Test results
let testResults = {
  pdfExists: false,
  windowCreated: false,
  pdfLoaded: false,
  loadTestResults: null,
  errors: []
};

/**
 * Run the PDF viewer tests
 */
async function runTests() {
  console.log('🧪 Starting PDF Viewer Tests');
  
  try {
    // Test 1: Check if test PDF exists
    testResults.pdfExists = fs.existsSync(FULL_PDF_PATH);
    console.log(`✓ Test PDF exists: ${testResults.pdfExists}`);
    
    if (!testResults.pdfExists) {
      testResults.errors.push('Test PDF file not found');
      return summarizeResults();
    }
    
    // Test 2: Create PDF viewer window
    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      show: false, // Don't show window during tests
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
        webSecurity: false
      }
    });
    
    testResults.windowCreated = !!win;
    console.log(`✓ PDF viewer window created: ${testResults.windowCreated}`);
    
    if (!testResults.windowCreated) {
      testResults.errors.push('Failed to create test window');
      return summarizeResults();
    }
    
    // Test 3: Load PDF in viewer
    const fileUrl = `file:///${FULL_PDF_PATH.replace(/\\/g, '/')}`;
    await win.loadFile('pdf-viewer.html', { 
      query: { pdf: fileUrl }
    });
    
    console.log('✓ PDF viewer page loaded');
    
    // Test 4: Run PDF load test in renderer
    try {
      const loadTestResults = await win.webContents.executeJavaScript('runPDFLoadTest()');
      testResults.loadTestResults = loadTestResults;
      testResults.pdfLoaded = loadTestResults.success;
      
      console.log(`✓ PDF load test completed: ${JSON.stringify(loadTestResults, null, 2)}`);
    } catch (error) {
      testResults.errors.push(`PDF load test error: ${error.message}`);
      console.error('❌ PDF load test error:', error);
    }
    
    // Clean up
    win.close();
    
  } catch (error) {
    testResults.errors.push(`Test error: ${error.message}`);
    console.error('❌ Test error:', error);
  }
  
  return summarizeResults();
}

/**
 * Summarize and display test results
 */
function summarizeResults() {
  console.log('\n📋 PDF Viewer Test Results:');
  console.log('-------------------------');
  console.log(`PDF File Exists: ${testResults.pdfExists ? '✅' : '❌'}`);
  console.log(`Window Created: ${testResults.windowCreated ? '✅' : '❌'}`);
  console.log(`PDF Loaded: ${testResults.pdfLoaded ? '✅' : '❌'}`);
  
  if (testResults.loadTestResults) {
    console.log('\nDetailed Load Results:');
    console.log(`- Has Content: ${testResults.loadTestResults.hasContent ? '✅' : '❌'}`);
    console.log(`- Is Visible: ${testResults.loadTestResults.isVisible ? '✅' : '❌'}`);
    console.log(`- Loading Complete: ${testResults.loadTestResults.isLoaded ? '✅' : '❌'}`);
    console.log(`- PDF URL: ${testResults.loadTestResults.url}`);
  }
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    testResults.errors.forEach(error => console.log(`- ${error}`));
  }
  
  const success = testResults.pdfExists && 
                 testResults.windowCreated && 
                 testResults.pdfLoaded && 
                 testResults.errors.length === 0;
  
  console.log('\n-------------------------');
  console.log(`Overall Result: ${success ? '✅ PASS' : '❌ FAIL'}`);
  
  return {
    success,
    results: testResults
  };
}

// Export the test function for use in other scripts
module.exports = {
  runTests
};

// If this script is run directly, execute the tests
if (require.main === module) {
  app.whenReady().then(async () => {
    await runTests();
    app.quit();
  });
} 