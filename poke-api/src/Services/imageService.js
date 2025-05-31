// src/Services/imageService.js
import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const generatePokemonImage = async (pokemonName) => {
  const prompt = `A highly detailed artistic illustration of the Pokémon ${pokemonName}, full body, on a white background`;

  const response = await axios.post(
    'https://api.openai.com/v1/images/generations',
    {
      prompt,
      n: 1,
      size: '512x512',
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data[0].url;
};
