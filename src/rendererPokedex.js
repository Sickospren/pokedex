let allPokemon = []; // Guardamos la lista completa para filtrar después

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
  console.log("Id: "+ pokeId +" Nombre del pokemon: " + nombre + " Imagen: " + imagen);
}
