// @ts-check

import { themify } from "./theme";

/**
 *
 * @param {Element} el
 *
 * @returns {el is HTMLButtonElement}
 */
function assertIsButton(el) {
  return el instanceof HTMLButtonElement;
}

const dropdownMenuCtrls = document.querySelectorAll(
  "[data-dropdown-menu-ctrl]"
);

/**
 * @param {Element} el
 * @param {(currChild: Element) => boolean} cb
 */
function traverseChildren(el, cb) {
  if (cb(el)) {
    return true;
  }

  for (const child of el.children) {
    if (traverseChildren(child, cb)) {
      return true;
    }
  }

  return false;
}

dropdownMenuCtrls.forEach((el) => {
  if (!assertIsButton(el)) {
    throw new Error("");
  }

  el.addEventListener("click", () => {
    const dropdownMenuId = el.getAttribute("aria-controls");
    const dropdownMenu = document.getElementById(dropdownMenuId);

    if (!dropdownMenu) {
      throw new Error("");
    }

    const isExpanded = el.getAttribute("aria-expanded") == "true";

    if (isExpanded) {
      el.setAttribute("aria-expanded", "false");
      dropdownMenu.setAttribute("aria-hidden", "true");

      dropdownMenu.querySelectorAll("button[role=menuitem]").forEach((btn) => {
        btn.setAttribute("tabindex", "-1");
      });
    } else {
      el.setAttribute("aria-expanded", "true");
      dropdownMenu.setAttribute("aria-hidden", "false");

      dropdownMenu.querySelectorAll("button[role=menuitem]").forEach((btn) => {
        btn.setAttribute("tabindex", "0");
      });
    }
  });
});

document.addEventListener("click", (ev) => {
  const target = ev.target;
  const activeDropdownMenus = document.querySelectorAll(
    "[data-dropdown-menu][aria-hidden=false]"
  );

  activeDropdownMenus.forEach((dm) => {
    const btnCtrlId = dm.getAttribute("aria-labelledby");
    const btnCtrl = document.getElementById(btnCtrlId);

    if (!assertIsButton(btnCtrl)) {
      throw new Error("");
    }

    if (
      traverseChildren(dm, (currChild) => {
        return currChild == target;
      }) ||
      traverseChildren(btnCtrl, (currChild) => {
        return currChild == target;
      })
    ) {
      return;
    }

    btnCtrl.setAttribute("aria-expanded", "false");
    dm.setAttribute("aria-hidden", "true");

    dm.querySelectorAll("button[role=menuitem]").forEach((btn) => {
      btn.setAttribute("tabindex", "-1");
    });
  });
});

const themeBtns = document.querySelectorAll("button[data-theme]");

themeBtns.forEach((btn) => {
  if (!assertIsButton(btn)) {
    throw new Error("");
  }

  btn.addEventListener("click", () => {
    const theme = btn.getAttribute("data-value");

    themeBtns.forEach((btnn) => {
      btnn.removeAttribute("data-selected");
    });

    btn.setAttribute("data-selected", "true");

    localStorage.setItem("theme", theme);
    themify();
  });
});

setInterval(() => {
  const slideshows = document.querySelectorAll("[data-slideshow]");

  slideshows.forEach((el) => {
    const contents = el.querySelectorAll("[data-slideshow-content]");

    for (let i = 0; i < contents.length; ++i) {
      const content = contents[i];
      const isActive =
        content.getAttribute("data-slideshow-content") == "current";

      if (isActive) {
        const nextIdx =
          (+content.getAttribute("data-index") + 1) % contents.length;

        content.addEventListener(
          "transitionend",
          () => {
            content.setAttribute("hidden", "");
            contents[nextIdx].setAttribute("data-slideshow-content", "current");
          },
          { once: true }
        );

        content.setAttribute("data-slideshow-content", "");
        contents[nextIdx].removeAttribute("hidden");

        break;
      }
    }
  });
}, 5000);
