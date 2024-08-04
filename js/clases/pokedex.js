// Clases
import { Filters } from "./filters.js";
import { Loader } from "./loader.js";
import { LoadMore } from "./load-more.js";
import { Search } from "./search.js";
// Modules
import { utilsModule } from "../modules/utils.js";

class Pokedex {
  constructor({ limit }) {
    this.limit = limit;
    this.offset = 0;

    this.allPokemons = [];
    this.detailedPokemons = [];
    this.filteredPokemons = [];

    this.filters = new Filters({
      onChange: this.handleFilterChange.bind(this),
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
    this.allPokemons = await this.fetchPokemons();
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

  async fetchPokemons() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokedex/national`);
      const data = await response.json();
      return data.pokemon_entries.map((pokemon) => pokemon.pokemon_species);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchPokemonsByType(type) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await response.json();
      return data.pokemon.map((pokemon) => pokemon.pokemon);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchPokemonsByColor(color) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-color/${color}`);
      const data = await response.json();
      return data.pokemon_species;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchPokemonsByGender(gender) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/gender/${gender}`);
      const data = await response.json();
      return data.pokemon_species_details.map((pokemon) => pokemon.pokemon_species);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchDetailedPokemons({ pokemons, offset, limit }) {
    try {
      const promises = pokemons.slice(offset, offset + limit).map(async (pokemon) => {
        const id = this.getIdFromUrl(pokemon.url);
        const detail = await this.fetchDetailedPokemon(id);
        return detail;
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchDetailedPokemon(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  renderPokemons(pokemons) {
    const pokemonList = document.getElementById("pokemon-list");

    pokemons.forEach((pokemon) => {
      const li = document.createElement("li");
      li.classList.add("pokemon-list__pokemon", `type--${pokemon.types[0].type.name}-muted`);
      pokemonList.appendChild(li);

      const info = document.createElement("div");
      info.classList.add("pokemon-list__pokemon__info");
      li.appendChild(info);

      const number = document.createElement("span");
      number.textContent = `No. ${utilsModule.padNumber(pokemon.id, 3)}`;
      number.classList.add("pokemon-list__pokemon__info__number");
      info.appendChild(number);

      const title = document.createElement("h2");
      title.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      title.classList.add("pokemon-list__pokemon__info__title");
      info.appendChild(title);

      const types = document.createElement("ul");
      types.classList.add("pokemon-list__pokemon__info__types");
      info.appendChild(types);

      pokemon.types.forEach((type) => {
        const typeItem = document.createElement("li");
        typeItem.classList.add(
          "pokemon-list__pokemon__info__types__type",
          "type",
          `type--${type.type.name}`
        );
        types.appendChild(typeItem);

        const icon = document.createElement("span");
        icon.classList.add("pokemon-list__pokemon__info__types__type__icon", "type__icon");
        typeItem.appendChild(icon);

        const image = document.createElement("img");
        image.src = `./assets/types/${type.type.name}-color.svg`;
        image.alt = `${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)} type`;
        image.classList.add(
          "pokemon-list__pokemon__info__types__type__icon__image",
          `type__icon--${type.type.name}`
        );
        icon.appendChild(image);

        const text = document.createElement("span");
        text.textContent = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
        text.classList.add("pokemon-list__pokemon__info__types__type__text");
        typeItem.appendChild(text);
      });

      const sprite = document.createElement("div");
      sprite.classList.add("pokemon-list__pokemon__sprite", `type--${pokemon.types[0].type.name}`);
      li.appendChild(sprite);

      const img = document.createElement("img");
      img.src = pokemon.sprites.other["official-artwork"].front_default;
      img.alt = pokemon.name;
      img.width = 128;
      img.height = 128;
      img.loading = "lazy";
      sprite.appendChild(img);
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
    const allPokemons = (
      await Promise.all([
        ...checkedFilters.types.map((type) => this.fetchPokemonsByType(type)),
        ...checkedFilters.colors.map((color) => this.fetchPokemonsByColor(color)),
        ...checkedFilters.genders.map((gender) => this.fetchPokemonsByGender(gender)),
      ])
    ).flat();

    const sortedPokemons = allPokemons.sort(
      (a, b) => this.getIdFromUrl(a.url) - this.getIdFromUrl(b.url)
    );

    this.filteredPokemons = sortedPokemons.length ? sortedPokemons : this.allPokemons;

    this.reset();
    this.detailedPokemons = await this.fetchDetailedPokemons({
      pokemons: this.filteredPokemons,
      offset: this.offset,
      limit: this.limit,
    });
    this.cleanPokemons();
    this.renderPokemons(this.detailedPokemons);
    this.updateLoadMoreButton(this.filteredPokemons);
  }

  getIdFromUrl(url) {
    return parseInt(url.split("/").filter(Boolean).pop(), 10);
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
