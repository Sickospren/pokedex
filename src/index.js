const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const started = require('electron-squirrel-startup');
const axios = require("axios");


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.handle("fetch-pokemon-list", async () => {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
    return response.data.results;
  } catch (error) {
    return { error: "Error al obtener la lista de Pokémon" };
  }
});

ipcMain.handle("fetch-pokemon-details", async (_, pokemon) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    return response.data;
  } catch (error) {
    return { error: "No se encontró el Pokémon" };
  }
});
