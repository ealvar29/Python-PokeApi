// src/services/pokemonService.js
import axios from "axios";

const API_URL = "https://pokeapi.co/api/v2";
// Fetch a list of pokemon with pagination
export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${API_URL}/pokemon/${inputPokemon}`, {
      params: { limit, offset },
    });

    // Extract the basic info and get the IDs from the URLs
    const results = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 2]);
      return {
        id,
        name: pokemon.name,
        url: pokemon.url,
      };
    });

    return {
      results,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
    };
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
};

// Fetch detailed information about a specific pokemon
export const getPokemonDetails = async (idOrName) => {
  try {
    const response = await axios.get(`${API_URL}/pokemon/${idOrName}`);

    // Get the species details which include descriptions
    const speciesResponse = await axios.get(response.data.species.url);

    return {
      id: response.data.id,
      name: response.data.name,
      height: response.data.height,
      weight: response.data.weight,
      types: response.data.types.map((type) => type.type.name),
      abilities: response.data.abilities.map((ability) => ability.ability.name),
      stats: response.data.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      sprites: response.data.sprites,
      species: speciesResponse.data,
    };
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    throw error;
  }
};
