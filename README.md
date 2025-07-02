# 🏭 Closed Loop Maintenance PC Companion

> **Professional Industrial HMI Interface for Siemens S7 PLC Monitoring and Control**

A comprehensive Electron.js application designed for industrial maintenance operations, featuring real-time PLC communication, integrated HMI web interface, and advanced analytics dashboard.

![Closed Loop Maintenance Interface](https://github.com/user-attachments/assets/ce9a4d07-aa5c-4dae-85c7-8898fb86b566)

## 🚀 Features

### 🔧 **Core Functionality**
- **Real-time PLC Communication** - Direct connection to Siemens S7-1200/1500 PLCs
- **Integrated HMI Web Interface** - Embedded PLC web server with SSL certificate handling
- **Live Data Monitoring** - Analogue inputs, digital I/O, and system status tracking
- **Interactive Dashboard** - Drag-and-drop modular interface with real-time charts

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

### **Dashboard Navigation**
- **Home** - Overview and quick access to main features
- **PLC Controls** - Monitor and control PLC operations
- **Settings** - Configure application preferences
- **HMI Interface** - Full-screen process visualization and control

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

### **Styling Customization**
- `main.css` - Primary application styling
- `plc-details-css.css` - PLC details modal styling
- Modify CSS variables for theme customization

## 📁 Project Structure

```
closed-loop-maint/
├── assets/                     # Images and icons
│   ├── icons/                 # Application icons
│   ├── cad.png               # CAD equipment images
│   ├── cad2.png              # Secondary CAD image
│   └── matrix-logo.png       # Branding assets
├── db1.json                   # PLC data storage
├── dbFaults.json             # Fault logging
├── index.html                # Main application interface
├── hmi-interface.html        # Standalone HMI viewer
├── main.js                   # Electron main process
├── renderer.js               # Frontend application logic
├── preload.js                # Electron preload script
├── main.css                  # Primary stylesheet
├── package.json              # Dependencies and scripts
├── PDF_INTEGRATION_GUIDE.md  # PDF integration documentation
└── README.md                 # This file
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
- Add comments for complex logic
- Test thoroughly before submitting

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
