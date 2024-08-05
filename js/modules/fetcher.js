const fetcherModule = (function () {
  const baseUrl = "https://pokeapi.co/api/v2/pokemon";

  const fetchEvolutionChainByUrl = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetPokedexByName = async (name) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${name}`);
      const data = await response.json();
      return data.pokemon_entries.map((pokemon) => pokemon.pokemon_species);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPokemonById = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPokemonByName = async (name) => {
    try {
      const response = await fetch(`${baseUrl}/${name}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPokemonsByType = async (type) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await response.json();
      return data.pokemon.map((pokemon) => pokemon.pokemon);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPokemonsByColor = async (color) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-color/${color}`);
      const data = await response.json();
      return data.pokemon_species;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPokemonsByGender = async (gender) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/gender/${gender}`);
      const data = await response.json();
      return data.pokemon_species_details.map((pokemon) => pokemon.pokemon_species);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPokemonSpeciesByUrl = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTypeByUrl = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/type");
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon-color");
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGenders = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/gender");
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    fetchColors,
    fetchEvolutionChainByUrl,
    fetchGenders,
    fetchPokemonById,
    fetchPokemonByName,
    fetchPokemonsByColor,
    fetchPokemonsByGender,
    fetchPokemonsByType,
    fetchPokemonSpeciesByUrl,
    fetchTypeByUrl,
    fetchTypes,
    fetPokedexByName,
  };
})();

export { fetcherModule };
