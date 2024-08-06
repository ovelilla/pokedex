class Loader {
  constructor() {
    this.loader = document.getElementById("loader");
  }

  show() {
    this.loader.classList.add("loader--show");
    this.disableScroll();
  }

  hide() {
    this.loader.classList.remove("loader--show");
    this.enableScroll();
  }

  disableScroll() {
    document.body.classList.add("no-scroll-disabled");
  }

  enableScroll() {
    document.body.classList.remove("no-scroll-disabled");
  }
}

export { Loader };
