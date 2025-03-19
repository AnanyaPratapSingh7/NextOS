const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Remove menu bar
  mainWindow.setMenu(null);

  // Set Content Security Policy to allow 'unsafe-eval'
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self' 'unsafe-inline' 'unsafe-eval'"]
      }
    });
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  // Only open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC event handlers
ipcMain.on('generate-iso', (event, config) => {
  // This would be replaced with actual ISO generation logic
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 10;
    mainWindow.webContents.send('iso-progress', progress);
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      mainWindow.webContents.send('iso-complete', {
        success: true,
        isoPath: path.join(app.getPath('downloads'), 'nextos.iso'),
        isoName: 'nextos.iso'
      });
    }
  }, 500);
});

ipcMain.on('save-iso', async (event, { isoPath, isoName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save ISO',
    defaultPath: path.join(app.getPath('downloads'), isoName),
    filters: [
      { name: 'ISO Images', extensions: ['iso'] }
    ]
  });
  
  if (!canceled && filePath) {
    // This would be replaced with actual file copy logic
    mainWindow.webContents.send('iso-saved', {
      success: true,
      message: 'ISO saved successfully',
      filePath: filePath
    });
  } else {
    mainWindow.webContents.send('iso-cancelled', {
      message: 'ISO save cancelled'
    });
  }
});

// Handler for exiting the application
ipcMain.on('exit-app', () => {
  app.quit();
}); 