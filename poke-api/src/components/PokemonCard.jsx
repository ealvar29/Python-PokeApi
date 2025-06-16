import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const PokemonCard = ({ pokemon }) => {
  console.log(pokemon, "pokemon log");
  return (
    // <div className="card mb-4 shadow-sm">
    //   <img
    //     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
    //     className="card-img-top p-3"
    //     alt={pokemon.name}
    //   />
    //   <div className="card-body">
    //     <h5 className="card-title text-capitalize">{pokemon.name}</h5>
    //     <p className="card-text">#{pokemon.id}</p>
    //     <Link to={`/pokemon/${pokemon.id}`} className="btn btn-primary">
    //       View Details
    //     </Link>
    //   </div>
    // </div>

    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 34 }}>
          {pokemon.name.toUpperCase()}
        </Typography>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
          className="card-img-top p-3"
          alt={pokemon.name}
        />
        <Typography
          sx={{ color: "text.secondary", fontSize: 34 }}
          variant="body2"
        >
          Pokemon ID #{pokemon.id}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="large" variant="contained">
          <Link
            to={`/pokemon/${pokemon.id}`}
            className="btn btn-primary view-details"
          >
            View Details
          </Link>
        </Button>
      </CardActions>
    </Card>
  );
};

export default PokemonCard;
