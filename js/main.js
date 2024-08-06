// Classes
import { Pokedex } from "./classes/pokedex.js";

document.addEventListener("DOMContentLoaded", entryPoint);

async function entryPoint() {
  new Pokedex({
    limit: 20,
  });
}


