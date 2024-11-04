const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onPLCData: (callback) => ipcRenderer.on('plc-data', callback),
    onPLCStatus: (callback) => ipcRenderer.on('plc-status', callback)
}) 