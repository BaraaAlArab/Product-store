import Theme from "../models/Theme.model.js";

const singletonId = "6500000000000000000000a1";

const getOrCreate = async () => {
  const existing = await Theme.findById(singletonId);
  if (existing) return existing;
  const created = await Theme.create({ _id: singletonId, theme: "default" });
  return created;
};

export const getTheme = async (req, res) => {
  try {
    const settings = await getOrCreate();
    res.status(200).json({ theme: settings.theme });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const setTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const valid = ["default", "ramadan", "eid", "easter", "christmas", "newyear", "worldcup"];
    if (!theme || !valid.includes(theme)) {
      return res.status(400).json({ message: "Invalid theme. Choose: " + valid.join(", ") });
    }
    const settings = await getOrCreate();
    settings.theme = theme;
    await settings.save();
    res.status(200).json({ theme: settings.theme, message: `Theme set to "${theme}"` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};