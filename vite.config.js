import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    base: './', // Required for Electron - uses relative paths
    build: {
        outDir: 'docs', // GitHub Pages only supports root or /docs
    },
});
