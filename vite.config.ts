import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function stubRevenueCat(): Plugin {
  return {
    name: 'stub-revenuecat',
    resolveId(id) {
      if (id === '@revenuecat/purchases-capacitor') return '\0revenuecat-stub';
    },
    load(id) {
      if (id === '\0revenuecat-stub') return 'export const Purchases = {};';
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === 'serve' ? stubRevenueCat() : null,
  ],
  build: {
    outDir: 'dist',
  },
}))
