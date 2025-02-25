const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");

let mainWindow;
let inicioWindow;
let pokedexWindow;
let teamsWindow;
let detailsWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));
    mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(createMainWindow);

function checkAndShowMainWindow() {
    if (!pokedexWindow && !teamsWindow) {
        mainWindow.show();
    }
}

//Abrir Inicio y ocultar index
ipcMain.on("open-inicio", (user) => {
    if (!inicioWindow) {
        inicioWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        inicioWindow.loadFile(path.join(__dirname, "inicio.html"));

        pokedexWindow.webContents.on('did-finish-load', () => {
            // Pasar el nombre de usuario a la ventana de inicio
            pokedexWindow.webContents.send('set-username', user);
          });

        inicioWindow.on("closed", () => {
            inicioWindow = null;
            checkAndShowMainWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        mainWindow.hide(); // Ocultar el Inicio
    }
});

//Abrir Pokédex y ocultar Inicio
ipcMain.on("open-pokedex", () => {
    if (!pokedexWindow) {
        pokedexWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        pokedexWindow.loadFile(path.join(__dirname, "pokedex.html"));

        pokedexWindow.on("closed", () => {
            pokedexWindow = null;
            checkAndShowMainWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        mainWindow.hide(); // Ocultar el Inicio
    }
});

//Abrir Gestión de Equipos y ocultar Inicio
ipcMain.on("open-teams", () => {
    if (!teamsWindow) {
        teamsWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        teamsWindow.loadFile(path.join(__dirname, "equipos.html"));

        teamsWindow.on("closed", () => {
            teamsWindow = null;
            checkAndShowMainWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        mainWindow.hide(); // Ocultar el Inicio
    }
});

//Cerrar Gestión de Equipos
ipcMain.on("close-teams-window", () => {
    if (teamsWindow) {
        teamsWindow.close();
    }
});

//Obtener la lista de Pokémon
ipcMain.handle("fetch-pokemon-list", async () => {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        return response.data.results;
    } catch (error) {
        console.error("Error al obtener la lista de Pokémon:", error);
        return { error: "No se pudieron obtener los Pokémon." };
    }
});

//Obtener detalles de un Pokémon
ipcMain.handle("fetch-pokemon-details", async (_, pokemon) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        return response.data;
    } catch (error) {
        return { error: "No se encontró el Pokémon" };
    }
});

//Abrir ventana de detalles del Pokémon
ipcMain.on("open-details-window", async (_, pokemon) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        openDetailsWindow(response.data);
    } catch (error) {
        openDetailsWindow({ error: "No se encontró el Pokémon" });
    }

    //Ocultar la Pokédex si está abierta
    if (pokedexWindow) {
        pokedexWindow.hide();
    }
});

function openDetailsWindow(pokemonData) {
    if (!detailsWindow) {
        detailsWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        detailsWindow.loadFile(path.join(__dirname, "detalles.html"));

        detailsWindow.on("closed", () => {
            detailsWindow = null;
            
            // Mostrar la Pokédex de nuevo si estaba oculta
            if (pokedexWindow) {
                pokedexWindow.show();
            }
        });

        detailsWindow.once("ready-to-show", () => {
            detailsWindow.webContents.send("pokemon-data", pokemonData);
        });
    }
}

//Cerrar ventana de detalles
ipcMain.on("close-details-window", () => {
    if (detailsWindow) {
        detailsWindow.close();
    }
});

//Cerrar ventana de pokedex
ipcMain.on("close-pokedex-window", () => {
    if (pokedexWindow) {
        pokedexWindow.close();
    }
});

//Cerrar la app cuando no hay ventanas abiertas (excepto en macOS)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
