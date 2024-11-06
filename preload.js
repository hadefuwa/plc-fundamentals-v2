const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    receiveData: (callback) => ipcRenderer.on('plc-data', (_, data) => callback(data)),
    receiveStatus: (callback) => ipcRenderer.on('plc-status', (_, status) => callback(status)),
    receiveStats: (callback) => ipcRenderer.on('stats-update', (_, stats) => callback(stats)),
    updatePLCAddress: (address) => ipcRenderer.send('update-plc-address', address),
    connectPLC: () => ipcRenderer.send('connect-plc'),
    writePLC: () => ipcRenderer.send('write-plc'),
    openDetails: (dataType) => ipcRenderer.send('open-details', dataType),
    receiveInitData: (callback) => ipcRenderer.on('init-data', (_, data) => callback(data))
}) 