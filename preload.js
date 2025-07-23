const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    // Navigation
    navigate: (page) => ipcRenderer.send('navigate', page),
    
    // PDF handling
    openPDF: (pdfPath) => ipcRenderer.invoke('open-pdf', pdfPath),
    
    // Settings management
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
}) 