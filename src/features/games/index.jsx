import React, { useEffect, useState } from "react";
import axios from "axios";
import "../games/styles.scss";

export default function Games() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); 

  const fetchPokemon = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`
      );
      const results = await Promise.all(
        response.data.results.map(async (poke) => {
          const details = await axios.get(poke.url);
          return {
            name: poke.name,
            image: details.data.sprites.front_default,
          };
        })
      );
      setPokemon((prev) => [...prev, ...results]); 
      setFilteredPokemon((prev) => [...prev, ...results]); 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(page);
  }, [page]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = pokemon.filter((poke) =>
      poke.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPokemon(filtered);
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); 
  };

  return (
    <div className="app">
      <h1>Pokémon Cards</h1>
      <div className="game-search">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="pokemon-list">
        {filteredPokemon.map((poke, index) => (
          <div key={index} className="pokemon-card">
            <div className="pokemon-img">
              <img src={poke.image} alt={poke.name} />
            </div>
            <p>Name: {poke.name}</p>
          </div>
        ))}
      </div>
      <div className="load-more">
        {!loading && (
          <button onClick={handleLoadMore}>Load More</button>
        )}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
