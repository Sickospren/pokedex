const { app, BrowserWindow, ipcMain } = require("electron");
const { comprobarLogin, registrarUsuario, annadirEquipo, eliminarEquipo, obtenerEquiposDeUsuario } = require("./firebase");
const path = require("path");
const axios = require("axios");
const dataForge = require("data-forge");
const { DataFrame } = dataForge;
require('dotenv').config();

let mainWindow;
let inicioWindow;
let pokedexWindow;
let teamsWindow;
let detailsWindow;
let statsWindow;

const width = 1000;
const height = 700;

//Primera ventana
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
//inicio del programa
app.whenReady().then(createMainWindow);

function checkAndShowMainWindow() {
    if (!inicioWindow) {
        mainWindow.show();
    }
}

function checkAndShowInicioWindow() {
    if (!pokedexWindow && !teamsWindow && !statsWindow) {
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

        inicioWindow.loadFile(path.join(__dirname, "./views/inicio.html"));
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

        pokedexWindow.loadFile(path.join(__dirname, "./views/pokedex.html"));
        mainWindow.on("closed", () => (mainWindow = null));

        pokedexWindow.on("closed", () => {
            pokedexWindow = null;
            checkAndShowInicioWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        inicioWindow.hide(); // Ocultar el Inicio
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

        teamsWindow.loadFile(path.join(__dirname, "./views/equipos.html"));

        teamsWindow.on("closed", () => {
            teamsWindow = null;
            checkAndShowInicioWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        inicioWindow.hide(); // Ocultar el Inicio
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
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1025");
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

        detailsWindow.loadFile(path.join(__dirname, "./views/detalles.html"));
        mainWindow.on("closed", () => (mainWindow = null));

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
        statsWindow.loadFile(path.join(__dirname, "./views/stats.html"));
        mainWindow.on("closed", () => (mainWindow = null));

        statsWindow.on("closed", () => {
            statsWindow = null;
            checkAndShowInicioWindow();
        });

        inicioWindow.hide();
    }
});

//metodo para obtner la cantidad de tipos en la primera generacion
ipcMain.handle("obtener-tipos-151", async () => {
    const tiposPosibles = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic",
        "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
    ];

   
    const obtenerDatosPokemon = async (id) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return {
                id: response.data.id,
                tipos: response.data.types.map(t => t.type.name),
            };
             //de cada pokemon obtendremos los siguientes datos {"id": x,"tipos": ["tipo1", "tipo2"]}
        } catch (error) {
            console.error(`Error al obtener datos de ${id}:`, error.message);
            return null;
        }
    };

    const datosPokemons = [];
    for (let i = 1; i <= 151; i++) {
        const datos = await obtenerDatosPokemon(i);
        if (datos) {
            datosPokemons.push(datos);
        }
    }

    const df = new DataFrame(datosPokemons);

    //df para contar los pokemons por tipo
    const tiposExpandidos = df
        //si el pokemon tiene varios tipos, los separamos
        .selectMany(row => row.tipos.map(tipo => ({ tipo })))
        //agrupamos las filas del mismo tipo
        .groupBy(row => row.tipo)
        .select(group => ({
            //obtiene el nombre del tipo de la primera fila de cada grupo
            tipo: group.first().tipo,
            //cuenta cuantas filas hay en el grupo
            cantidad: group.count()
        }))
        .toArray();

    //array con todos los tipos inicializados a 0
    const conteoTipos = Object.fromEntries(tiposPosibles.map(tipo => [tipo, 0]));

    for (const tipoData of tiposExpandidos) {
        conteoTipos[tipoData.tipo] = tipoData.cantidad;
    }

    return Object.entries(conteoTipos).map(([tipo, cantidad]) => ({ tipo, cantidad })).sort((a, b) => b.cantidad - a.cantidad);;
});

ipcMain.handle("obtener-top3-jugador", async (_, username) => {
    try {
        const equipos = await obtenerEquiposDeUsuario(username);
        if (!equipos) {
            return { error: "El usuario no tiene equipos registrados." };
        }

        const pokemonList = Object.values(equipos).flat();

        if (pokemonList.length === 0) {
            return { error: "El usuario no tiene Pokémon en sus equipos." };
        }

        const obtenerDatosPokemon = async (id) => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                return {
                    id: response.data.id,
                    nombre: response.data.name.toUpperCase(),
                };
            } catch (error) {
                console.error(`Error al obtener datos de ${id}:`, error.message);
                return null;
            }
        };

        const datosPokemons = [];
        for (const p of pokemonList) {
            const datos = await obtenerDatosPokemon(p.id);
            if (datos !== null) {
                datosPokemons.push(datos);
            }
        }

        if (datosPokemons.length === 0) {
            return { error: "No se pudieron obtener datos de los Pokémon." };
        }

        const df = new DataFrame(datosPokemons);

        const conteoPokemons = df.groupBy(row => row.nombre)
            .select(group => ({
                nombre: group.first().nombre,
                cantidad: group.count()
            }))
            .orderByDescending(row => row.cantidad)
            .toArray();

        if (conteoPokemons.length === 0) {
            return { error: "No hay datos suficientes para calcular el top 3." };
        }

        //retornamos las 3 primeras posiciones
        return conteoPokemons.slice(0, 3);

    } catch (error) {
        console.error("Error en obtener-top3-jugador:", error);
        return { error: "Fallo al obtener los equipos" };
    }
});

ipcMain.handle("obtener-tipos-jugador", async (_, username) => {

    const tiposPosibles = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic",
        "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
    ];

    const equipos = await obtenerEquiposDeUsuario(username);

    const pokemonList = Object.values(equipos).flat();

    const obtenerDatosPokemon = async (id) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return {
                id: response.data.id,
                tipos: response.data.types.map(t => t.type.name), 
            };
        } catch (error) {
            console.error(`Error al obtener datos de ${id}:`, error.message);
            return null;
        }
    };

    const datosPokemons = [];
    for (let i = 0; i < pokemonList.length; i++) {
        const datos = await obtenerDatosPokemon(pokemonList[i].id);
        if (datos) {
            datosPokemons.push(datos);
        }
    }

    //mismos pasos que en obtener datos 151
    const df = new DataFrame(datosPokemons);
    const tiposExpandidos = df
        .selectMany(row => row.tipos.map(tipo => ({ tipo })))
        .groupBy(row => row.tipo)
        .select(group => ({
            tipo: group.first().tipo,
            cantidad: group.count()
        }))
        .toArray();

    const conteoTipos = Object.fromEntries(tiposPosibles.map(tipo => [tipo, 0]));

    for (const tipoData of tiposExpandidos) {
        conteoTipos[tipoData.tipo] = tipoData.cantidad;
    }

    const tiposFinal = Object.entries(conteoTipos).map(([tipo, cantidad]) => ({ tipo, cantidad }));
    return tiposFinal.sort((a, b) => b.cantidad - a.cantidad);

});
