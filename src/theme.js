export function themify() {
  document.documentElement.classList.remove("light", "dark", "system");

  const storedTheme = localStorage.getItem("theme");

  switch (storedTheme) {
    case "dark":
      {
        document.documentElement.classList.add("dark");
      }
      break;
    case "light":
      {
        document.documentElement.classList.add("light");
      }
      break;
    default: {
      if (storedTheme != "system") {
        localStorage.removeItem("theme");
      }

      document.documentElement.classList.add("system");
    }
  }
}
