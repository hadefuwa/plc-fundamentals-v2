const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    receiveData: (callback) => ipcRenderer.on('plc-data', (_event, value) => callback(value)),
    receiveStatus: (callback) => ipcRenderer.on('plc-status', (_event, value) => callback(value)),
    receiveStats: (callback) => ipcRenderer.on('stats-update', (_event, value) => callback(value)),
    updatePLCAddress: (ipAddress) => ipcRenderer.send('update-plc-address', ipAddress),
    connectPLC: () => ipcRenderer.send('connect-plc'),
    openAnalogueWindow: () => ipcRenderer.send('open-analogue-window')
}) 