
(() => {

  const navbar =
    document.querySelector(".navbar");

  const button =
    document.querySelector(
      ".mobile-menu-button"
    );

  const nav =
    navbar?.querySelector("nav");

  if (
    !navbar ||
    !button ||
    !nav
  ) {
    return;
  }

  function closeMenu() {

    navbar.classList.remove(
      "mobile-menu-open"
    );

    button.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  button.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      const opened =
        navbar.classList.toggle(
          "mobile-menu-open"
        );

      button.setAttribute(
        "aria-expanded",
        String(opened)
      );
    }
  );

  nav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMenu
      );
    });

  document.addEventListener(
    "click",
    (event) => {

      if (
        !navbar.contains(
          event.target
        )
      ) {
        closeMenu();
      }
    });

})();
