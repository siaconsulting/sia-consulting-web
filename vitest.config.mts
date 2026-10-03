import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      'server-only': path.resolve('node_modules/next/dist/compiled/server-only/empty.js'),
    },
  },
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    fileParallelism: false,
    hookTimeout: 90_000,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
