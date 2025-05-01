import React from 'react';
import PokemonCard from './PokemonCard';

const PokemonList = ({ pokemonList }) => {
  return (
    <div className="row">
      {pokemonList.map(pokemon => (
        <div className="col-md-4 col-lg-3" key={pokemon.id}>
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
};

export default PokemonList;