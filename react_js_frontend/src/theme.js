//
// Theme color definitions and CSS variable injection for the notes app.
//
const THEME = {
  primary: "#1976d2",
  secondary: "#2196f3",
  accent: "#ffb300",
  background: "#ffffff",
  backgroundSecondary: "#f8f9fa",
  textPrimary: "#24292f",
  textSecondary: "#6a737d",
  border: "#e9ecef",
};

export function injectTheme() {
  Object.entries(THEME).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
}
export default THEME;
