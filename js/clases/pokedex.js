// Classes
import { Filters } from "./filters.js";
import { Loader } from "./loader.js";
import { LoadMore } from "./load-more.js";
import { Pokemon } from "./pokemon.js";
import { Search } from "./search.js";
// Modules
import { utilsModule } from "../modules/utils.js";
import { fetcherModule } from "../modules/fetcher.js";

class Pokedex {
  constructor({ limit }) {
    this.limit = limit;
    this.offset = 0;

    this.allPokemons = [];
    this.detailedPokemons = [];
    this.filteredPokemons = [];

    this.filters = new Filters({
      onChange: this.handleFilterChange.bind(this),
      onReset: this.handlerFilterReset.bind(this),
    });
    this.loader = new Loader();
    this.loadMore = new LoadMore({
      onClick: this.handleLoadMoreClick.bind(this),
    });
    this.search = new Search({
      onInput: this.handleSearchInput.bind(this),
    });

    this.init();
  }

  async init() {
    this.loader.show();

    await this.filters.init();

    this.allPokemons = await fetcherModule.fetPokedexByName("national");
    this.filteredPokemons = this.allPokemons;
    this.detailedPokemons = await this.fetchDetailedPokemons({
      pokemons: this.allPokemons,
      offset: this.offset,
      limit: this.limit,
    });

    await utilsModule.sleep(1000);

    this.loader.hide();

    this.renderPokemons(this.detailedPokemons);
  }

  async fetchDetailedPokemons({ pokemons, offset, limit }) {
    try {
      const promises = pokemons
        .slice(offset, offset + limit)
        .map((pokemon) => fetcherModule.fetchPokemonById(utilsModule.getIdFromUrl(pokemon.url)));
      const detailedPokemons = await Promise.all(promises);
      const cleanedPokemons = detailedPokemons.filter((pokemon) => Boolean(pokemon));
      return cleanedPokemons;
    } catch (error) {
      console.error(error);
    }
  }

  renderPokemons(pokemons) {
    const pokemonList = document.getElementById("pokemon-list");

    if (!pokemons.length) {
      const noResults = document.createElement("p");
      noResults.textContent = "No items found...";
      noResults.classList.add("pokemon-list__no-results");
      pokemonList.appendChild(noResults);
      return;
    }

    pokemons.forEach((pokemon) => {
      const pokemonInstance = new Pokemon({ pokemon });
      const pokemonElement = pokemonInstance.renderPokemon();
      pokemonList.appendChild(pokemonElement);
    });
  }

  async handleLoadMoreClick() {
    this.offset += this.limit;

    const detailedPokemons = await this.fetchDetailedPokemons({
      pokemons: this.filteredPokemons,
      offset: this.offset,
      limit: this.limit,
    });
    this.detailedPokemons = [...this.detailedPokemons, ...detailedPokemons];

    this.cleanPokemons();
    this.renderPokemons(this.detailedPokemons);
    this.updateLoadMoreButton(this.filteredPokemons);
  }

  async handleSearchInput(value) {
    const filteredPokemons = this.filteredPokemons.filter((pokemon) =>
      pokemon.name.includes(value.toLowerCase())
    );

    this.reset();
    this.detailedPokemons = await this.fetchDetailedPokemons({
      pokemons: filteredPokemons,
      offset: this.offset,
      limit: this.limit,
    });
    this.cleanPokemons();
    this.renderPokemons(this.detailedPokemons);
    this.updateLoadMoreButton(filteredPokemons);
  }

  async handleFilterChange(checkedFilters) {
    const { types, colors, genders } = checkedFilters;

    const fetchPromises = [
      ...types.map((type) => fetcherModule.fetchPokemonsByType(type)),
      ...colors.map((color) => fetcherModule.fetchPokemonsByColor(color)),
      ...genders.map((gender) => fetcherModule.fetchPokemonsByGender(gender)),
    ];

    const allFilteredPokemons = fetchPromises.length
      ? (await Promise.all(fetchPromises)).flat()
      : this.allPokemons;

    const uniqueFilteredPokemons = this.getUniquePokemons(allFilteredPokemons);
    const sortedFilteredPokemons = this.sortPokemonsById(uniqueFilteredPokemons);
    const searchFilteredPokemons = this.filterPokemonsByName(sortedFilteredPokemons);

    this.filteredPokemons = sortedFilteredPokemons;

    this.reset();
    this.detailedPokemons = await this.fetchDetailedPokemons({
      pokemons: searchFilteredPokemons,
      offset: this.offset,
      limit: this.limit,
    });
    this.cleanPokemons();
    this.renderPokemons(this.detailedPokemons);
    this.updateLoadMoreButton(searchFilteredPokemons);
  }

  async handlerFilterReset() {
    this.search.reset();
  }

  getUniquePokemons(pokemons) {
    return [...new Map(pokemons.map((pokemon) => [pokemon.name, pokemon])).values()];
  }

  sortPokemonsById(pokemons) {
    return pokemons.sort(
      (a, b) => utilsModule.getIdFromUrl(a.url) - utilsModule.getIdFromUrl(b.url)
    );
  }

  filterPokemonsByName(pokemons) {
    const name = this.search.getValue();
    if (!name) {
      return pokemons;
    }
    return pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(name.toLowerCase()));
  }

  updateLoadMoreButton(filteredPokemons) {
    if (filteredPokemons.length === this.detailedPokemons.length) {
      this.loadMore.hideButton();
    } else {
      this.loadMore.showButton();
    }
  }

  cleanPokemons() {
    const pokemonList = document.getElementById("pokemon-list");
    utilsModule.cleanHTML(pokemonList);
  }

  reset() {
    this.detailedPokemons = [];
    this.offset = 0;
  }
}

export { Pokedex };
