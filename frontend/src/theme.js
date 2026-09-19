import {createSystem, defaultConfig, defineConfig} from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    html: {
      fontFamily: "Inter, sans-serif",
    },
    body: {
      bg: "gray.50",
      color: "gray.900",
      _dark: {
        bg: "gray.950",
        color: "gray.100",
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);