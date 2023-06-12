const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    downFact: (pdf) => ipcRenderer.send('load-pdf', pdf),
    openSaveDialog: (title,data) => ipcRenderer.invoke('dialog:saveFile',title,data),
    dd: (dd) => ipcRenderer.send('dd', dd),
})