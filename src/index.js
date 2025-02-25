const { app, BrowserWindow, ipcMain } = require("electron");
const { comprobarLogin, registrarUsuario, annadirEquipo, eliminarEquipo, obtenerEquiposDeUsuario } = require("./firebase");
const path = require("path");
const axios = require("axios");
const dataForge = require("data-forge");

let mainWindow;
let inicioWindow;
let pokedexWindow;
let teamsWindow;
let detailsWindow;
let statsWindow;

const width = 1000;
const height = 700;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
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
    if (!inicioWindow) {
        mainWindow.show();
    }
}

function checkAndShowInicioWindow() {
    if (!pokedexWindow && !teamsWindow) {
        inicioWindow.show();
    }
}

//Abrir Inicio y ocultar index
ipcMain.on("open-inicio", () => {
    if (!inicioWindow) {
        inicioWindow = new BrowserWindow({
            width: width,
            height: height,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        inicioWindow.loadFile(path.join(__dirname, "inicio.html"));
        mainWindow.on("closed", () => (mainWindow = null));

        inicioWindow.on("closed", () => {
            inicioWindow = null;
            checkAndShowMainWindow(); // Si no hay ventanas abiertas, mostrar el login
        });

        mainWindow.hide(); // Ocultar el Inicio
    }
});

//Abrir Pokédex y ocultar Inicio
ipcMain.on("open-pokedex", () => {
    if (!pokedexWindow) {
        pokedexWindow = new BrowserWindow({
            width: width,
            height: height,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        pokedexWindow.loadFile(path.join(__dirname, "pokedex.html"));

        pokedexWindow.on("closed", () => {
            pokedexWindow = null;
            checkAndShowInicioWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        mainWindow.hide(); // Ocultar el Inicio
    }
});

//Abrir Gestión de Equipos y ocultar Inicio
ipcMain.on("open-teams", () => {
    if (!teamsWindow) {
        teamsWindow = new BrowserWindow({
            width: width,
            height: height,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        teamsWindow.loadFile(path.join(__dirname, "equipos.html"));

        teamsWindow.on("closed", () => {
            teamsWindow = null;
            checkAndShowInicioWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
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

//Funciones de Firebase
ipcMain.handle("comprobar-login", async (_, user, pass) => {
    try {
        const result = await comprobarLogin(user, pass);
        return result;
    } catch (error) {
        return { error: "Fallo en la comprobación del login" };
    }
});

ipcMain.handle("registrar-usuario", async (_, user, pass) => {
    try {
        const result = await registrarUsuario(user, pass);
        return result;
    } catch (error) {
        return { error: "Fallo en el registro en index" };
    }
});

ipcMain.handle("obtener-equipos", async (_, user) => {
    try {
        const result = await obtenerEquiposDeUsuario(user);
        return result;
    } catch (error) {
        return { error: "Fallo al obtener los equipos" };
    }
});

ipcMain.handle("annadir-equipo", async (_, pokemonArray, user) => {
    console.log("INDEX")
    try {
        const result = await annadirEquipo(pokemonArray, user);
        return result;
    } catch (error) {
        return { error: "Fallo al guardar el equipo" };
    }
});

ipcMain.handle("eliminar-equipo", async (_, docId) => {
    try {
        const result = await eliminarEquipo(docId);
        return result;
    } catch (error) {
        return { error: "Fallo al eliminar el equipo" };
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
            width: width,
            height: height,
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

//-------------ESTADISTICAS-------------
//ventana para las estadisticas
ipcMain.on("open-stats", () => {
    if (!statsWindow) {
        statsWindow = new BrowserWindow({
            width: width,
            height: height,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        statsWindow.loadFile(path.join(__dirname, "stats.html"));

        statsWindow.on("closed", () => {
            statsWindow = null;
            checkAndShowInicioWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        mainWindow.hide(); // Ocultar el Inicio
    }
});

ipcMain.handle("fetch-stats", async () => {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        const pokemons = response.data.results;

        // Obtener detalles de cada Pokémon
        const pokemonDetalles = await Promise.all(
            pokemons.map(async (pokemon) => {
                const res = await axios.get(pokemon.url);
                return res.data;
            })
        );

        // Extraer tipos de cada Pokémon
        const tipos = pokemonDetalles.flatMap(poke =>
            poke.types.map(t => t.type.name)
        );

        // Crear un DataFrame y contar por tipo
        const df = new dataForge.DataFrame({ values: tipos });
        const conteoTipos = df.groupBy(tipo => tipo)
            .select(group => ({
                tipo: group.first(),
                cantidad: group.count(),
            }))
            .inflate();

        return conteoTipos.toArray();
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return { error: "No se pudieron calcular las estadísticas." };
    }
});

ipcMain.handle("fetch-stats-usuario", async (_,user) => {
    const result = await obtenerEquiposDeUsuario(user);
    
});
