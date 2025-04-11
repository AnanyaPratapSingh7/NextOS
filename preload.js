// Preload script
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    // Whitelist channels
    let validChannels = ['generate-iso', 'save-iso', 'exit-app'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      'iso-progress',
      'iso-complete',
      'iso-error',
      'iso-saved',
      'iso-cancelled'
    ];
    if (validChannels.includes(channel)) {
      // Remove the event listener to avoid memory leaks
      ipcRenderer.removeAllListeners(channel);
      // Add a new event listener
      ipcRenderer.on(channel, (_, ...args) => func(...args));
    }
  }
}); 