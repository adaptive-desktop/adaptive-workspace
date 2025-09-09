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
import { WorkspaceFactory, DefaultUlidGenerator } from '@adaptive-desktop/adaptive-workspace';

// Create a workspace with default ULID generator
const workspace = WorkspaceFactory.create({
  x: 0,
  y: 0,
  width: 1920,
  height: 1080,
  idGenerator: new DefaultUlidGenerator(),
});

// Create the first viewport (spans full workspace)
const editorViewport = workspace.createViewport();

// Split the viewport to create a terminal below
const terminalViewport = workspace.splitViewport(editorViewport, 'down');

// Split the editor viewport to create a sidebar on the left
const sidebarViewport = workspace.splitViewport(editorViewport, 'left');

// Get all viewports
const viewports = workspace.getViewports();
console.log(`Created ${viewports.length} viewports`); // Created 3 viewports

// Each viewport has an ID and screen bounds
viewports.forEach(viewport => {
  console.log(`Viewport ${viewport.id}:`, viewport.screenBounds);
  // Example: { x: 0, y: 0, width: 640, height: 540 }
});
```

### Custom ID Generators

The library supports custom ID generation strategies for different environments:

```typescript
import { WorkspaceFactory, IdGenerator } from '@adaptive-desktop/adaptive-workspace';

// Custom ID generator for React Native
class ReactNativeIdGenerator implements IdGenerator {
  private counter = 0;
  private timestamp = Date.now();

  generate(): string {
    const now = Date.now();
    if (now !== this.timestamp) {
      this.timestamp = now;
      this.counter = 0;
    }

    const random = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
    return `${this.timestamp.toString(16)}-${(++this.counter).toString(16).padStart(4, '0')}-${random}`;
  }
}

// Use custom generator
const workspace = WorkspaceFactory.create({
  x: 0,
  y: 0,
  width: 1920,
  height: 1080,
  idGenerator: new ReactNativeIdGenerator(),
});
```

## 📖 Core Concepts

### Workspace Layout Management

Adaptive workspaces organize content using a viewport-based system:

- **Workspace** - The container with screen position and dimensions
- **Viewport** - Individual areas with absolute screen coordinates
- **Proportional Bounds** - Viewport positions as 0.0-1.0 ratios within workspace
- **Screen Bounds** - Absolute pixel coordinates for rendering

```typescript
// Create VS Code-style layout step by step
const workspace = WorkspaceFactory.create({
  x: 0,
  y: 0,
  width: 1920,
  height: 1080,
  idGenerator: new DefaultUlidGenerator()
});

// Create main editor viewport (full workspace initially)
const editor = workspace.createViewport();

// Split to create terminal below (editor shrinks, terminal gets bottom half)
const terminal = workspace.splitViewport(editor, 'down');

// Split editor to create sidebar on left (editor shrinks, sidebar gets left portion)
const sidebar = workspace.splitViewport(editor, 'left');

// Result layout:
// ┌─────────┬─────────────┐
// │ sidebar │   editor    │
// ├─────────┼─────────────┤
// │         │  terminal   │
// └─────────┴─────────────┘

// Each viewport has screen coordinates for rendering
console.log(sidebar.screenBounds);   // { x: 0, y: 0, width: 640, height: 1080 }
console.log(editor.screenBounds);    // { x: 640, y: 0, width: 1280, height: 540 }
console.log(terminal.screenBounds);  // { x: 640, y: 540, width: 1280, height: 540 }
```

### Viewport Operations

```typescript
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';

const workspace = WorkspaceFactory.create({ x: 0, y: 0, width: 800, height: 600 });

// Create initial viewport
const viewport1 = workspace.createViewport();

// Split operations (creates new viewport, resizes existing)
const viewport2 = workspace.splitViewport(viewport1, 'right');  // Split vertically
const viewport3 = workspace.splitViewport(viewport1, 'down');   // Split horizontally

// Create viewport with specific proportional bounds (0.0-1.0)
const customViewport = workspace.createViewport({
  x: 0.25,      // 25% from left
  y: 0.25,      // 25% from top
  width: 0.5,   // 50% of workspace width
  height: 0.5   // 50% of workspace height
});

// Viewport management
const allViewports = workspace.getViewports();
const hasViewport = workspace.hasViewport(viewport1.id);

// Remove viewport
workspace.removeViewport(viewport2);

// Swap viewport positions
workspace.swapViewports(viewport1, viewport3);
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

## 🖼️ Vue.js Integration Guide

### Installation & Setup

```bash
npm install @adaptive-desktop/adaptive-workspace
# or
yarn add @adaptive-desktop/adaptive-workspace
```

### Basic Vue Component

```vue
<template>
  <div class="adaptive-workspace" :style="workspaceStyle">
    <div
      v-for="viewport in viewports"
      :key="viewport.id"
      class="viewport"
      :style="getViewportStyle(viewport)"
      @click="selectViewport(viewport)"
    >
      <!-- Your content components go here -->
      <slot :viewport="viewport" :isSelected="selectedViewport?.id === viewport.id">
        <div class="viewport-content">
          <h3>Viewport {{ viewport.id.slice(-6) }}</h3>
          <p>{{ viewport.screenBounds.width }}x{{ viewport.screenBounds.height }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { WorkspaceFactory, type Viewport } from '@adaptive-desktop/adaptive-workspace';

// Props
interface Props {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 1200,
  height: 800,
  x: 0,
  y: 0
});

// Reactive state
const workspace = ref();
const viewports = ref<Viewport[]>([]);
const selectedViewport = ref<Viewport | null>(null);

// Computed styles
const workspaceStyle = computed(() => ({
  position: 'relative',
  width: `${props.width}px`,
  height: `${props.height}px`,
  border: '2px solid #ccc',
  overflow: 'hidden'
}));

// Convert viewport screen bounds to CSS styles
const getViewportStyle = (viewport: Viewport) => ({
  position: 'absolute',
  left: `${viewport.screenBounds.x - props.x}px`,
  top: `${viewport.screenBounds.y - props.y}px`,
  width: `${viewport.screenBounds.width}px`,
  height: `${viewport.screenBounds.height}px`,
  border: '1px solid #999',
  backgroundColor: selectedViewport.value?.id === viewport.id ? '#e3f2fd' : '#f5f5f5'
});

// Methods
const selectViewport = (viewport: Viewport) => {
  selectedViewport.value = viewport;
};

const splitViewport = (direction: 'up' | 'down' | 'left' | 'right') => {
  if (!selectedViewport.value) return;

  const newViewport = workspace.value.splitViewport(selectedViewport.value, direction);
  refreshViewports();
  selectedViewport.value = newViewport;
};

const removeViewport = () => {
  if (!selectedViewport.value || viewports.value.length <= 1) return;

  workspace.value.removeViewport(selectedViewport.value);
  refreshViewports();
  selectedViewport.value = viewports.value[0] || null;
};

const refreshViewports = () => {
  viewports.value = workspace.value.getViewports();
};

// Initialize workspace
onMounted(() => {
  workspace.value = WorkspaceFactory.create({
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height
  });

  // Create initial viewport
  const initialViewport = workspace.value.createViewport();
  refreshViewports();
  selectedViewport.value = initialViewport;
});

// Expose methods for parent components
defineExpose({
  splitViewport,
  removeViewport,
  selectViewport,
  workspace: () => workspace.value,
  selectedViewport: () => selectedViewport.value
});
</script>

<style scoped>
.adaptive-workspace {
  font-family: Arial, sans-serif;
}

.viewport {
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewport:hover {
  background-color: #e8f5e8 !important;
}

.viewport-content {
  text-align: center;
  pointer-events: none;
}
</style>
```

### Advanced Usage with Controls

```vue
<template>
  <div class="workspace-container">
    <!-- Control Panel -->
    <div class="controls">
      <button @click="splitUp" :disabled="!selectedViewport">Split Up</button>
      <button @click="splitDown" :disabled="!selectedViewport">Split Down</button>
      <button @click="splitLeft" :disabled="!selectedViewport">Split Left</button>
      <button @click="splitRight" :disabled="!selectedViewport">Split Right</button>
      <button @click="removeSelected" :disabled="!selectedViewport || viewports.length <= 1">
        Remove
      </button>
    </div>

    <!-- Workspace Component -->
    <AdaptiveWorkspace
      ref="workspaceRef"
      :width="1200"
      :height="600"
      @viewport-selected="onViewportSelected"
    >
      <template #default="{ viewport, isSelected }">
        <YourContentComponent
          :viewport="viewport"
          :is-selected="isSelected"
        />
      </template>
    </AdaptiveWorkspace>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdaptiveWorkspace from './AdaptiveWorkspace.vue';

const workspaceRef = ref();
const selectedViewport = ref(null);
const viewports = ref([]);

const onViewportSelected = (viewport) => {
  selectedViewport.value = viewport;
};

const splitUp = () => workspaceRef.value?.splitViewport('up');
const splitDown = () => workspaceRef.value?.splitViewport('down');
const splitLeft = () => workspaceRef.value?.splitViewport('left');
const splitRight = () => workspaceRef.value?.splitViewport('right');
const removeSelected = () => workspaceRef.value?.removeViewport();
</script>
```

### Reactive State Management

For complex applications, integrate with Pinia or Vuex:

```typescript
// stores/workspace.ts
import { defineStore } from 'pinia';
import { WorkspaceFactory, type Workspace, type Viewport } from '@adaptive-desktop/adaptive-workspace';

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspace: null as Workspace | null,
    viewports: [] as Viewport[],
    selectedViewportId: null as string | null
  }),

  getters: {
    selectedViewport: (state) =>
      state.viewports.find(v => v.id === state.selectedViewportId) || null,

    viewportCount: (state) => state.viewports.length
  },

  actions: {
    initializeWorkspace(bounds: { x: number; y: number; width: number; height: number }) {
      this.workspace = WorkspaceFactory.create(bounds);
      const initialViewport = this.workspace.createViewport();
      this.refreshViewports();
      this.selectedViewportId = initialViewport.id;
    },

    splitViewport(direction: 'up' | 'down' | 'left' | 'right') {
      if (!this.workspace || !this.selectedViewport) return;

      const newViewport = this.workspace.splitViewport(this.selectedViewport, direction);
      this.refreshViewports();
      this.selectedViewportId = newViewport.id;
    },

    removeViewport(viewport?: Viewport) {
      if (!this.workspace) return;

      const targetViewport = viewport || this.selectedViewport;
      if (!targetViewport || this.viewports.length <= 1) return;

      this.workspace.removeViewport(targetViewport);
      this.refreshViewports();

      // Select first available viewport
      if (this.selectedViewportId === targetViewport.id) {
        this.selectedViewportId = this.viewports[0]?.id || null;
      }
    },

    selectViewport(viewportId: string) {
      this.selectedViewportId = viewportId;
    },

    refreshViewports() {
      if (this.workspace) {
        this.viewports = this.workspace.getViewports();
      }
    }
  }
});
```

### Key Integration Points

1. **Reactivity**: Use Vue's `ref()` and `computed()` to make workspace state reactive
2. **Styling**: Convert `screenBounds` to CSS `position: absolute` styles
3. **Events**: Handle viewport selection, splitting, and removal through Vue events
4. **State Management**: Use Pinia/Vuex for complex workspace state across components
5. **Lifecycle**: Initialize workspace in `onMounted()` hook
6. **Props**: Make workspace dimensions configurable through component props

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
