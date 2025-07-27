// Worksheet Tracking and Export System
// This file handles comprehensive tracking of worksheet progress and exports

class WorksheetTracker {
  constructor() {
    this.worksheets = {
      maintenance: [
        { id: 1, title: "Flow Control System Maintenance", type: "maintenance" },
        { id: 2, title: "PID Control System", type: "maintenance" },
        { id: 3, title: "System Calibration", type: "maintenance" },
        { id: 4, title: "Preventive Maintenance", type: "maintenance" },
        { id: 5, title: "Emergency Procedures", type: "maintenance" },
        { id: 6, title: "System Diagnostics", type: "maintenance" },
        { id: 7, title: "Component Testing", type: "maintenance" },
        { id: 8, title: "Performance Optimization", type: "maintenance" },
        { id: 9, title: "Safety Protocols", type: "maintenance" },
        { id: 10, title: "Quality Assurance", type: "maintenance" },
        { id: 11, title: "Documentation Standards", type: "maintenance" },
        { id: 12, title: "Troubleshooting Methods", type: "maintenance" },
        { id: 13, title: "Advanced Diagnostics", type: "maintenance" },
        { id: 14, title: "System Integration", type: "maintenance" }
      ],
      fault: [
        { id: 1, title: "Fault Scenario 1", type: "fault" },
        { id: 2, title: "Fault Scenario 2", type: "fault" },
        { id: 3, title: "Fault Scenario 3", type: "fault" },
        { id: 4, title: "Fault Scenario 4", type: "fault" },
        { id: 5, title: "Fault Scenario 5", type: "fault" },
        { id: 6, title: "Fault Scenario 6", type: "fault" },
        { id: 7, title: "Fault Scenario 7", type: "fault" },
        { id: 8, title: "Fault Scenario 8", type: "fault" }
      ]
    };
  }

  // Enhanced answer saving with timestamps and metadata
  saveAnswer(worksheetId, questionNumber, answer, type = 'maintenance') {
    const key = `worksheet-${type}-${worksheetId}-answers`;
    const timestampKey = `worksheet-${type}-${worksheetId}-timestamps`;
    const metadataKey = `worksheet-${type}-${worksheetId}-metadata`;
    
    // Save answer
    const savedAnswers = JSON.parse(localStorage.getItem(key) || '{}');
    savedAnswers[questionNumber] = answer;
    localStorage.setItem(key, JSON.stringify(savedAnswers));
    
    // Save timestamp
    const timestamps = JSON.parse(localStorage.getItem(timestampKey) || '{}');
    timestamps[questionNumber] = new Date().toISOString();
    localStorage.setItem(timestampKey, JSON.stringify(timestamps));
    
    // Save metadata
    const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
    metadata.lastUpdated = new Date().toISOString();
    metadata.totalQuestions = Math.max(metadata.totalQuestions || 0, questionNumber);
    metadata.completedQuestions = Object.keys(savedAnswers).length;
    localStorage.setItem(metadataKey, JSON.stringify(metadata));
    
    // Update overall progress with current activity timestamp
    this.updateOverallProgress(new Date().toISOString());
  }

  // Get worksheet progress
  getWorksheetProgress(worksheetId, type = 'maintenance') {
    const key = `worksheet-${type}-${worksheetId}-answers`;
    const metadataKey = `worksheet-${type}-${worksheetId}-metadata`;
    const timestampsKey = `worksheet-${type}-${worksheetId}-timestamps`;
    
    const answers = JSON.parse(localStorage.getItem(key) || '{}');
    const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
    const timestamps = JSON.parse(localStorage.getItem(timestampsKey) || '{}');
    
    return {
      worksheetId,
      type,
      answers,
      timestamps,
      metadata,
      completedQuestions: Object.keys(answers).length,
      totalQuestions: metadata.totalQuestions || 0,
      completionPercentage: metadata.totalQuestions > 0 ? 
        Math.round((Object.keys(answers).length / metadata.totalQuestions) * 100) : 0,
      lastUpdated: metadata.lastUpdated
    };
  }

  // Get all worksheet progress
  getAllProgress() {
    const allProgress = {};
    
    // Get maintenance worksheets progress
    this.worksheets.maintenance.forEach(worksheet => {
      allProgress[`maintenance-${worksheet.id}`] = this.getWorksheetProgress(worksheet.id, 'maintenance');
    });
    
    // Get fault worksheets progress
    this.worksheets.fault.forEach(worksheet => {
      allProgress[`fault-${worksheet.id}`] = this.getWorksheetProgress(worksheet.id, 'fault');
    });
    
    return allProgress;
  }

  // Update overall progress tracking
  updateOverallProgress(newLastActivity = null) {
    const allProgress = this.getAllProgress();
    
    // Get existing overall stats to preserve lastActivity (avoid recursion)
    let existingStats = null;
    const saved = localStorage.getItem('worksheet-overall-progress');
    if (saved) {
      try {
        existingStats = JSON.parse(saved);
      } catch (error) {
        console.warn('Error parsing existing stats:', error);
      }
    }
    
    const overallStats = {
      totalWorksheets: this.worksheets.maintenance.length + this.worksheets.fault.length,
      completedWorksheets: 0,
      totalQuestions: 0,
      completedQuestions: 0,
      lastActivity: newLastActivity || (existingStats ? existingStats.lastActivity : null) || null
    };
    
    Object.values(allProgress).forEach(progress => {
      if (progress.completedQuestions > 0) {
        overallStats.completedWorksheets++;
      }
      overallStats.totalQuestions += progress.totalQuestions;
      overallStats.completedQuestions += progress.completedQuestions;
    });
    
    overallStats.completionPercentage = overallStats.totalQuestions > 0 ? 
      Math.round((overallStats.completedQuestions / overallStats.totalQuestions) * 100) : 0;
    
    localStorage.setItem('worksheet-overall-progress', JSON.stringify(overallStats));
    return overallStats;
  }

  // Get overall progress
  getOverallProgress() {
    const saved = localStorage.getItem('worksheet-overall-progress');
    if (saved) {
      return JSON.parse(saved);
    }
    return this.updateOverallProgress();
  }

  // Export all data for teacher
  exportForTeacher() {
    const allProgress = this.getAllProgress();
    const overallStats = this.getOverallProgress();
    const exportData = {
      studentInfo: {
        name: localStorage.getItem('student-name') || 'Student',
        id: localStorage.getItem('student-id') || 'Unknown',
        exportDate: new Date().toISOString(),
        exportVersion: '1.0'
      },
      overallStats,
      worksheets: allProgress,
      summary: this.generateSummary(allProgress, overallStats)
    };
    
    return exportData;
  }

  // Generate summary for export
  generateSummary(allProgress, overallStats) {
    const summary = {
      totalWorksheets: overallStats.totalWorksheets,
      completedWorksheets: overallStats.completedWorksheets,
      totalQuestions: overallStats.totalQuestions,
      completedQuestions: overallStats.completedQuestions,
      overallCompletion: overallStats.completionPercentage + '%',
      averageScore: 0,
      timeSpent: 0,
      lastActivity: overallStats.lastActivity
    };
    
    // Calculate average score (if scoring is implemented)
    let totalScore = 0;
    let scoredWorksheets = 0;
    
    Object.values(allProgress).forEach(progress => {
      if (progress.completedQuestions > 0) {
        // This could be enhanced with actual scoring logic
        totalScore += progress.completionPercentage;
        scoredWorksheets++;
      }
    });
    
    summary.averageScore = scoredWorksheets > 0 ? Math.round(totalScore / scoredWorksheets) : 0;
    
    return summary;
  }

  // Export to JSON file
  exportToJSON() {
    const exportData = this.exportForTeacher();
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `worksheet-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // Import from JSON file
  importFromJSON(jsonData) {
    try {
      // Validate the data structure
      if (!jsonData.worksheets || !jsonData.studentInfo) {
        throw new Error('Invalid file format. Please use a JSON file exported from this app.');
      }

      // Clear existing data
      this.clearAllProgress();

      // Import student info
      if (jsonData.studentInfo.name) {
        localStorage.setItem('student-name', jsonData.studentInfo.name);
      }
      if (jsonData.studentInfo.id) {
        localStorage.setItem('student-id', jsonData.studentInfo.id);
      }

      // Import worksheet data
      Object.entries(jsonData.worksheets).forEach(([key, progress]) => {
        if (progress.answers) {
          Object.entries(progress.answers).forEach(([questionNumber, answer]) => {
            const [type, id] = key.split('-');
            this.saveAnswer(parseInt(id), parseInt(questionNumber), answer, type);
          });
        }
      });

      // Update overall progress
      this.updateOverallProgress();

      return { success: true, message: 'Import completed successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Import from file input
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          const result = this.importFromJSON(jsonData);
          resolve(result);
        } catch (error) {
          reject(new Error('Failed to parse JSON file: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  // Export to CSV
  exportToCSV() {
    const allProgress = this.getAllProgress();
    const overallStats = this.getOverallProgress();
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Worksheet Type,Worksheet ID,Title,Completed Questions,Total Questions,Completion %,Last Updated\n";
    
    // Add maintenance worksheets
    this.worksheets.maintenance.forEach(worksheet => {
      const progress = allProgress[`maintenance-${worksheet.id}`];
      csvContent += `Maintenance,${worksheet.id},"${worksheet.title}",${progress.completedQuestions},${progress.totalQuestions},${progress.completionPercentage}%,${progress.lastUpdated || 'Never'}\n`;
    });
    
    // Add fault worksheets
    this.worksheets.fault.forEach(worksheet => {
      const progress = allProgress[`fault-${worksheet.id}`];
      csvContent += `Fault,${worksheet.id},"${worksheet.title}",${progress.completedQuestions},${progress.totalQuestions},${progress.completionPercentage}%,${progress.lastUpdated || 'Never'}\n`;
    });
    
    // Add summary row
    csvContent += `SUMMARY,,,${overallStats.completedQuestions},${overallStats.totalQuestions},${overallStats.completionPercentage}%,${overallStats.lastActivity}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `worksheet-progress-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export to PDF (basic HTML report)
  exportToPDF() {
    const exportData = this.exportForTeacher();
    const reportHTML = this.generateReportHTML(exportData);
    
    // Create a new window with the report
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      reportWindow.print();
    }, 1000);
  }

  // Generate HTML report
  generateReportHTML(exportData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Worksheet Progress Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
          .worksheet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
          .worksheet-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .progress-bar { background: #ddd; height: 20px; border-radius: 10px; overflow: hidden; }
          .progress-fill { background: #4CAF50; height: 100%; transition: width 0.3s; }
          .completed { border-left: 4px solid #4CAF50; }
          .incomplete { border-left: 4px solid #ff9800; }
          .not-started { border-left: 4px solid #f44336; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Worksheet Progress Report</h1>
          <p><strong>Student:</strong> ${exportData.studentInfo.name}</p>
          <p><strong>Report Date:</strong> ${new Date(exportData.studentInfo.exportDate).toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2>Overall Summary</h2>
          <p><strong>Total Worksheets:</strong> ${exportData.overallStats.totalWorksheets}</p>
          <p><strong>Completed Worksheets:</strong> ${exportData.overallStats.completedWorksheets}</p>
          <p><strong>Total Questions:</strong> ${exportData.overallStats.totalQuestions}</p>
          <p><strong>Completed Questions:</strong> ${exportData.overallStats.completedQuestions}</p>
          <p><strong>Overall Completion:</strong> ${exportData.overallStats.completionPercentage}%</p>
          <p><strong>Last Activity:</strong> ${new Date(exportData.overallStats.lastActivity).toLocaleString()}</p>
        </div>
        
        <h2>Individual Worksheet Progress</h2>
        <div class="worksheet-grid">
          ${Object.entries(exportData.worksheets).map(([key, progress]) => {
            const worksheet = this.worksheets[progress.type].find(w => w.id === progress.worksheetId);
            const statusClass = progress.completedQuestions === 0 ? 'not-started' : 
                              progress.completionPercentage === 100 ? 'completed' : 'incomplete';
            return `
              <div class="worksheet-card ${statusClass}">
                <h3>${worksheet ? worksheet.title : `Worksheet ${progress.worksheetId}`}</h3>
                <p><strong>Type:</strong> ${progress.type}</p>
                <p><strong>Progress:</strong> ${progress.completedQuestions}/${progress.totalQuestions} questions</p>
                <p><strong>Completion:</strong> ${progress.completionPercentage}%</p>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${progress.completionPercentage}%"></div>
                </div>
                ${progress.lastUpdated ? `<p><strong>Last Updated:</strong> ${new Date(progress.lastUpdated).toLocaleString()}</p>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </body>
      </html>
    `;
  }

  // Clear all progress (for testing/reset)
  clearAllProgress() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('worksheet-') || key.startsWith('worksheet-overall-progress')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Set student information
  setStudentInfo(name, id) {
    localStorage.setItem('student-name', name);
    localStorage.setItem('student-id', id);
  }

  // Get student information
  getStudentInfo() {
    return {
      name: localStorage.getItem('student-name') || '',
      id: localStorage.getItem('student-id') || ''
    };
  }
}

// Global instance
const worksheetTracker = new WorksheetTracker();

// Enhanced submitAnswer function that integrates with tracking
function submitAnswerWithTracking(questionNumber) {
  const worksheetId = getUrlParameter('id');
  const type = getUrlParameter('type') || 'maintenance';
  
  const answerInput = document.querySelector(`[data-question="${questionNumber}"]`);
  if (!answerInput) return;
  
  const selectedOption = document.querySelector(`input[name="question-${questionNumber}"]:checked`);
  if (!selectedOption) {
    alert('Please select an answer before submitting.');
    return;
  }
  
  const answer = selectedOption.value;
  
  // Save with enhanced tracking
  worksheetTracker.saveAnswer(worksheetId, questionNumber, answer, type);
  
  // Show feedback
  const submitBtn = answerInput.querySelector('.submit-question-btn');
  if (submitBtn) {
    submitBtn.textContent = 'Answer Saved!';
    submitBtn.style.background = '#4CAF50';
    setTimeout(() => {
      submitBtn.textContent = 'Submit Answer';
      submitBtn.style.background = '#4CAF50';
    }, 2000);
  }
  
  // Show correct answer if available
  const correctAnswer = answerInput.querySelector('.correct-answer');
  if (correctAnswer) {
    correctAnswer.style.display = 'block';
  }
}

// Override the existing submitAnswer function
if (typeof submitAnswer === 'function') {
  // Keep the original function as backup
  window.submitAnswerOriginal = submitAnswer;
  // Replace with enhanced version
  window.submitAnswer = submitAnswerWithTracking;
} 