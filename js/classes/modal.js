// Clases
import { Pokemon } from "./pokemon.js";
import { TypeTag } from "./type-tag.js";
// Modules
import { fetcherModule } from "../modules/fetcher.js";
import { utilsModule } from "../modules/utils.js";

class Modal {
  constructor({ onLoad, pokemon }) {
    this.onLoad = onLoad;
    this.pokemon = pokemon;

    this.pokemonSpecies = null;
    this.types = [];
    this.evolutionsChain = [];
    this.evolutionsData = [];
    this.evolutionPokemon = [];

    this.scrollPosition = 0;

    this.modal = document.getElementById("modal");
    this.modalHeader = document.getElementById("modal-header");
    this.modalBody = document.getElementById("modal-body");
    this.closeModalButton = document.getElementById("close-modal-button");

    this.handleCloseModalClick = this.handleCloseModalClick.bind(this);
    this.handleCloseModalOverlayClick = this.handleCloseModalOverlayClick.bind(this);
    this.modal.addEventListener("click", this.handleCloseModalOverlayClick);
    this.closeModalButton.addEventListener("click", this.handleCloseModalClick);
  }

  async init() {
    this.pokemonSpecies = await fetcherModule.fetchPokemonSpeciesByUrl(this.pokemon.species.url);
    this.types = await Promise.all(
      this.pokemon.types.map((type) => fetcherModule.fetchTypeByUrl(type.type.url))
    );
    this.evolutionsChain = await fetcherModule.fetchEvolutionChainByUrl(
      this.pokemonSpecies.evolution_chain.url
    );
    await this.getEvolutionPokemon();
    this.openModal();
  }

  async getEvolutionPokemon() {
    const getEvolutions = (chain) => {
      this.evolutionsData.push({
        level: chain.evolution_details[0]?.min_level ?? null,
        name: chain.species.name,
        url: chain.species.url,
      });
      chain.evolves_to.forEach((evolution) => getEvolutions(evolution));
    };

    getEvolutions(this.evolutionsChain.chain);

    this.evolutionPokemon = await Promise.all(
      this.evolutionsData.map((evolution) => fetcherModule.fetchPokemonByName(evolution.name))
    );
  }

  openModal() {
    this.modal.classList.add("modal--visible");

    this.renderModal();
    this.disableScroll();

    lucide.createIcons();
  }

  async closeModal() {
    this.modal.classList.remove("modal--visible");

    await utilsModule.transitionEnd(this.modal);

    this.modal.removeEventListener("click", this.handleCloseModalOverlayClick);
    this.closeModalButton.removeEventListener("click", this.handleCloseModalClick);

    this.enableScroll();
    this.clean();
  }

  renderModal() {
    const bgImg = document.createElement("div");
    bgImg.classList.add(
      "modal__container__header__bg",
      `color--gradient--${this.pokemon.types[0].type.name}`
    );
    this.modalHeader.appendChild(bgImg);

    const sprite = document.createElement("img");
    sprite.src = this.pokemon.sprites.other["official-artwork"].front_default;
    sprite.alt = this.pokemon.name;
    sprite.classList.add("modal__container__header__sprite");
    this.modalHeader.appendChild(sprite);

    const container = document.createElement("div");
    container.classList.add("modal__container__body__container");
    this.modalBody.appendChild(container);

    const title = document.createElement("h2");
    title.textContent = utilsModule.capitalize(this.pokemon.name);
    title.classList.add("modal__container__body__container__title");
    container.appendChild(title);

    const number = document.createElement("span");
    number.textContent = `No. ${utilsModule.padNumber(this.pokemon.id, 3)}`;
    number.classList.add("modal__container__body__container__number");
    container.appendChild(number);

    const types = document.createElement("ul");
    types.classList.add("modal__container__body__types");
    this.modalBody.appendChild(types);

    this.pokemon.types.forEach((type) => {
      const typeTag = new TypeTag({ type: type.type });
      const typeItem = typeTag.renderTypeTag();
      types.appendChild(typeItem);
    });

    const description = document.createElement("p");
    description.textContent = utilsModule.replaceNewLines(
      this.pokemonSpecies.flavor_text_entries[0].flavor_text
    );
    description.classList.add("modal__container__body__description");
    this.modalBody.appendChild(description);

    const grid = document.createElement("div");
    grid.classList.add("modal__container__body__grid");
    this.modalBody.appendChild(grid);

    const gridItems = [
      { name: "weight", text: "Weight", icon: "weight", unit: "kg" },
      { name: "height", text: "Height", icon: "ruler", unit: "m" },
    ];

    gridItems.forEach((item) => {
      const gridItem = document.createElement("div");
      gridItem.classList.add("modal__container__body__grid__item");
      grid.appendChild(gridItem);

      const gridItemTitle = document.createElement("h3");
      gridItemTitle.classList.add("modal__container__body__grid__item__title");
      gridItem.appendChild(gridItemTitle);

      const gridItemTitleIcon = document.createElement("i");
      gridItemTitleIcon.classList.add("modal__container__body__grid__item__title__icon");
      gridItemTitleIcon.setAttribute("data-lucide", item.icon);
      gridItemTitle.appendChild(gridItemTitleIcon);

      const gridItemTitleText = document.createElement("span");
      gridItemTitleText.textContent = item.text;
      gridItemTitle.appendChild(gridItemTitleText);

      const gridItemValue = document.createElement("p");
      gridItemValue.textContent = `${this.pokemon[item.name] / 10} ${item.unit}`;
      gridItemValue.classList.add("modal__container__body__grid__item__value");
      gridItem.appendChild(gridItemValue);
    });

    const damages = [
      { titleText: "Strengths", relationType: "double_damage_to" },
      { titleText: "Weaknesses", relationType: "double_damage_from" },
    ];

    damages.forEach((damage) => {
      const container = document.createElement("div");
      container.classList.add("modal__container__body__damage");
      this.modalBody.appendChild(container);

      const title = document.createElement("h3");
      title.textContent = damage.titleText;
      title.classList.add("modal__container__body__damage__title");
      container.appendChild(title);

      const grid = document.createElement("div");
      grid.classList.add("modal__container__body__damage__grid");
      container.appendChild(grid);

      this.types.forEach((type) => {
        type.damage_relations[damage.relationType].forEach((relation) => {
          const typeTag = new TypeTag({ type: { name: relation.name } });
          const typeItem = typeTag.renderTypeTag();
          grid.appendChild(typeItem);
        });
      });
    });

    const evolutions = document.createElement("div");
    evolutions.classList.add("modal__container__body__evolutions");
    this.modalBody.appendChild(evolutions);

    const evolutionsTitle = document.createElement("h3");
    evolutionsTitle.textContent = "Evolutions";
    evolutionsTitle.classList.add("modal__container__body__evolutions__title");
    evolutions.appendChild(evolutionsTitle);

    const evolutionsRow = document.createElement("div");
    evolutionsRow.classList.add("modal__container__body__evolutions__row");
    evolutions.appendChild(evolutionsRow);

    this.evolutionPokemon.forEach((pokemon, index) => {
      const evolution = new Pokemon({ pokemon });
      const evolutionItem = evolution.renderEvolution();
      evolutionsRow.appendChild(evolutionItem);

      if (this.evolutionsData[index + 1]) {
        const separator = document.createElement("div");
        separator.classList.add("modal__container__body__evolutions__separator");
        evolutionsRow.appendChild(separator);

        const arrow = document.createElement("i");
        arrow.classList.add("modal__container__body__evolutions__separator__arrow");
        arrow.setAttribute("data-lucide", "arrow-down");
        separator.appendChild(arrow);

        const levelContainer = document.createElement("div");
        levelContainer.classList.add("modal__container__body__evolutions__separator__level");
        levelContainer.textContent = `Level ${this.evolutionsData[index + 1].level}`;
        separator.appendChild(levelContainer);
      }
    });
  }

  handleCloseModalClick() {
    this.closeModal();
  }

  handleCloseModalOverlayClick(event) {
    if (event.target === this.modal) {
      this.closeModal();
    }
  }

  disableScroll() {
    this.scrollPosition = window.scrollY;
    document.body.classList.add("no-scroll");
    document.body.style.top = `-${this.scrollPosition}px`;
  }

  enableScroll() {
    document.body.style.top = "";
    document.body.classList.remove("no-scroll");
    window.scrollTo(0, this.scrollPosition);
  }

  clean() {
    utilsModule.cleanHTML(this.modalHeader);
    utilsModule.cleanHTML(this.modalBody);
  }
}

export { Modal };
