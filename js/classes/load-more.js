// Modules
import { utilsModule } from "../modules/utils.js";

class LoadMore {
  constructor({ onClick }) {
    this.onClick = onClick;

    this.loadMoreButton = document.getElementById("load-more-button");
    this.loadMoreLoader = document.getElementById("load-more-loader");

    this.loadMoreButton.addEventListener("click", this.handleLoadMoreClick.bind(this));
  }

  async handleLoadMoreClick() {
    this.hideButton();
    this.showLoader();

    await utilsModule.sleep(1000);

    this.hideLoader();
    this.showButton();

    this.onClick();
  }

  showButton() {
    this.loadMoreButton.classList.remove("load-more__button--hidden");
  }

  hideButton() {
    this.loadMoreButton.classList.add("load-more__button--hidden");
  }

  showLoader() {
    this.loadMoreLoader.classList.add("load-more__loader--visible");
  }

  hideLoader() {
    this.loadMoreLoader.classList.remove("load-more__loader--visible");
  }
}

export { LoadMore };
