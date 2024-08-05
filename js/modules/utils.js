const utilsModule = (function () {
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const cleanHTML = (html) => {
    while (html.firstChild) {
      html.removeChild(html.firstChild);
    }
  };

  const getIdFromUrl = (url) => {
    return parseInt(url.split("/").filter(Boolean).pop(), 10);
  };

  const padNumber = (num, size) => {
    return num.toString().padStart(size, "0");
  };

  const replaceNewLines = (str) => {
    return str.replace(/\n/g, " ").replace(/\f/g, "");
  };

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const transitionEnd = async (element) => {
    return new Promise((resolve) => {
      const handleTransitionEnd = () => {
        element.removeEventListener("transitionend", handleTransitionEnd);
        resolve();
      };
      element.addEventListener("transitionend", handleTransitionEnd);
    });
  };

  return {
    capitalize,
    cleanHTML,
    getIdFromUrl,
    padNumber,
    replaceNewLines,
    sleep,
    transitionEnd,
  };
})();

export { utilsModule };
