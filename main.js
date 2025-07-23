/**
 * @fileoverview Main process for Curriculum Application
 * @author Hamed Adefuwa
 * @version 2.0.0
 * @date 2024-12-23
 * 
 * @description
 * This is the main process for an Electron application focused on curriculum delivery.
 * It handles:
 * - Basic window management
 * - Navigation between curriculum pages
 * - PDF viewing capabilities
 * - Simple settings management
 * 
 * @requires electron
 * @requires path
 * @requires fs
 * 
 * @copyright Copyright (c) 2024 Matrix TSL
 * @license MIT
 */

// Import required Electron modules for app management and window creation
const { app, BrowserWindow, ipcMain, protocol, shell } = require('electron');

// Import path and fs modules for settings management
const path = require('path');
const fs = require('fs');

// Add command line switches for PDF viewing and file access
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('allow-file-access-from-file-urls');

// Suppress Electron security warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// Initialize main application variables
let win;                          // Main application window
let settings = {};                // Application settings

// Default settings
const defaultSettings = {
    theme: 'dark',
    fontSize: 'medium',
    autoSave: true
};

// Load settings from file
function loadSettings() {
    try {
        const settingsPath = path.join(__dirname, 'settings.json');
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf8');
            settings = { ...defaultSettings, ...JSON.parse(data) };
        } else {
            settings = defaultSettings;
            saveSettings();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        settings = defaultSettings;
    }
}

// Save settings to file
function saveSettings() {
    try {
        const settingsPath = path.join(__dirname, 'settings.json');
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Function to create the main application window
function createWindow() {
    // Create the browser window
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
            webviewTag: true,
            allowFileAccessFromFileURLs: true,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false,
        icon: path.join(__dirname, 'assets', 'icons', 'matrix-icon.png'),
    });

    // Load the app
    win.loadFile('index.html');
    
    // Allow navigation between pages
    win.webContents.on('will-navigate', (event, url) => {
        const parsedUrl = new URL(url);
        const pathname = parsedUrl.pathname.toLowerCase();
        if (pathname.endsWith('index.html') || 
            pathname.endsWith('worksheets.html') ||
            pathname.endsWith('cp0539-worksheets.html') ||
            pathname.endsWith('cp6773-worksheets.html') ||
            pathname.endsWith('worksheet.html')) {
            // Allow navigation to our app pages
        } else {
            event.preventDefault();
        }
    });

    // Show window when ready
    win.once('ready-to-show', () => {
        win.maximize();
        win.show();
    });

    win.on('closed', () => {
        win = null;
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        win.webContents.loadURL(url);
        return { action: 'deny' };
    });
}

// IPC handlers for communication with renderer process
ipcMain.handle('get-settings', () => {
    return settings;
});

ipcMain.handle('save-settings', (event, newSettings) => {
    settings = { ...settings, ...newSettings };
    saveSettings();
    return { success: true };
});

ipcMain.on('navigate', (event, page) => {
    if (win) {
        // Handle query parameters for worksheet navigation
        if (page.includes('worksheet.html')) {
            const queryString = page.split('?')[1];
            if (queryString) {
                win.loadFile('worksheet.html', { query: queryString });
            } else {
                win.loadFile('worksheet.html');
            }
        } else {
            win.loadFile(page);
        }
    }
});

// Handle PDF opening with native OS viewer
ipcMain.handle('open-pdf', async (event, pdfPath) => {
    const fullPath = path.join(__dirname, pdfPath);
    if (fs.existsSync(fullPath)) {
        try {
            // Open PDF in the system's default PDF viewer
            await shell.openPath(fullPath);
            return { success: true, path: fullPath };
        } catch (error) {
            console.error('Error opening PDF:', error);
            return { success: false, error: 'Failed to open PDF in native viewer' };
        }
    } else {
        return { success: false, error: 'PDF file not found' };
    }
});

// App event handlers
app.whenReady().then(() => {
    loadSettings();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle app quit
app.on('before-quit', () => {
    saveSettings();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

