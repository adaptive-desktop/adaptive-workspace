# Binary Layout Tree

[![npm version](https://badge.fury.io/js/@adaptive-desktop%2Fbinary-layout-tree.svg)](https://badge.fury.io/js/@adaptive-desktop%2Fbinary-layout-tree)
[![CI](https://github.com/adaptive-desktop/binary-layout-tree/workflows/Test/badge.svg)](https://github.com/adaptive-desktop/binary-layout-tree/actions)
[![codecov](https://codecov.io/gh/adaptive-desktop/binary-layout-tree/graph/badge.svg?token=M6VECB6C8O)](https://codecov.io/gh/adaptive-desktop/binary-layout-tree)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

Framework-agnostic binary layout tree for adaptive desktop workspaces. The core foundation for building VS Code-style layouts with resizable panels, pinned sidebars, and flexible content organization.

## ✨ Features

- **🌳 Pure Binary Tree**: Mathematical elegance with predictable behavior
- **� Immutable Operations**: All operations return new tree instances
- **🎯 Framework Agnostic**: Zero UI dependencies, works with React, Vue, Angular
- **� Type Safe**: 100% TypeScript with comprehensive type definitions
- **🧪 Fully Tested**: 100% test coverage with 84 comprehensive tests
- **⚡ Performance Optimized**: Efficient algorithms for tree operations
- **📦 Zero Dependencies**: Only `tslib` for TypeScript helpers

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @adaptive-desktop/binary-layout-tree

# yarn
yarn add @adaptive-desktop/binary-layout-tree

# pnpm
pnpm add @adaptive-desktop/binary-layout-tree
```

### Basic Usage

```typescript
import { LayoutTree } from '@adaptive-desktop/binary-layout-tree';

// Create a simple layout
const tree = new LayoutTree({
  direction: 'row',
  first: 'sidebar',
  second: {
    direction: 'column',
    first: 'editor',
    second: 'terminal',
    splitPercentage: 75
  },
  splitPercentage: 20
});

// Get all panel IDs
const panels = tree.getPanelIds(); // ['sidebar', 'editor', 'terminal']

// Check if tree contains a panel
const hasEditor = tree.hasPanel('editor'); // true

// Find path to a panel
const editorPath = tree.findPanelPath('editor'); // ['second', 'first']
```

## 📖 Core Concepts

### Binary Tree Structure

Every layout is represented as a binary tree where:
- **Leaf nodes** are panel IDs (string or number)
- **Parent nodes** split space between two children
- **Direction** determines split orientation (`'row'` = horizontal, `'column'` = vertical)
- **Split percentage** controls space allocation (0-100, defaults to 50)

```typescript
// VS Code-style layout
const layout = {
  direction: 'row',
  first: 'sidebar',           // 20% width
  second: {
    direction: 'column',
    first: 'editor',          // 75% of remaining height
    second: 'terminal',       // 25% of remaining height
    splitPercentage: 75
  },
  splitPercentage: 20
};
```

### Tree Operations

```typescript
import { LayoutTree, getLeaves, getNodeAtPath } from '@adaptive-desktop/binary-layout-tree';

const tree = new LayoutTree('single-panel');

// Tree traversal utilities
const allPanels = getLeaves(tree.getRoot());
const nodeAtPath = getNodeAtPath(tree.getRoot(), ['first', 'second']);

// Tree comparison
const tree2 = new LayoutTree('single-panel');
const areEqual = tree.equals(tree2); // true

// Immutable operations
const copy = tree.copy();
```

## 🏗️ Architecture

This library serves as the **core layer** in a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   React Web     │  │  React Native   │  │  Vue/Angular │ │
│  │  Components     │  │   Components    │  │  Components  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Framework Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ @adaptive-      │  │ @adaptive-      │  │ @adaptive-   │ │
│  │ desktop/react   │  │ desktop/react-  │  │ desktop/vue  │ │
│  │                 │  │ native          │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Core Layer                             │
│           @adaptive-desktop/binary-layout-tree              │
│                 (This Package)                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Development

### Prerequisites

- Node.js 16.9+ (for Corepack support)
- Yarn 4.9.0 (managed via Corepack)

### Setup

```bash
# Clone the repository
git clone https://github.com/adaptive-desktop/binary-layout-tree.git
cd binary-layout-tree

# Enable Corepack (if not already enabled)
corepack enable

# Install dependencies
yarn install
```

### Scripts

```bash
# Development
yarn build              # Build for production
yarn build:watch        # Build in watch mode
yarn test               # Run tests
yarn test:watch         # Run tests in watch mode
yarn test:coverage      # Run tests with coverage

# Code Quality
yarn lint               # Run ESLint
yarn lint:fix           # Fix ESLint issues
yarn format             # Format with Prettier
yarn format:check       # Check Prettier formatting
yarn type-check         # Run TypeScript checks

# Documentation
yarn docs               # Generate TypeDoc documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Ensure all checks pass: `yarn test && yarn lint && yarn type-check`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **[@adaptive-desktop/react](https://github.com/adaptive-desktop/react)** - React components for binary layout trees
- **[@adaptive-desktop/react-native](https://github.com/adaptive-desktop/react-native)** - React Native components
- **[Adaptive Desktop](https://github.com/adaptive-desktop)** - Complete adaptive desktop workspace system
