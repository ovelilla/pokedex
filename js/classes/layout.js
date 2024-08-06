class Layout {
  constructor() {
    this.themeToggleButton = document.getElementById("theme-toggle-button");

    window.addEventListener("resize", this.handleResize.bind(this));
    this.themeToggleButton.addEventListener("click", this.handleThemeToggleClick.bind(this));

    this.resizeTimeout = null;
  }

  handleResize() {
    document.body.classList.add("no-transitions");
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      document.body.classList.remove("no-transitions");
    }, 300);
  }

  handleThemeToggleClick() {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  }
}

export { Layout };
