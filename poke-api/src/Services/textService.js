// src/Services/textService.js
import { Configuration, OpenAIApi } from "openai";

// Get your API key from the .env file
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Configure OpenAI with your API key
const configuration = new Configuration({
  apiKey: apiKey,
});

// Create an OpenAI client
const openai = new OpenAIApi(configuration);

// Function to generate a creative Pokédex description
export const generatePokemonDescription = async (pokemonName) => {
  const prompt = `Write a fun and creative Pokédex entry for the Pokémon named ${pokemonName}.`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  return response.data.choices[0].message.content.trim();
};
