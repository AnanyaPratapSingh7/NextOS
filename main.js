const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';
const ISOGenerator = require('./src/services/isoGenerator');

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
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log('Loading index.html from:', indexPath);
  
  mainWindow.loadFile(indexPath).catch(error => {
    console.error('Error loading index.html:', error);
  });

  // Open DevTools by default
  mainWindow.webContents.openDevTools();

  // Log any errors that occur during page load
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}).catch(error => {
  console.error('Error during app initialization:', error);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC event handlers
ipcMain.on('generate-iso', async (event, config) => {
  try {
    const generator = new ISOGenerator(config);
    let progress = 0;
    
    // Send initial progress
    mainWindow.webContents.send('iso-progress', progress);
    
    // Start ISO generation
    const result = await generator.generateISO();
    
    if (result.success) {
      mainWindow.webContents.send('iso-complete', {
        success: true,
        isoPath: result.isoPath,
        isoName: 'nextos.iso'
      });
    } else {
      mainWindow.webContents.send('iso-error', {
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error generating ISO:', error);
    mainWindow.webContents.send('iso-error', {
      message: error.message
    });
  }
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
    try {
      // Copy the ISO file to the selected location
      fs.copyFileSync(isoPath, filePath);
      mainWindow.webContents.send('iso-saved', {
        success: true,
        message: 'ISO saved successfully',
        filePath: filePath
      });
    } catch (error) {
      console.error('Error saving ISO:', error);
      mainWindow.webContents.send('iso-error', {
        message: 'Error saving ISO: ' + error.message
      });
    }
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