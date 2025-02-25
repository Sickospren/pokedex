let allPokemon = []; // Guardamos la lista completa para filtrar después

// Inicializamos el JSON del equipo
let equipoJSON = [];

// Obtenemos los div del sidebar
const sidebarDivs = document.querySelectorAll(".sidebar div");

// Cargar la lista de Pokémon
async function loadPokemonList() {
  allPokemon = await window.electronAPI.fetchPokemonList(); // Guardamos la lista original
  renderPokemonList(allPokemon); // Mostramos todos al inicio
}

// Renderizar la lista de Pokémon
function renderPokemonList(pokemonList) {
  const listContainer = document.getElementById("pokemon-list");
  listContainer.innerHTML = ""; // Limpiar lista

  for (let pokemon of pokemonList) {
    const pokeId = pokemon.url.split("/").slice(-2, -1)[0]; // Extrae el ID
    const listItem = document.createElement("div");
    listItem.classList.add("pokemon-item");

    // Crear imagen
    let srcImagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;
    const image = document.createElement("img");
    image.src = srcImagen;
    image.alt = pokemon.name;

    // Nombre del Pokémon
    let nombrePokemon = pokemon.name.toUpperCase();
    const nameTag = document.createElement("p");
    nameTag.textContent = nombrePokemon;

    // Boton para añadir al equipo
    const añadirBtn = document.createElement("button");
    añadirBtn.innerHTML = 'Añadir al equipo';

    añadirBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      añadirPokemonEquipo(pokeId, nombrePokemon, srcImagen);
    });

    // Agregar evento para abrir detalles
    listItem.addEventListener("click", () => {

      console.log("Abriendo detalles de:", pokemon.name);
      window.electronAPI.openDetailsWindow(pokemon.name);
    });

    listItem.appendChild(image);
    listItem.appendChild(nameTag);
    listItem.appendChild(añadirBtn);
    listContainer.appendChild(listItem);
  }
}

// Filtro
document.getElementById("search").addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredPokemon = allPokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );
  renderPokemonList(filteredPokemon);
});

//boton para cerrar la pokedex
document.getElementById("close-pokedex").addEventListener("click", () => {
  window.electronAPI.closePokedexWindow();
});

// Cargar Pokémon al inicio
document.addEventListener("DOMContentLoaded", loadPokemonList);

function añadirPokemonEquipo(pokeId, nombre, imagen) {
  // Comprobar que no tenga más de 6 Pokemons
  if (equipoJSON.length >= 6) {
    console.log("⚠️ No puedes añadir más de 6 Pokémon al equipo.");
    return;
  }
  // comprobar que ese pokemon no esté en el json
  const existe = equipoJSON.some(pokemon => pokemon.id === pokeId);
  if (existe) {
    console.log(`⚠️ El Pokémon ${nombre} ya está en el equipo.`);
    return;
  }

  let nuevoPokemon = {
    id: pokeId,
    nombre: nombre,
    imagen: imagen
  };
  equipoJSON.push(nuevoPokemon);
  console.log("📜 Equipo actual:", JSON.stringify(equipoJSON, null, 2));

  // Actualizar el sidebar
  equipoJSON.forEach((pokemon, index) => {
    if (index < 6) {
      sidebarDivs[index].innerHTML = `
            <p>${pokemon.nombre}</p>
            <img src="${pokemon.imagen}" alt="${pokemon.nombre}" width="50" height="50">
        `;
    }
  });
}

document.getElementById("btnGuardarEquipo").addEventListener("click", () => {
  // Comprobar que equipoJSON tenga 6 elementos
  if (equipoJSON.length !== 6) {
    console.log(`⚠️ El equipo debe de tener 6 pokemons. Numero de pokemons actual: ${equipoJSON.length}`);
    return;
  }

  // Crear un nuevo JSON a partir de equipoJSON, eliminando la propiedad 'imagen'
  let equipoUserJSON = equipoJSON.map(equipo => {
    // Crear una copia del objeto equipo sin la propiedad 'imagen'
    let { imagen, ...equipoSinImagen } = equipo;
    return equipoSinImagen;
  });

  // Obtener el usuario de la sesión
  const user = localStorage.getItem('username');
  console.log("Equipo del usuario " + user + ":");
  console.table(equipoUserJSON);


});
