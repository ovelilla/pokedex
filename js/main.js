// Classes
import { Layout } from "./clases/layout.js";
import { Pokedex } from "./clases/pokedex.js";

document.addEventListener("DOMContentLoaded", entryPoint);

async function entryPoint() {
  new Layout();
  new Pokedex({
    limit: 20,
  });
}


