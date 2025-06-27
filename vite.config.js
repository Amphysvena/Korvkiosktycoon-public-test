import { resolve } from 'path';

export default {
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.js'),
      },
      output: {
        entryFileNames: 'index.js'
      }
    }
  }
};
