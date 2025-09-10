import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const BASE = "/front_6th_chapter4-2/";

export default defineConfig({
	plugins: [react()],
	base: BASE,
	define: {
		__BASE__: BASE,
	},
});
