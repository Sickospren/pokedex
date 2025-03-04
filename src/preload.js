const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchPokemonList: () => ipcRenderer.invoke("fetch-pokemon-list"),
  fetchPokemonDetails: (pokemon) => ipcRenderer.invoke("fetch-pokemon-details", pokemon),
  comprobarLogin: (user, pass) => ipcRenderer.invoke("comprobar-login", user, pass),
  registrarUsuario: (user, pass) => ipcRenderer.invoke("registrar-usuario", user, pass),
  obtenerEquipos: (user) => ipcRenderer.invoke("obtener-equipos", user),
  annadirEquipo: (pokemonArray, user) => ipcRenderer.invoke("annadir-equipo", pokemonArray, user),
  eliminarEquipo: (docId) => ipcRenderer.invoke("eliminar-equipo", docId),
  openDetailsWindow: (pokemon) => ipcRenderer.send("open-details-window", pokemon),
  closeDetailsWindow: () => ipcRenderer.send("close-details-window"),
  onPokemonData: (callback) => ipcRenderer.on("pokemon-data", (_, data) => callback(data)),

  openInicio: () => ipcRenderer.send("open-inicio"),
  openPokedex: () => ipcRenderer.send("open-pokedex"),
  openTeams: () => ipcRenderer.send("open-teams"),
  openStats: () => ipcRenderer.send("open-stats"),
  closeTeamsWindow: () => ipcRenderer.send("close-teams-window"),
  closePokedexWindow: () => ipcRenderer.send("close-pokedex-window"),

  //metodos para las estadisticas
  obtenerTop3Pokemons: (username) => ipcRenderer.invoke("obtener-top3-jugador", username),
  obtenerTiposUsuario: (username) => ipcRenderer.invoke("obtener-tipos-jugador", username),
  obtenerTipos151: () => ipcRenderer.invoke("obtener-tipos-151"),
});
