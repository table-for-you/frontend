import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginHtmlEnv from "vite-plugin-html-env";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    vitePluginHtmlEnv(),
    vitePluginHtmlEnv({ compiler: true }),
    {
      name: "custom-service-worker",
      closeBundle() {
        const templatePath = path.resolve(
          __dirname,
          "firebase-messaging-sw.template.js",
        );
        const outputPath = path.resolve(
          __dirname,
          "dist/firebase-messaging-sw.js",
        );

        let template = fs.readFileSync(templatePath, "utf-8");

        // 환경변수 대체
        template = template
          .replace(
            "import.meta.env.VITE_FIRE_API_KEY",
            `"${process.env.VITE_FIRE_API_KEY}"`,
          )
          .replace(
            "import.meta.env.VITE_AUTH_DOMAIN",
            `"${process.env.VITE_AUTH_DOMAIN}"`,
          )
          .replace(
            "import.meta.env.VITE_PROJECT_ID",
            `"${process.env.VITE_PROJECT_ID}"`,
          )
          .replace(
            "import.meta.env.VITE_STORAGE_BUCKET",
            `"${process.env.VITE_STORAGE_BUCKET}"`,
          )
          .replace(
            "import.meta.env.VITE_MESSAGING_SENDER_ID",
            `"${process.env.VITE_MESSAGING_SENDER_ID}"`,
          )
          .replace(
            "import.meta.env.VITE_APP_ID",
            `"${process.env.VITE_APP_ID}"`,
          )
          .replace(
            "import.meta.env.VITE_MEASUREMENT_ID",
            `"${process.env.VITE_MEASUREMENT_ID}"`,
          );

        fs.writeFileSync(outputPath, template);
      },
    },
  ],
});
