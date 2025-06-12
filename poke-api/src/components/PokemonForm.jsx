import React, { useState, useEffect } from "react";
import { getPokemonDetails } from "../services/pokemonService";
import { TextField, CircularProgress, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // 👈 Import the magic hook!

function PokemonForm() {
  const [pokemon, setPokemon] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      searchYourAPI(debouncedSearchTerm);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);
  const searchYourAPI = async (query) => {
    setIsLoading(true);

    try {
      const data = await getPokemonDetails(query);
      console.log(data);
      setResults(data || []);
      navigate(`/pokemon/${data.id}`);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TextField
        label="Search products..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isLoading ? <CircularProgress size={20} /> : <Search />}
            </InputAdornment>
          ),
        }}
      />

      {results.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {results.map((item, index) => (
            <div
              key={index}
              style={{ padding: "8px", border: "1px solid #eee" }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PokemonForm;
