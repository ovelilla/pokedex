const utilsModule = (function () {
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const cleanHTML = (html) => {
    while (html.firstChild) {
      html.removeChild(html.firstChild);
    }
  };

  const padNumber = (num, size) => {
    return num.toString().padStart(size, "0");
  };

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return {
    capitalize,
    cleanHTML,
    padNumber,
    sleep,
  };
})();

export { utilsModule };
