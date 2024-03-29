import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
  build: {
    rollupOptions: {
        output: {
            assetFileNames: 'output[extname]',
            entryFileNames: 'output.js'
        }
    }
}
})
