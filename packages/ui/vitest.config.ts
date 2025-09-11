import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    include: [
      './tests/{unit,contract,integration}{,/**}/*.{test,spec}.{ts,tsx}',
    ],
    coverage: {
      reportsDirectory: './tests/unit/coverage',
    },
    environment: 'jsdom',
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
