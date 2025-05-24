import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Chargement des variables d'environnement
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    // Définition explicite des variables d'environnement
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify('AIzaSyCvYPAEcFKrjb0sgZgq0NoVvWhy9Y_S_cc')
    },
  };
}); 