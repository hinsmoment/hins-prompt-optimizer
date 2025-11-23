import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hins-prompt-optimizer/',
  server: {
    proxy: {
      '/api/proxy': {
        target: 'https://api.openai.com/v1', // Default target, will be overridden by header or dynamic logic if needed, but for simple proxy we might need a more dynamic approach or just guide user to use direct URL if supported. 
        // Actually, for dynamic targets, we can use a function bypass or just set changeOrigin: true.
        // However, standard Vite proxy is static. 
        // A better approach for dynamic user-defined URLs in a static app is hard.
        // BUT, for the specific case of "ModelScope" or known providers, we can map them.
        // OR, we simply tell the user: "If you use a custom URL that doesn't support CORS, you must run a local proxy or use a CORS-enabled service."
        // Let's try a generic catch-all proxy if possible, or just specific ones.
        // Since we can't dynamically change the proxy target at runtime in a static build easily without a backend.
        // WAIT: We are in 'npm run dev'. We can configure the proxy to forward everything starting with /api/proxy to a target.
        // But the target is variable.
        // Let's set a broad proxy for common ones if we can, or just rely on the user providing a CORS-enabled URL for now, 
        // AND provide a specific proxy for ModelScope if that's the main blocker.
        target: 'https://api-inference.modelscope.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '')
      }
    }
  }
})
