import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'coverage/**',
      'docs/assets/**',
      'docs/registerSW.js',
      'docs/sw.js',
      'docs/workbox-*.js',
      'node_modules/**',
      'dist/**'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['*.config.js', '*.config.ts', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly'
      }
    }
  },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-floating-promises': 'off'
    }
  },
  prettier
);
