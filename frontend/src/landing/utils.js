/**
 * Smoothly scroll to a section by its element ID.
 * Shared across header, footer, and any other component that needs anchor navigation.
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
