// Clases
import { Layout } from "./clases/layout.js";
import { Pokedex } from "./clases/pokedex.js";

lucide.createIcons();

document.addEventListener("DOMContentLoaded", entryPoint);

async function entryPoint() {
  new Layout();
  new Pokedex({
    limit: 20,
  });
}
