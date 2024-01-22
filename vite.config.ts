import preact from "@preact/preset-vite";
import UnoCSS from "unocss/vite";
import { defineConfig, loadEnv } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      UnoCSS(),
      preact(),
      EnvironmentPlugin("all", { prefix: "" }),
      VitePWA({ registerType: "autoUpdate" }),
    ],
    define: {
      "process.env": { ...env, ...process.env },
    },
  };
});
