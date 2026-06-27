import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Force a SINGLE copy of three across the app + drei + its transitive deps
  // (stats-gl bundles an older three; without dedupe two THREE instances load
  // and React Three Fiber white-screens at runtime).
  resolve: {
    dedupe: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
})
