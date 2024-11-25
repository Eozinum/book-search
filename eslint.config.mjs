import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginImportX from 'eslint-plugin-import-x'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginSecurity from 'eslint-plugin-security'
import globals from 'globals'
import { config as testLintConfig, configs as testLintConfigs, plugin as pluginTestLint } from 'typescript-eslint'

// eslint-import-resolver-typescript
// Though not imported it's used as a dependency for typescript-eslint

export default testLintConfig(
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    ignores: ['**/node_modules', '**/dist', '**/*.d.ts'],
  },
  {
    languageOptions: { globals: { ...globals.node } },
  },
  {
    plugins: {
      '@typescript-eslint': pluginTestLint,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginJs.configs.recommended,
  ...testLintConfigs.strictTypeChecked,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  pluginSecurity.configs.recommended,

  {
    rules: {
      'array-callback-return': ['error'],
      'arrow-body-style': ['error', 'as-needed'],
      'consistent-return': ['error'],
      'default-param-last': ['error'],
      'dot-notation': ['error'],
      eqeqeq: ['error', 'smart'],
      'func-style': ['error'],
      'max-params': ['error', 4],
      'no-console': ['error'],
      'no-else-return': ['error'],
      'no-eval': ['error'],
      'no-multi-assign': ['error'],
      'no-nested-ternary': ['error'],
      'no-new': ['error'],
      'no-new-wrappers': ['error'],
      'no-param-reassign': ['error', { props: true }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-restricted-globals': ['error'],
      'no-restricted-properties': ['error'],
      'no-underscore-dangle': ['error'],
      'no-unneeded-ternary': ['error'],
      'no-useless-rename': ['error', { ignoreImport: true }],
      'object-shorthand': ['error', 'always'],
      'one-var': ['error', 'never'],
      'prefer-destructuring': ['error'],
      'prefer-template': ['error'],
      'security/detect-object-injection': ['off'],
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          'ts-check': false,
          minimumDescriptionLength: 10,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-require-imports': ['off'],
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      'eol-last': 'error',
    },
  },

  // Disable type checking for JS config files
  {
    files: ['**/*.config.{mjs,js,cjs}'],
    extends: [testLintConfigs.disableTypeChecked],
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },

  // Import
  {
    rules: {
      'import-x/default': ['off'], // TODO: Affects libraries like ZOD, get back to it later
      'import-x/no-unresolved': ['off'],
      'import-x/no-deprecated': ['warn'],
      'import-x/no-extraneous-dependencies': ['error'],
      'import-x/no-mutable-exports': ['error'],
      'import-x/no-rename-default': ['warn'],
      'import-x/order': [
        'error',
        {
          'newlines-between': 'never',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'index', 'type'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import-x/newline-after-import': ['error'],
      'import-x/no-unassigned-import': ['error', { allow: ['**/*.css', 'dotenv/config'] }],
      // TODO: need to enforce named exports
    },
  },

  // React
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      'jsx-quotes': ['error', 'prefer-double'],
      'react/prop-types': ['off'],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-indent': ['error', 2],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  eslintConfigPrettier,
)
