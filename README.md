# 🏭 Closed Loop Maintenance PC Companion

> **Professional Industrial HMI Interface for Siemens S7 PLC Monitoring and Control**

A comprehensive Electron.js application designed for industrial maintenance operations, featuring real-time PLC communication, integrated HMI web interface, and advanced analytics dashboard.

![image](https://github.com/user-attachments/assets/10d6e646-9ce5-4f1e-bf02-3da5c571e8c1)


## 🆕 What's New in Version 0.5.0

### 🎓 **Complete Student & Teacher Management System**
- **Student Portal** with comprehensive answer review and progress tracking
- **Teacher Dashboard** with analytics, export capabilities, and performance insights
- **Answer Comparison System** showing detailed feedback for all 66 questions across 22 worksheets

### 📚 **Enhanced Interactive Learning**
- **All 14 Maintenance Worksheets** now feature enhanced format with interactive steps
- **PID Control Simulation** with real-time parameter tuning and performance metrics
- **Educational "So What?" Sections** explaining real-world significance for each topic
- **Interactive Step Guides** with hands-on activities for practical learning

### 🎨 **Improved User Experience**
- **Consistent Navigation** across all screens with Student Portal and Teacher Dashboard access
- **Professional Styling** with modern gradients, hover effects, and responsive design
- **Enhanced Visual Design** with better section organization and visual hierarchy

## 🎓 Training Curriculum

### 📘 **CP0539 - Industrial Maintenance**
Interactive training module with 14 comprehensive worksheets covering:
- Control Systems Fundamentals
- Emergency Stop Systems
- LED Status Indicators
- PLC Maintenance
- HMI Systems
- Pump Maintenance
- Control Valve Operations
- Sensor Calibration
- Network Communication
- Data Logging Systems
- Power Supply Systems
- Safety Interlocks
- Control Panel Maintenance
- Documentation Management

### 🔍 **CP6773 - Troubleshooting & Fault-Finding**
Real-world fault scenarios for practical training:
- Titanium Forging Temperature Control
- Pharmaceutical Clean Room HVAC
- CNC Machines Factory Cooling
- Server Room Temperature Control
- Potash Mine Brine System
- Food Processing Sterilizer
- Injection Molding Temperature
- pH Control Systems

Each scenario includes:
- Detailed situation description
- Interactive questions
- Visual diagrams
- Answer tracking
- Progress saving

## 🚀 Features

### 🔧 **Core Functionality**
- **Real-time PLC Communication** - Direct connection to Siemens S7-1200/1500 PLCs
- **Integrated HMI Web Interface** - Embedded PLC web server with SSL certificate handling
- **Live Data Monitoring** - Analogue inputs, digital I/O, and system status tracking
- **Interactive Dashboard** - Drag-and-drop modular interface with real-time charts

### 🎓 **NEW: Student Portal & Teacher Dashboard**
- **Student Portal** - Complete answer review across all 22 worksheets (14 maintenance + 8 fault scenarios)
- **Teacher Dashboard** - Comprehensive analytics, progress tracking, and data export capabilities
- **Answer Tracking** - Detailed comparison of student answers vs. correct answers with timestamps
- **Export Functionality** - Multiple export formats (JSON, CSV, Teacher Reports) for assessment
- **Progress Analytics** - Visual progress indicators, completion statistics, and performance metrics

### 📊 **Analytics & Monitoring**
- **Real-time Charts** - Analogue input visualization with Chart.js
- **Connection History** - PLC status tracking and historical data
- **Event Logging** - E-Stop and LED state change monitoring
- **Status Indicators** - Visual connection status with animated circles

### 🎨 **User Interface**
- **Modern Design** - Professional dark theme with Matrix branding
- **Responsive Layout** - Adaptive grid system with draggable components
- **CAD Integration** - Industrial equipment imagery for context
- **Smart Splash Screen** - Elegant startup animation that only shows on first boot
- **Persistent Settings** - User preferences saved between sessions
- **Customizable HMI View** - Adjustable zoom levels with automatic persistence

### 📚 **Enhanced Training Features**
- **Interactive Worksheets** - All 14 maintenance worksheets with enhanced format and interactive content
- **PID Simulation** - Real-time PID control system simulation with parameter tuning in Worksheet 1
- **Answer Comparison** - Detailed feedback showing student answers vs. correct answers for all questions
- **Progress Tracking** - Save and resume your training progress with timestamps
- **Visual Learning** - CAD diagrams, system images, and interactive step-by-step guides
- **Practical Scenarios** - Real industrial fault-finding exercises with comprehensive feedback
- **Educational Content** - "So What?" sections explaining real-world significance for each topic
- **Organized Curriculum** - Structured learning path with clear progression and completion tracking

### ⚙️ **Settings & Customization**
- **Application Settings** - Centralized settings page for all configurations
- **HMI Preferences** - Customizable zoom levels and refresh intervals
- **Network Configuration** - Easy IP address management for PLC connections
- **UI Preferences** - Persistent user interface customizations

### 🔒 **Security & Reliability**
- **Offline Operation** - No internet dependency for core functionality
- **SSL Certificate Handling** - Secure HMI connections with certificate bypass
- **Error Handling** - Comprehensive fault detection and user notifications
- **Data Persistence** - Local JSON database for settings and logs

## 🛠️ Technology Stack

- **Frontend**: Electron.js, HTML5, CSS3, JavaScript ES6+
- **Charts**: Chart.js for real-time data visualization
- **PLC Communication**: Custom Node.js modules for S7 protocol
- **Database**: JSON-based local storage
- **UI Framework**: Custom CSS Grid with drag-and-drop functionality
- **Security**: Custom SSL certificate handling for industrial networks

## 📋 Prerequisites

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Included with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Windows 10/11** - Primary development and deployment platform
- **Network Access** - To Siemens S7 PLC (typically 192.168.x.x range)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/hadefuwa/closed-loop-maint.git
cd closed-loop-maint
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Settings
1. Launch the application
2. Click the Settings button in the navigation bar
3. Configure your preferences:
   - PLC IP Address
   - Default HMI Zoom Level
   - Auto-refresh Interval
4. Click Save to apply changes

### 4. Launch Application
```bash
npm start
```

## 📖 Usage Guide

### **Initial Setup**
1. **Launch Application** - Run `npm start` to open the interface
2. **Configure Settings** - Set your preferences in the Settings page
3. **Test Connection** - Verify PLC communication status
4. **Access HMI** - View integrated web interface for process control

### **Training Modules**
1. **CP0539 - Industrial Maintenance**
   - Access worksheets from the main dashboard
   - Complete interactive questions
   - Progress is automatically saved
   - Review completed worksheets anytime

2. **CP6773 - Troubleshooting**
   - Select fault scenarios to analyze
   - Work through diagnostic questions
   - Save responses for later review
   - Track completion progress

### **Dashboard Navigation**
- **Home** - Overview and quick access to main features
- **Worksheets** - Access all 14 maintenance worksheets and 8 fault scenarios
- **PLC Controls** - Monitor and control PLC operations
- **Settings** - Configure application preferences
- **Student Portal** - Review all answers and track progress across worksheets
- **Teacher Dashboard** - Comprehensive analytics and student progress management

### **HMI Interface Features**
- **Zoom Controls** - Adjust view size with persistent settings
- **Auto-refresh** - Configure automatic page updates
- **Fullscreen Mode** - Maximize HMI view for better visibility
- **Quick Reset** - Return to default zoom level instantly

### **Advanced Features**
- **Drag & Drop** - Rearrange dashboard components as needed
- **Print Charts** - Generate printable reports of analogue data
- **Fault Management** - Acknowledge and track system faults

## 🔧 Configuration

### **PLC Settings**
```javascript
// Default configuration in renderer.js
const defaultPLCConfig = {
    ip: '192.168.7.100',
    rack: 0,
    slot: 1,
    hmiUrl: 'https://192.168.7.101/device/WebRH'
};
```

### **Database Structure**
- `db1.json` - PLC data storage (inputs, outputs, analogue values)
- `dbFaults.json` - Fault logging and acknowledgment tracking
- `dbMaintenanceScenarios.json` - CP0539 worksheet content
- `dbFaultScenarios.json` - CP6773 fault scenario content

### **Styling Customization**
- `main.css` - Primary application styling
- `plc-details-css.css` - PLC details modal styling
- Modify CSS variables for theme customization

## 📁 Project Structure

```
closed-loop-maint/
├── assets/                    # Images and icons
│   ├── icons/                # Application icons
│   ├── scenarios/           # Training scenario diagrams
│   ├── cad.png              # CAD equipment images
│   ├── cad2.png             # Secondary CAD image
│   └── matrix-logo.png      # Branding assets
├── db1.json                  # PLC data storage
├── dbFaults.json            # Fault logging
├── dbMaintenanceScenarios.json # CP0539 content
├── dbFaultScenarios.json    # CP6773 content
├── index.html               # Main application interface
├── hmi-interface.html       # Standalone HMI viewer
├── main.js                  # Electron main process
├── renderer.js              # Frontend application logic
├── scenario-popup.js        # Training scenario handler
├── preload.js               # Electron preload script
├── main.css                 # Primary stylesheet
├── package.json             # Dependencies and scripts
├── PDF_INTEGRATION_GUIDE.md # PDF integration documentation
└── README.md                # This file
```

## 🔍 Troubleshooting

### **Common Issues**

**PLC Connection Failed**
- Verify PLC IP address and network connectivity
- Check firewall settings for port access
- Ensure PLC web server is enabled

**HMI Interface Not Loading**
- Confirm HMI URL is correct
- Check SSL certificate settings
- Verify PLC web server configuration

**Charts Not Updating**
- Check PLC communication status
- Verify analogue input configuration
- Restart application if data appears stale

**Training Content Not Loading**
- Check JSON file integrity
- Clear browser cache
- Verify file permissions

**Performance Issues**
- Close unnecessary applications
- Check system resources (CPU/Memory)
- Reduce chart update frequency if needed

### **Debug Mode**
Enable debug logging by modifying `main.js`:
```javascript
// Add to main.js for detailed logging
console.log('Debug mode enabled');
```

## 🤝 Contributing

We welcome contributions to improve the Closed Loop Maintenance PC Companion! 

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Use clear, descriptive variable names
- Follow existing code formatting
- Document new features thoroughly
- Test all changes before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About Matrix

This application is developed by Matrix for industrial maintenance operations. For support or inquiries, please contact our development team.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/hadefuwa/closed-loop-maint/issues)
- **Documentation**: See `PDF_INTEGRATION_GUIDE.md` for PDF integration
- **Updates**: Check releases for latest features and bug fixes

---

**Built with ❤️ for Industrial Maintenance Professionals**
