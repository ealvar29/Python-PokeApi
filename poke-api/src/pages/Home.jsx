import React, { useState, useEffect } from 'react';
import PokemonList from '../components/PokemonList';
import Loader from '../components/Loader';
import { getPokemonList } from '../services/pokemonService';

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPokemon = async (url = null) => {
    try {
      setLoading(true);
      const limit = 12; // Number of pokemon to show per page
      const offset = url ? new URL(url).searchParams.get('offset') : 0;
      
      const data = await getPokemonList(limit, offset);
      
      setPokemonList(data.results);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Pokémon. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleNext = () => {
    if (nextUrl) fetchPokemon(nextUrl);
  };

  const handlePrev = () => {
    if (prevUrl) fetchPokemon(prevUrl);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-center mb-4">Pokémon Explorer</h1>
      <p className="text-center mb-4">
        Discover Pokémon with AI-enhanced features! Click on a Pokémon to see detailed information
        with AI-generated content.
      </p>
      
      {loading ? (
        <Loader />
      ) : (
        <>
          <PokemonList pokemonList={pokemonList} />
          
          <div className="d-flex justify-content-center mt-4 mb-5">
            <button 
              className="btn btn-primary me-2" 
              onClick={handlePrev} 
              disabled={!prevUrl}
            >
              Previous
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleNext} 
              disabled={!nextUrl}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;