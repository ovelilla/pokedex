// Classes
import { Pokedex } from "./clases/pokedex.js";

document.addEventListener("DOMContentLoaded", entryPoint);

async function entryPoint() {
  new Pokedex({
    limit: 20,
  });
}


