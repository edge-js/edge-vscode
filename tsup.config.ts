import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/vscode/index.ts'],
  external: ['vscode'],
  format: ['cjs'],
  shims: false,
  dts: false,
})
