import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths],
  base:"./Product-store",
  server:{
    proxy:{
      "/api":{
        target:"http://localhost:5000"
      }
    }
  }
});
