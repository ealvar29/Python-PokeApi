import React from 'react';
import { Link } from 'react-router-dom';

const PokemonCard = ({ pokemon }) => {
  return (
    <div className="card mb-4 shadow-sm">
      <img 
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} 
        className="card-img-top p-3" 
        alt={pokemon.name}
      />
      <div className="card-body">
        <h5 className="card-title text-capitalize">{pokemon.name}</h5>
        <p className="card-text">#{pokemon.id}</p>
        <Link to={`/pokemon/${pokemon.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PokemonCard;