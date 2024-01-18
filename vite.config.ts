import preact from "@preact/preset-vite";
import UnoCSS from "unocss/vite";
import { defineConfig, loadEnv } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [UnoCSS(), preact(), EnvironmentPlugin("all", { prefix: "" })],
    define: {
      "process.env": { ...env, ...process.env },
    },
  };
});
