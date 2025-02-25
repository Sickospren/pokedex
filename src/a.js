import axios from "axios";
import { obtenerEquiposDeUsuario } from "./firebase.js";
import { DataFrame } from "data-forge";

// Obtener los equipos del usuario
const equipos = await obtenerEquiposDeUsuario("Jorge");

// Extraer todos los Pokémon de todos los equipos
const pokemonList = Object.values(equipos).flat();

// Función para obtener datos de la PokéAPI
const obtenerDatosPokemon = async (id) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return {
            id: response.data.id,
            nombre: response.data.name.toUpperCase(),
            altura: response.data.height,
            peso: response.data.weight,
            tipos: response.data.types.map(t => t.type.name).join(", "),
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

// Convertir en DataFrame
const df = new DataFrame(datosPokemons);
console.log(df.toString()); // Muestra la tabla en consola
