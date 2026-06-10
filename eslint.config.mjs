import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'

export default tseslint.config(
  { ignores: ['.next/**', 'dist/**', 'node_modules/**', 'scripts/**', 'download-images.js', 'download-manual.js', 'download-pexels.js', 'download-vendors-categories.js'] },
  ...tseslint.configs.recommended,
  {
    plugins: nextPlugin.configs['core-web-vitals'].plugins,
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['landingpage-demo', 'commerce-demo', 'marketplace-demo', 'content-platform-demo', 'database-security-demo', 'web-application-demo'], message: 'demo must not import sibling demo' },
            ],
        },
      ],
    },
  },
)

