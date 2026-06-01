import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Per-file environment: web.test.mjs opts into jsdom via a docblock.
    environment: 'node',
    include: ['tests/**/*.test.mjs'],
    globals: false,
  },
});
