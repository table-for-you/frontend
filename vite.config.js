import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginHtmlEnv from "vite-plugin-html-env";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginHtmlEnv(),
    vitePluginHtmlEnv({ compiler: true }),
  ],
});
