class Search {
  constructor({ onInput }) {
    this.onInput = onInput;

    this.search = document.getElementById("search");
    this.searchInput = document.getElementById("search-input");
    this.openSearchButton = document.getElementById("open-search-button");
    this.closeSearchButton = document.getElementById("close-search-button");

    this.searchInput.addEventListener("input", this.handleSearchInput.bind(this));
    this.openSearchButton.addEventListener("click", this.handleOpenSearchClick.bind(this));
    this.closeSearchButton.addEventListener("click", this.handleCloseSearchClick.bind(this));
  }

  getValue() {
    return this.searchInput.value;
  }

  handleSearchInput(event) {
    this.value = event.target.value;
    this.onInput(event.target.value);
  }

  handleOpenSearchClick() {
    this.search.classList.add("search--visible");
    this.searchInput.focus();
  }

  handleCloseSearchClick() {
    this.search.classList.remove("search--visible");
    this.searchInput.value = "";
    this.onInput("");
  }

  reset() {
    this.searchInput.value = "";
    this.onInput("");
  }

  trigger() {
    this.onInput(this.value);
  }
}

export { Search };
