# Adaptive Workspace

[![npm version](https://badge.fury.io/js/@adaptive-desktop%2Fadaptive-workspace.svg)](https://badge.fury.io/js/@adaptive-desktop%2Fadaptive-workspace)
[![CI](https://github.com/adaptive-desktop/adaptive-workspace/workflows/Test/badge.svg)](https://github.com/adaptive-desktop/adaptive-workspace/actions)
[![codecov](https://codecov.io/gh/adaptive-desktop/adaptive-workspace/graph/badge.svg?token=M6VECB6C8O)](https://codecov.io/gh/adaptive-desktop/adaptive-workspace)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

Framework-agnostic workspace layout manager for adaptive desktop applications. The core foundation for building VS Code-style layouts with resizable viewports, dynamic panel organization, and flexible workspace management.

## ✨ Features

- **🏢 Workspace Management**: Organize viewports within adaptive workspaces
- **🔄 Dynamic Operations**: Split, remove, and manage viewports seamlessly
- **🎯 Framework Agnostic**: Zero UI dependencies, works with React, Vue, Angular
- **💎 Type Safe**: 100% TypeScript with comprehensive type definitions
- **🧪 Test-Driven**: Built with TDD approach for reliable behavior (124 tests passing)
- **⚡ Simple & Fast**: Direct viewport management without complex tree operations
- **📦 Zero Dependencies**: Only `tslib` for TypeScript helpers

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @adaptive-desktop/adaptive-workspace

# yarn
yarn add @adaptive-desktop/adaptive-workspace

# pnpm
pnpm add @adaptive-desktop/adaptive-workspace
```

### Basic Usage

```typescript
import { createWorkspace } from '@adaptive-desktop/adaptive-workspace';

// Create a workspace
const workspace = createWorkspace('main-workspace', {
  x: 0,
  y: 0,
  width: 1920,
  height: 1080,
});

// Start with empty layout, then add first viewport
let layout = workspace.layout;
layout = layout.insertViewport([], 'editor');

// Split the viewport horizontally
layout = layout.splitViewport({ row: 0, column: 0 }, 'terminal', 'horizontal');

// Insert a sidebar to the left
layout = layout.insertViewport(
  [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
  ],
  'sidebar',
  'left'
);

// Get all viewports
const viewports = layout.getAllViewports(); // ['editor', 'terminal', 'sidebar']

// Find viewport position
const editorPos = layout.getPositionForPanel('editor'); // { row: 0, column: 1 }
```

## 📖 Core Concepts

### Workspace Layout Management

Adaptive workspaces organize content using a coordinate-based system:

- **Workspace** - The container with screen position and dimensions
- **Layout** - Grid organization of viewports within the workspace
- **Viewport** - Individual areas that contain panels
- **Panel** - The actual content (editors, terminals, sidebars, etc.)

```typescript
// Create VS Code-style layout step by step
const workspace = createWorkspace('ide', { x: 0, y: 0, width: 1920, height: 1080 });

// Start empty, add editor
let layout = workspace.layout.insertViewport([], 'editor');

// Split horizontally for terminal
layout = layout.splitViewport({ row: 0, column: 0 }, 'terminal', 'horizontal');

// Add sidebar to the left
layout = layout.insertViewport(
  [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
  ],
  'sidebar',
  'left'
);

// Result: sidebar | editor
//                 | terminal
```

### Layout Operations

```typescript
import { createWorkspace } from '@adaptive-desktop/adaptive-workspace';

const workspace = createWorkspace('main', { x: 0, y: 0, width: 800, height: 600 });
let layout = workspace.layout.insertViewport([], 'panel1');

// Split operations
layout = layout.splitViewport({ row: 0, column: 0 }, 'panel2', 'vertical');

// Insert operations (add new row/column)
layout = layout.insertViewport([{ row: 0, column: 0 }], 'panel3', 'above');

// Swap operations
layout = layout.swapViewports('panel1', 'panel2');

// Remove operations
layout = layout.removeViewport({ row: 1, column: 0 });

// All operations are immutable - return new layout instances
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
│           @adaptive-desktop/adaptive-workspace              │
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
git clone https://github.com/adaptive-desktop/adaptive-workspace.git
cd adaptive-workspace

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
