import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore patterns configuration (placed first for precedence)
  {
    ignores: [
      // Build and output directories
      ".next/**/*",
      "build/**/*",
      "dist/**/*",
      "coverage/**/*",
      "storybook-static/**/*",

      // Dependencies
      "node_modules/**/*",

      // Cache and temp directories
      ".cache/**/*",
      ".now/**/*",
      ".changeset/**/*",

      // Generated files
      "*.min.js",
      "*.css",
      ".DS_Store",

      // Source directories to ignore
      "public/**/*",
      "esm/**/*",
      "scripts/**/*",
      "tests/**/*",

      // Config files to ignore
      "*.config.js",
      "*.config.mjs",
      "*.config.cjs",
      ".lintstagedrc.cjs",
      ".commitlintrc.cjs",

      // Exceptions (files to lint despite being in ignored directories)
      "!plopfile.js",
      "!jest.config.js",
      "!tsup.config.ts",
      "!react-shim.js"
    ]
  },


  // Add configurations from other plugins using compat
  ...compat.config({
    extends: [
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:@next/next/recommended"
    ]
  }),

  // Next.js specific configurations
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules
    }
  },
  // Global language options
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: (await import("@typescript-eslint/parser")).default,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        },
        project: [
          "./tsconfig.json"
        ],
        requireConfigFile: false,
        babelOptions: {
          presets: ["next/babel"]
        }
      },
      globals: {
        React: "readonly"
      }
    },

    // Load plugins
    plugins: {
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin")).default,
      "react": (await import("eslint-plugin-react")).default,
      "jsx-a11y": (await import("eslint-plugin-jsx-a11y")).default,
      "import": (await import("eslint-plugin-import")).default,
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
      "@next/next": nextPlugin
    },

    // Settings
    settings: {
      react: {
        version: "detect"
      },
      next: {
        rootDir: __dirname
      }
    },

    // Rules
    rules: {
      // General rules
      "no-console": "warn",
      "no-debugger": "warn",
      "no-async-promise-executor": "warn",

      // React rules
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/jsx-pascal-case": "off",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "unused-imports/no-unused-imports": "warn",

      // Import rules
      "import/order": [
        "warn",
        {
          groups: ["type", "builtin", "object", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "~/**",
              group: "external",
              position: "after"
            }
          ],
          "newlines-between": "always"
        }
      ],

      // React style rules
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true
        }
      ],

      // TODO: enable these rules in future (after seeing if they are necessary)
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",

      // Code formatting
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
      ]
    }
  }
];

export default eslintConfig;