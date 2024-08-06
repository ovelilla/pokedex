// Modules
import { utilsModule } from "../modules/utils.js";
// Classes
import { Modal } from "./modal.js";
import { TypeTag } from "./type-tag.js";

class Pokemon {
  constructor({ pokemon }) {
    this.pokemon = pokemon;
    this.loadingModal = false;
  }

  renderPokemon() {
    const li = document.createElement("li");
    li.classList.add("pokemon", `color--muted--${this.pokemon.types[0].type.name}`);

    const button = document.createElement("button");
    button.classList.add("pokemon__button");
    button.addEventListener("click", this.handlePokemonClick.bind(this));
    li.appendChild(button);

    const info = document.createElement("div");
    info.classList.add("pokemon__button__info");
    button.appendChild(info);

    const number = document.createElement("span");
    number.textContent = `No. ${utilsModule.padNumber(this.pokemon.id, 3)}`;
    number.classList.add("pokemon__button__info__number");
    info.appendChild(number);

    const title = document.createElement("h2");
    title.textContent = utilsModule.capitalize(this.pokemon.name);
    title.classList.add("pokemon__button__info__title");
    info.appendChild(title);

    const types = document.createElement("ul");
    types.classList.add("pokemon__button__info__types");
    info.appendChild(types);

    this.pokemon.types.forEach((type) => {
      const typeTag = new TypeTag({ type: type.type });
      const typeItem = typeTag.renderTypeTag();
      types.appendChild(typeItem);
    });

    const sprite = document.createElement("div");
    sprite.classList.add(
      "pokemon__button__sprite",
      `color--solid--${this.pokemon.types[0].type.name}`
    );
    button.appendChild(sprite);

    const bgImg = document.createElement("img");
    bgImg.src = `./assets/types/${this.pokemon.types[0].type.name}.svg`;
    bgImg.alt = `${utilsModule.capitalize(this.pokemon.types[0].type.name)} type background`;
    bgImg.classList.add("pokemon__button__sprite__bg");
    sprite.appendChild(bgImg);

    const img = document.createElement("img");
    img.src = this.pokemon.sprites.other["official-artwork"].front_default;
    img.alt = this.pokemon.name;
    img.width = 128;
    img.height = 128;
    img.loading = "lazy";
    img.classList.add("pokemon__button__sprite__image");
    sprite.appendChild(img);

    return li;
  }

  renderEvolution() {
    const li = document.createElement("li");
    li.classList.add("evolution", `color--muted--${this.pokemon.types[0].type.name}`);

    const sprite = document.createElement("div");
    sprite.classList.add("evolution__sprite", `color--solid--${this.pokemon.types[0].type.name}`);
    li.appendChild(sprite);

    const bgImg = document.createElement("img");
    bgImg.src = `./assets/types/${this.pokemon.types[0].type.name}.svg`;
    bgImg.alt = `${utilsModule.capitalize(this.pokemon.types[0].type.name)} type background`;
    bgImg.classList.add("evolution__sprite__bg");
    sprite.appendChild(bgImg);

    const img = document.createElement("img");
    img.src = this.pokemon.sprites.other["official-artwork"].front_default;
    img.alt = this.pokemon.name;
    img.width = 128;
    img.height = 128;
    img.loading = "lazy";
    img.classList.add("evolution__sprite__image");
    sprite.appendChild(img);

    const info = document.createElement("div");
    info.classList.add("evolution__info");
    li.appendChild(info);

    const title = document.createElement("h2");
    title.textContent = utilsModule.capitalize(this.pokemon.name);
    title.classList.add("evolution__info__title");
    info.appendChild(title);

    const number = document.createElement("span");
    number.textContent = `No. ${utilsModule.padNumber(this.pokemon.id, 3)}`;
    number.classList.add("evolution__info__number");
    info.appendChild(number);

    const types = document.createElement("ul");
    types.classList.add("evolution__info__types");
    info.appendChild(types);

    this.pokemon.types.forEach((type) => {
      const typeTag = new TypeTag({ type: type.type });
      const typeItem = typeTag.renderTypeTag();
      types.appendChild(typeItem);
    });

    return li;
  }

  async handlePokemonClick() {
    if (!this.loadingModal) {
      const modal = new Modal({ pokemon: this.pokemon });
      this.loadingModal = true;
      await modal.init();
      this.loadingModal = false;
    }
  }
}

export { Pokemon };
