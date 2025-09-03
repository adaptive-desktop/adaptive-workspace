# TypeScript Library Template

A comprehensive starter template for creating TypeScript libraries, pre-configured with testing infrastructure.

## Features

This template comes pre-configured with:

- **🧪 Testing** - Jest testing framework setup
- **📦 TypeScript** - Full TypeScript support with build configuration
- **✨ Prettier** - Code formatting and style consistency
- **🔧 ESLint** - Code linting and quality checks
- **📦 Rollup** - Module bundling for distribution
- **📚 TypeDoc** - Documentation generation

## Getting Started

### Installation

1. **Clone or use this template:**

   ```sh
   git clone https://github.com/your-username/typescript-library-template.git my-library
   cd my-library
   ```

2. **Install dependencies:**

   ```sh
   # npm
   npm install

   # yarn
   yarn install

   # pnpm
   pnpm install
   ```

3. **Commit your lock file:**
   ```sh
   git add package-lock.json  # or yarn.lock / pnpm-lock.yaml
   git commit -m "Add lock file for reproducible builds"
   ```

4. **Update package.json:**
   - Change the `name` field from `@your-org/your-library-name` to your library name
   - Update `version`, `description`, and other metadata
   - Update the repository URL from `https://github.com/your-username/your-repo.git`
   - Update the author information from `Your Name <your.email@example.com>`

5. **Replace example code:**
   - The `src/lib/` directory contains example code (Calculator class and utilities)
   - Replace this with your actual library code
   - Update the exports in `src/index.ts` to match your library's public API

> **📦 Package Manager Choice:** This template works with npm, yarn, or pnpm. Choose your preferred package manager and use it consistently throughout your project. The examples below show commands for all three - use whichever you prefer.

> **🔒 Lock Files Required:** The CI workflows require a lock file to be committed for reproducible builds. After running your first `install` command, make sure to commit the generated lock file (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`).

### Development

#### Building Your Library

Build the library for distribution:

```sh
npm run build             # or: yarn build / pnpm build
```

Watch for changes during development:

```sh
npm run build:watch       # or: yarn build:watch / pnpm build:watch
```

#### Testing

Run tests:

```sh
# Run all tests
npm test                  # or: yarn test / pnpm test

# Run tests in watch mode
npm run test:watch        # or: yarn test:watch / pnpm test:watch

# Run tests with coverage
npm run test:coverage     # or: yarn test:coverage / pnpm test:coverage
```

#### Code Formatting

Format your code with Prettier:

```sh
# Format all files
npm run format            # or: yarn format / pnpm format

# Check if files are formatted correctly
npm run format:check      # or: yarn format:check / pnpm format:check

# Lint your code
npm run lint              # or: yarn lint / pnpm lint

# Fix linting issues automatically
npm run lint:fix          # or: yarn lint:fix / pnpm lint:fix
```

## Publishing

1. Build your library: `npm run build` (or `yarn build` / `pnpm build`)
2. Update version in `package.json`
3. Publish to npm: `npm publish`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for your changes
4. Ensure all tests pass
5. Submit a pull request
