import pluginJs from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  perfectionist.configs['recommended-natural'],
]

