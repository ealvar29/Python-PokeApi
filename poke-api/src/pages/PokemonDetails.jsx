import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPokemonDetails } from '../services/pokemonService';
import Loader from '../components/Loader';

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const data = await getPokemonDetails(id);
        setPokemon(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon details. Please try again.');
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!pokemon) return <div className="alert alert-info">No Pokémon found.</div>;

  // Extract English description
  const englishDescription = pokemon.species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  )?.flavor_text.replace(/\\f|\\n/g, ' ') || 'No description available.';

  return (
    <div className="pokemon-details">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body text-center">
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                className="img-fluid mb-3"
                style={{ maxHeight: '300px' }}
              />
              <h1 className="text-capitalize">{pokemon.name}</h1>
              <div className="d-flex justify-content-center mb-3">
                {pokemon.types.map(type => (
                  <span 
                    key={type} 
                    className={`badge bg-${type} me-2 text-capitalize`}
                    style={{ fontSize: '1rem', padding: '0.5rem' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Base Stats</h3>
            </div>
            <div className="card-body">
              {pokemon.stats.map(stat => (
                <div key={stat.name} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-capitalize">{stat.name.replace('-', ' ')}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${Math.min(100, (stat.value / 150) * 100)}%` }}
                      aria-valuenow={stat.value} 
                      aria-valuemin="0" 
                      aria-valuemax="150"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>About</h3>
        </div>
        <div className="card-body">
          <p>{englishDescription}</p>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Height:</strong> {pokemon.height / 10}m</p>
              <p><strong>Weight:</strong> {pokemon.weight / 10}kg</p>
            </div>
            <div className="col-md-6">
              <p><strong>Abilities:</strong></p>
              <ul>
                {pokemon.abilities.map(ability => (
                  <li key={ability} className="text-capitalize">{ability.replace('-', ' ')}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder sections for AI features - we'll implement these next */}
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>AI Generated Description</h3>
            </div>
            <div className="card-body">
              <p>Coming soon: AI-generated description using text generation API...</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>AI Generated Image</h3>
            </div>
            <div className="card-body text-center">
              <p>Coming soon: AI-generated image using image generation API...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>AI Generated Sound</h3>
            </div>
            <div className="card-body text-center">
              <p>Coming soon: AI-generated audio using audio generation API...</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>AI Generated Animation</h3>
            </div>
            <div className="card-body text-center">
              <p>Coming soon: AI-generated video using video generation API...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;