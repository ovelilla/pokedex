// Modules
import { utilsModule } from "../modules/utils.js";

class TypeTag {
  constructor({ type }) {
    this.type = type;
  }

  renderTypeTag() {
    const li = document.createElement("li");
    li.classList.add("type-tag", "color", `color--solid--${this.type.name}`);

    const icon = document.createElement("span");
    icon.classList.add("type-tag__icon");
    li.appendChild(icon);

    const image = document.createElement("img");
    image.src = `./assets/types/${this.type.name}-color.svg`;
    image.alt = `${utilsModule.capitalize(this.type.name)} type`;
    image.classList.add("type-tag__icon__image");
    icon.appendChild(image);

    const text = document.createElement("span");
    text.textContent = utilsModule.capitalize(this.type.name);
    text.classList.add("type-tag__text");
    li.appendChild(text);

    return li;
  }
}

export { TypeTag };
