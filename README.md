# KeepItAlive

## Quick Setup

To get started with the KeepItAlive project, follow these steps:

### Prerequisites

Make sure you have the following installed on your development machine:

- [Node.js](https://nodejs.org/) (version 14.x or later)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/StudentTechHub/KeepItAlive.git
   cd KeepItAlive
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up Husky hooks:**

   ```sh
   npm run prepare
   ```

### Running the Development Server

```sh
npm run dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

### Building the Project

```sh
npm run build
```

This will create an optimized production build in the `.next` directory.

### Linting and Formatting

```sh
npm run lint
```

To format the codebase, run:

```sh
npm run format
```

### Running Tests

To run the tests, run:

```sh
npm run test
```

### Explanation of Key Files and Directories

- **.husky/**  
  This directory contains Git hook scripts configured by Husky. These hooks (like pre-commit, pre-push, and commit message validation) run custom scripts automatically during Git events. For example, you might run tests or linters before commits to ensure code quality.

- **.lintstagedrc.js**  
  This configuration file works with lint-staged. It specifies which linters or formatters to run on files that are staged in Git. The idea is to catch and fix issues only on changed code before a commit, which speeds up the feedback loop.

- **commitlint.config.js**  
  This file configures commitlint, a tool that enforces certain rules on your commit messages. It helps teams maintain a consistent commit history, which is useful for automated changelog generation and clear project history.

- **eslint.config.mjs**  
  This module contains the configuration for ESLint, a tool for identifying and fixing potential issues in your JavaScript/TypeScript code. ESLint helps catch bugs and enforce coding standards, making the codebase more maintainable.

- **next.config.ts**  
  This is the configuration file for Next.js, a React framework. It allows you to customize how Next.js behaves (for example, routing, environment variables, and webpack configuration) and is written in TypeScript to benefit from type checking.

- **package.json**  
  This is the main manifest file for your Node.js project. It includes metadata (like project name, version, author), dependencies, and scripts for tasks like building, testing, or running the project. It’s essential for managing the project’s packages and lifecycle.

- **postcss.config.mjs**  
  This configuration file for PostCSS is used to process CSS with plugins. It can handle tasks like autoprefixing CSS properties or transforming modern CSS syntax for backward compatibility, improving the robustness of your styles.

- **tsconfig.json**  
  This file configures TypeScript for your project. It sets rules about the project's structure and compiler options, helping ensure that the TypeScript code is correctly validated and converted to JavaScript.

Each configuration file and directory serves to maintain high code quality, enforce standards, streamline workflows, and organize your project efficiently in a React/TypeScript/Next.js context.

This should help you get started with the KeepItAlive project. If you have any questions, feel free to reach out!
