const { app, BrowserWindow, ipcMain } = require("electron");
const { comprobarLogin, registrarUsuario, annadirEquipo, eliminarEquipo, obtenerEquiposDeUsuario } = require("./firebase");
const path = require("path");
const axios = require("axios");
const dataForge = require("data-forge");
const { DataFrame } = dataForge;


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
        statsWindow.webContents.openDevTools();

        statsWindow.on("closed", () => {
            statsWindow = null;
            checkAndShowInicioWindow(); // Si no hay ventanas abiertas, mostrar el Inicio
        });

        mainWindow.hide(); // Ocultar el Inicio
    }
});

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
                nombre: response.data.name.toUpperCase(),
                tipos: response.data.types.map(t => t.type.name),
            };
        } catch (error) {
            console.error(`Error al obtener datos de ${id}:`, error.message);
            return null;
        }
    };

    const datosPokemons = [];
    for (let i = 1; i <= 151; i++) {
        const datos = await obtenerDatosPokemon(i);
        if (datos) datosPokemons.push(datos);
    }

    const df = new DataFrame(datosPokemons);

    // Contar Pokémon por tipo
    const tiposExpandidos = df
        .selectMany(row => row.tipos.map(tipo => ({ tipo })))
        .groupBy(row => row.tipo)
        .select(group => ({
            tipo: group.first().tipo,
            cantidad: group.count()
        }))
        .toArray();

    // Crear objeto con todos los tipos inicializados en 0
    const conteoTipos = Object.fromEntries(tiposPosibles.map(tipo => [tipo, 0]));

    for (const tipoData of tiposExpandidos) {
        conteoTipos[tipoData.tipo] = tipoData.cantidad;
    }

    return Object.entries(conteoTipos).map(([tipo, cantidad]) => ({ tipo, cantidad }));
});

ipcMain.handle("obtener-top3-jugador", async (_, username) => {
    try {
        const equipos = await obtenerEquiposDeUsuario(username);
        if (!equipos || Object.keys(equipos).length === 0) {
            return { error: "El usuario no tiene equipos registrados." };
        }

        const pokemonList = Object.values(equipos).flat();

        if (pokemonList.length === 0) {
            return { error: "El usuario no tiene Pokémon en sus equipos." };
        }

        // Función para obtener datos de la PokéAPI
        const obtenerDatosPokemon = async (id) => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                return {
                    id: response.data.id,
                    nombre: response.data.name.toUpperCase(),
                    tipos: response.data.types.map(t => t.type.name),
                };
            } catch (error) {
                console.error(`Error al obtener datos de ${id}:`, error.message);
                return null;
            }
        };

        // Obtener datos de los Pokémon en paralelo
        const datosPokemons = (await Promise.all(pokemonList.map(p => obtenerDatosPokemon(p.id))))
            .filter(pokemon => pokemon !== null); // Filtrar posibles `null`

        if (datosPokemons.length === 0) {
            return { error: "No se pudieron obtener datos de los Pokémon." };
        }

        // Convertir en DataFrame
        const df = new DataFrame(datosPokemons);

        // Contar los Pokémon más repetidos
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

        // Obtener el top 3 (o menos si hay menos de 3 Pokémon en la lista)
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

    // Extraer todos los Pokémon de todos los equipos
    const pokemonList = Object.values(equipos).flat();

    // Función para obtener datos de la PokéAPI
    const obtenerDatosPokemon = async (id) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return {
                id: response.data.id,
                nombre: response.data.name.toUpperCase(),
                tipos: response.data.types.map(t => t.type.name), // Ahora es un array de strings
            };
        } catch (error) {
            console.error(`Error al obtener datos de ${id}:`, error.message);
            return null;
        }
    };

    // Obtener datos de los Pokémon uno por uno
    const datosPokemons = [];
    for (let i = 0; i < pokemonList.length; i++) {
        const datos = await obtenerDatosPokemon(pokemonList[i].id);
        if (datos) {
            datosPokemons.push(datos);
        }
    }

    const df = new DataFrame(datosPokemons);
    const tiposExpandidos = df
        .selectMany(row => row.tipos.map(tipo => ({ tipo }))) // Separa los tipos en filas individuales
        .groupBy(row => row.tipo)
        .select(group => ({
            tipo: group.first().tipo,
            cantidad: group.count()
        }))
        .toArray();

    // Se crea un objeto donde cada tipo empieza con 0.
    const conteoTipos = Object.fromEntries(tiposPosibles.map(tipo => [tipo, 0]));

    // Llenar el conteo con los datos reales
    for (const tipoData of tiposExpandidos) {
        conteoTipos[tipoData.tipo] = tipoData.cantidad;
    }

    // Convertir a array para mostrarlo en formato tabla
    const tiposFinal = Object.entries(conteoTipos).map(([tipo, cantidad]) => ({ tipo, cantidad }));
    return tiposFinal;

});
