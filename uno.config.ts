import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import { defineConfig, presetIcons, presetUno } from "unocss";

export default defineConfig({
  shortcuts: {
    badge: "rounded-md bg-gray-800 text-white text-xs p-1 ml-1",
  },
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        ph: () => import("@iconify-json/ph/icons.json").then((x) => x.default),
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
