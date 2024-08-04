import { utilsModule } from "../modules/utils.js";

class Filters {
  constructor({ onChange, onReset }) {
    this.onChange = onChange;
    this.onReset = onReset;

    this.filters = document.getElementById("filters");
    this.openFiltersButton = document.getElementById("open-filters-button");
    this.closeFiltersButton = document.getElementById("close-filters-button");
    this.resetFiltersButton = document.getElementById("reset-filters-button");

    this.filters.addEventListener("click", this.handleFiltersClick.bind(this));
    this.openFiltersButton.addEventListener("click", this.handleOpenFiltersClick.bind(this));
    this.closeFiltersButton.addEventListener("click", this.handleCloseFiltersClick.bind(this));
    this.resetFiltersButton.addEventListener("click", this.handleResetFiltersClick.bind(this));

    this.scrollPosition = 0;

    this.types = [];
    this.colors = [];
    this.gender = [];
  }

  async init() {
    await Promise.all([this.fetchTypes(), this.fetchColors(), this.fetchGenders()]);

    this.renderTypes();
    this.renderColors();
    this.renderGenders();
  }

  handleFiltersClick(event) {
    if (event.target === this.filters) {
      this.filters.classList.remove("filters--visible");
      this.enableScroll();
    }
  }

  handleOpenFiltersClick() {
    this.filters.classList.add("filters--visible");
    this.disableScroll();
  }

  handleCloseFiltersClick() {
    this.filters.classList.remove("filters--visible");
    this.enableScroll();
  }

  handleResetFiltersClick() {
    const inputs = Array.from(document.querySelectorAll("input"));
    inputs.forEach((input) => {
      input.checked = false;
    });

    this.handleInputChanges();
    this.onReset();
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

  async fetchTypes() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/type");
      const data = await response.json();
      this.types = data.results;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchColors() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon-color");
      const data = await response.json();
      this.colors = data.results;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchGenders() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/gender");
      const data = await response.json();
      this.genders = data.results;
    } catch (error) {
      console.error(error);
    }
  }

  renderTypes() {
    const filtersTypeList = document.getElementById("filters-type-list");

    const sortedTypes = this.types.sort((a, b) => a.name.localeCompare(b.name));

    const excludedTypes = ["stellar", "unknown"];
    const filteredTypes = sortedTypes.filter((type) => !excludedTypes.includes(type.name));

    filteredTypes.forEach((type) => {
      const li = document.createElement("li");
      li.classList.add("filters__container__section__list__item");
      filtersTypeList.appendChild(li);

      const input = document.createElement("input");
      input.id = type.name;
      input.name = "type";
      input.type = "checkbox";
      input.value = type.name;
      input.classList.add("filters__container__section__list__item__input");
      input.addEventListener("change", this.handleInputChanges.bind(this));
      li.appendChild(input);

      const label = document.createElement("label");
      label.htmlFor = type.name;
      label.classList.add(
        "filters__container__section__list__item__label",
        "filters__container__section__list__item__label--type",
        "type",
        `type--${type.name}`
      );
      li.appendChild(label);

      const icon = document.createElement("span");
      icon.classList.add("filters__container__section__list__item__label__icon", "type__icon");
      label.appendChild(icon);

      const image = document.createElement("img");
      image.src = `./assets/types/${type.name}-color.svg`;
      image.alt = type.name;
      image.classList.add(
        "filters__container__section__list__item__label__icon__image",
        `type__icon--${type.name}`
      );
      icon.appendChild(image);

      const text = document.createElement("span");
      text.textContent = utilsModule.capitalize(type.name);
      text.classList.add("filters__container__section__list__item__label__text", "type__text");
      label.appendChild(text);
    });
  }

  renderColors() {
    const filtersColorList = document.getElementById("filters-color-list");

    this.colors.forEach((color) => {
      const li = document.createElement("li");
      li.classList.add("filters__container__section__list__item");
      filtersColorList.appendChild(li);

      const input = document.createElement("input");
      input.id = color.name;
      input.name = "color";
      input.type = "checkbox";
      input.value = color.name;
      input.classList.add("filters__container__section__list__item__input");
      input.addEventListener("change", this.handleInputChanges.bind(this));
      li.appendChild(input);

      const label = document.createElement("label");
      label.htmlFor = color.name;
      label.classList.add(
        "filters__container__section__list__item__label",
        "filters__container__section__list__item__label--color",
        `filters__container__section__list__item__label--color--${color.name}`
      );
      li.appendChild(label);
    });
  }

  renderGenders() {
    const filtersGenderList = document.getElementById("filters-gender-list");

    this.genders.forEach((gender) => {
      const li = document.createElement("li");
      li.classList.add("filters__container__section__list__item");
      filtersGenderList.appendChild(li);

      const input = document.createElement("input");
      input.id = gender.name;
      input.name = "gender";
      input.type = "checkbox";
      input.value = gender.name;
      input.classList.add("filters__container__section__list__item__input");
      input.addEventListener("change", this.handleInputChanges.bind(this));
      li.appendChild(input);

      const label = document.createElement("label");
      label.htmlFor = gender.name;
      label.classList.add(
        "filters__container__section__list__item__label",
        "filters__container__section__list__item__label--gender"
      );
      li.appendChild(label);

      const icon = document.createElement("img");
      icon.src = `./assets/gender/${gender.name}.svg`;
      icon.alt = gender.name;
      icon.classList.add(
        "filters__container__section__list__item__label__icon",
        `filters__container__section__list__item__label--gender__icon`
      );
      label.appendChild(icon);
    });
  }

  handleInputChanges() {
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(
      (input) => input.value
    );
    const checkedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(
      (input) => input.value
    );
    const checkedGenders = Array.from(
      document.querySelectorAll('input[name="gender"]:checked')
    ).map((input) => input.value);

    const checkedFilters = {
      types: checkedTypes,
      colors: checkedColors,
      genders: checkedGenders,
    };

    this.onChange(checkedFilters);
  }
}

export { Filters };
