import mongoose from "mongoose";

const EVENT_THEMES = [
  "default",
  "ramadan",
  "eid",
  "easter",
  "christmas",
  "newyear",
  "worldcup",
];

const ThemeSchema = new mongoose.Schema(
  {
    // Single-document settings: the active site-wide event theme
    theme: { type: String, enum: EVENT_THEMES, default: "default" },
  },
  { timestamps: true },
);

export const THEME_IDS = EVENT_THEMES;

export default mongoose.model("Theme", ThemeSchema);