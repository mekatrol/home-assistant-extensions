import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

const resolvePath = (str: string): string => resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // treat all tags with a dash as custom elements
            isCustomElement: (tag) => tag.includes('-')
          }
        }
      })
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    build: {
      minify: mode === 'development' ? false : true,
      lib: {
        entry: resolvePath('src/main.ts'),
        name: 'mekatrol-vue-plugin-container',
        fileName: (format: string, name: string) => {
          return `${name}.${format}.js`;
        }
      },
      target: 'modules',
      outDir: 'dist',
      rollupOptions: {
        output: {
          entryFileNames: `mekatrol-vue-plugin-container.[format].js`
        }
      }
    }
  };
});
