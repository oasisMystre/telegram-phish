import { defineConfig, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}"],
  },
  theme: {
    colors: {
      primary: "#385446",
      secondary: "#366950",
      tetiary: "#3c7659"
    }
  },
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: ["Roboto"],
      },
      provider: "google",
    }),
  ],
});
