import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

const resolvePath = (str: string): string => resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const viteEnv: Record<string, string> = {};
  Object.keys(env).forEach((key) => {
    if (key.startsWith(`VITE_`)) {
      viteEnv[`${key}`] = env[key]!;
    }
  });

  return {
    plugins: [],
    build: {
      lib: {
        entry: resolvePath('src/main.ts'),
        name: 'mekatrol-controls',
        fileName: (format, name) => {
          if (format === 'es') {
            return `${name}.js`;
          }

          return `${name}.cjs`;
        }
      },
      target: 'modules', // Change to 'es' if needed
      outDir: 'dist', // Specify the output directory
      assetsDir: '', // Set to an empty string to prevent an additional assets directory
      minify: mode === 'development' ? false : true,
      rollupOptions: {
        output: {
          entryFileNames: `mekatrol-controls.js`,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'main.css') return 'main.css';
            return assetInfo.name ?? '';
          }
        },
        external: ['./src/components/DebugContainer.ts', './src/home-assistant/HomeAssistantImpl.ts']
      }
    }
  };
});
