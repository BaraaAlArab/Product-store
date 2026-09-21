// Site-wide event themes: applied to every visitor via documentElement[data-event]

export const EVENT_THEMES = [
  { id: "default", label: "No event theme" },
  { id: "ramadan", label: "Ramadan" },
  { id: "eid", label: "Eid al-Fitr" },
  { id: "easter", label: "Easter" },
  { id: "christmas", label: "Christmas" },
  { id: "newyear", label: "Happy New Year" },
  { id: "worldcup", label: "World Cup" },
];

export const EVENT_THEME_EVENT = "eventthemechange";

export const currentEventTheme = () => document.documentElement.dataset.event || "default";

export function applyEventTheme(id) {
  const el = document.documentElement;
  if (!id || id === "default") {
    delete el.dataset.event;
  } else {
    el.dataset.event = id;
  }
  window.dispatchEvent(new CustomEvent(EVENT_THEME_EVENT, { detail: id || "default" }));
}

export async function fetchEventTheme() {
  const res = await fetch("/api/theme");
  if (!res.ok) throw new Error("Could not load theme");
  const data = await res.json();
  return data.theme || "default";
}

export async function initEventTheme() {
  try {
    applyEventTheme(await fetchEventTheme());
  } catch {
    // keep the current theme on failure
  }
}

export async function saveEventTheme(id, token) {
  const res = await fetch("/api/theme", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ theme: id }),
  });
  if (!res.ok) throw new Error("Could not save theme");
  const data = await res.json();
  return data;
}