# Vue.js Integration Guide

Complete guide for integrating `@adaptive-desktop/adaptive-workspace` with Vue.js applications.

## 📋 Table of Contents

- [Installation](#installation)
- [Basic Integration](#basic-integration)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Event Handling](#event-handling)
- [Styling & CSS](#styling--css)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## 🚀 Installation

```bash
# npm
npm install @adaptive-desktop/adaptive-workspace

# yarn
yarn add @adaptive-desktop/adaptive-workspace

# pnpm
pnpm add @adaptive-desktop/adaptive-workspace
```

## 🏗️ Basic Integration

### Simple Workspace Component

```vue
<template>
  <div class="workspace-container">
    <div class="workspace" :style="workspaceStyle">
      <div
        v-for="viewport in viewports"
        :key="viewport.id"
        class="viewport"
        :style="getViewportStyle(viewport)"
        :class="{ active: selectedViewport?.id === viewport.id }"
        @click="selectViewport(viewport)"
      >
        <slot :viewport="viewport" :isSelected="selectedViewport?.id === viewport.id">
          <div class="default-content">
            <h4>Viewport {{ viewport.id.slice(-6) }}</h4>
            <p>{{ viewport.screenBounds.width }}×{{ viewport.screenBounds.height }}</p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { WorkspaceFactory, type Workspace, type Viewport } from '@adaptive-desktop/adaptive-workspace';

// Props with defaults
interface Props {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  initialViewports?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 1200,
  height: 800,
  x: 0,
  y: 0,
  initialViewports: 1
});

// Emits
const emit = defineEmits<{
  viewportSelected: [viewport: Viewport];
  viewportCreated: [viewport: Viewport];
  viewportRemoved: [viewportId: string];
  workspaceChanged: [viewports: Viewport[]];
}>();

// Reactive state
const workspace = ref<Workspace>();
const viewports = ref<Viewport[]>([]);
const selectedViewport = ref<Viewport | null>(null);

// Computed properties
const workspaceStyle = computed(() => ({
  position: 'relative' as const,
  width: `${props.width}px`,
  height: `${props.height}px`,
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#fafafa'
}));

// Convert viewport bounds to CSS positioning
const getViewportStyle = (viewport: Viewport) => {
  const bounds = viewport.screenBounds;
  return {
    position: 'absolute' as const,
    left: `${bounds.x - props.x}px`,
    top: `${bounds.y - props.y}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };
};

// Methods
const selectViewport = (viewport: Viewport) => {
  selectedViewport.value = viewport;
  emit('viewportSelected', viewport);
};

const createViewport = (proportionalBounds?: { x: number; y: number; width: number; height: number }) => {
  if (!workspace.value) return null;
  
  const viewport = workspace.value.createViewport(proportionalBounds);
  refreshViewports();
  emit('viewportCreated', viewport);
  return viewport;
};

const splitViewport = (
  viewportOrId: Viewport | string,
  direction: 'up' | 'down' | 'left' | 'right'
) => {
  if (!workspace.value) return null;
  
  const newViewport = workspace.value.splitViewport(viewportOrId, direction);
  refreshViewports();
  emit('viewportCreated', newViewport);
  return newViewport;
};

const removeViewport = (viewport: Viewport) => {
  if (!workspace.value || viewports.value.length <= 1) return false;
  
  const success = workspace.value.removeViewport(viewport);
  if (success) {
    const removedId = viewport.id;
    refreshViewports();
    
    // Update selection if removed viewport was selected
    if (selectedViewport.value?.id === removedId) {
      selectedViewport.value = viewports.value[0] || null;
    }
    
    emit('viewportRemoved', removedId);
  }
  return success;
};

const swapViewports = (viewport1: Viewport, viewport2: Viewport) => {
  if (!workspace.value) return false;
  
  const success = workspace.value.swapViewports(viewport1, viewport2);
  if (success) {
    refreshViewports();
  }
  return success;
};

const refreshViewports = () => {
  if (workspace.value) {
    viewports.value = workspace.value.getViewports();
    emit('workspaceChanged', viewports.value);
  }
};

// Initialize workspace
onMounted(() => {
  workspace.value = WorkspaceFactory.create({
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height
  });
  
  // Create initial viewports
  for (let i = 0; i < props.initialViewports; i++) {
    const viewport = workspace.value.createViewport();
    if (i === 0) {
      selectedViewport.value = viewport;
    }
  }
  
  refreshViewports();
});

// Watch for prop changes
watch([() => props.width, () => props.height, () => props.x, () => props.y], () => {
  if (workspace.value) {
    workspace.value.updatePosition({
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height
    });
    refreshViewports();
  }
});

// Expose methods for parent components
defineExpose({
  createViewport,
  splitViewport,
  removeViewport,
  swapViewports,
  selectViewport,
  refreshViewports,
  workspace: () => workspace.value,
  viewports: () => viewports.value,
  selectedViewport: () => selectedViewport.value
});
</script>

<style scoped>
.workspace-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.workspace {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.viewport:hover {
  background-color: #f0f8ff !important;
  border-color: #2196f3 !important;
}

.viewport.active {
  background-color: #e3f2fd !important;
  border-color: #1976d2 !important;
  border-width: 2px !important;
}

.default-content {
  text-align: center;
  color: #666;
  pointer-events: none;
  user-select: none;
}

.default-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.default-content p {
  margin: 0;
  font-size: 12px;
  opacity: 0.7;
}
</style>
```

## 🎛️ Component Architecture

### Workspace Controller Component

```vue
<template>
  <div class="workspace-controller">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-group">
        <button @click="splitUp" :disabled="!canSplit">↑ Split Up</button>
        <button @click="splitDown" :disabled="!canSplit">↓ Split Down</button>
        <button @click="splitLeft" :disabled="!canSplit">← Split Left</button>
        <button @click="splitRight" :disabled="!canSplit">→ Split Right</button>
      </div>
      
      <div class="toolbar-group">
        <button @click="removeSelected" :disabled="!canRemove">🗑️ Remove</button>
        <button @click="addViewport">➕ Add Viewport</button>
      </div>
      
      <div class="toolbar-info">
        <span>{{ viewportCount }} viewports</span>
        <span v-if="selectedViewport">
          Selected: {{ selectedViewport.id.slice(-6) }}
        </span>
      </div>
    </div>

    <!-- Workspace -->
    <AdaptiveWorkspace
      ref="workspaceRef"
      :width="workspaceWidth"
      :height="workspaceHeight"
      @viewport-selected="onViewportSelected"
      @workspace-changed="onWorkspaceChanged"
    >
      <template #default="{ viewport, isSelected }">
        <ViewportContent
          :viewport="viewport"
          :is-selected="isSelected"
          @split-request="onSplitRequest"
          @remove-request="onRemoveRequest"
        />
      </template>
    </AdaptiveWorkspace>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AdaptiveWorkspace from './AdaptiveWorkspace.vue';
import ViewportContent from './ViewportContent.vue';
import type { Viewport } from '@adaptive-desktop/adaptive-workspace';

// Props
interface Props {
  workspaceWidth?: number;
  workspaceHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  workspaceWidth: 1200,
  workspaceHeight: 800
});

// State
const workspaceRef = ref();
const selectedViewport = ref<Viewport | null>(null);
const viewportCount = ref(0);

// Computed
const canSplit = computed(() => selectedViewport.value !== null);
const canRemove = computed(() => selectedViewport.value !== null && viewportCount.value > 1);

// Event handlers
const onViewportSelected = (viewport: Viewport) => {
  selectedViewport.value = viewport;
};

const onWorkspaceChanged = (viewports: Viewport[]) => {
  viewportCount.value = viewports.length;
};

const onSplitRequest = (viewport: Viewport, direction: string) => {
  workspaceRef.value?.splitViewport(viewport, direction);
};

const onRemoveRequest = (viewport: Viewport) => {
  workspaceRef.value?.removeViewport(viewport);
};

// Actions
const splitUp = () => workspaceRef.value?.splitViewport(selectedViewport.value, 'up');
const splitDown = () => workspaceRef.value?.splitViewport(selectedViewport.value, 'down');
const splitLeft = () => workspaceRef.value?.splitViewport(selectedViewport.value, 'left');
const splitRight = () => workspaceRef.value?.splitViewport(selectedViewport.value, 'right');
const removeSelected = () => workspaceRef.value?.removeViewport(selectedViewport.value);
const addViewport = () => workspaceRef.value?.createViewport();
</script>

<style scoped>
.workspace-controller {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-group {
  display: flex;
  gap: 8px;
}

.toolbar-info {
  margin-left: auto;
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  background: #f0f8ff;
  border-color: #2196f3;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## 🗃️ State Management

### Pinia Store Integration

```typescript
// stores/workspace.ts
import { defineStore } from 'pinia';
import { WorkspaceFactory, type Workspace, type Viewport } from '@adaptive-desktop/adaptive-workspace';

interface WorkspaceState {
  workspace: Workspace | null;
  viewports: Viewport[];
  selectedViewportId: string | null;
  workspaceBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const useWorkspaceStore = defineStore('workspace', {
  state: (): WorkspaceState => ({
    workspace: null,
    viewports: [],
    selectedViewportId: null,
    workspaceBounds: {
      x: 0,
      y: 0,
      width: 1200,
      height: 800
    }
  }),

  getters: {
    selectedViewport: (state): Viewport | null =>
      state.viewports.find(v => v.id === state.selectedViewportId) || null,

    viewportCount: (state): number => state.viewports.length,

    hasSelection: (state): boolean => state.selectedViewportId !== null,

    canRemoveViewport: (state): boolean =>
      state.selectedViewportId !== null && state.viewports.length > 1,

    getViewportById: (state) => (id: string): Viewport | undefined =>
      state.viewports.find(v => v.id === id)
  },

  actions: {
    // Initialize workspace
    initializeWorkspace(bounds?: Partial<typeof this.workspaceBounds>) {
      if (bounds) {
        this.workspaceBounds = { ...this.workspaceBounds, ...bounds };
      }

      this.workspace = WorkspaceFactory.create(this.workspaceBounds);

      // Create initial viewport
      const initialViewport = this.workspace.createViewport();
      this.refreshViewports();
      this.selectedViewportId = initialViewport.id;
    },

    // Viewport operations
    createViewport(proportionalBounds?: { x: number; y: number; width: number; height: number }) {
      if (!this.workspace) return null;

      const viewport = this.workspace.createViewport(proportionalBounds);
      this.refreshViewports();
      return viewport;
    },

    splitViewport(direction: 'up' | 'down' | 'left' | 'right', viewportId?: string) {
      if (!this.workspace) return null;

      const targetViewport = viewportId
        ? this.getViewportById(viewportId)
        : this.selectedViewport;

      if (!targetViewport) return null;

      const newViewport = this.workspace.splitViewport(targetViewport, direction);
      this.refreshViewports();
      this.selectedViewportId = newViewport.id;
      return newViewport;
    },

    removeViewport(viewportId?: string) {
      if (!this.workspace || this.viewports.length <= 1) return false;

      const targetViewport = viewportId
        ? this.getViewportById(viewportId)
        : this.selectedViewport;

      if (!targetViewport) return false;

      const success = this.workspace.removeViewport(targetViewport);
      if (success) {
        this.refreshViewports();

        // Update selection if removed viewport was selected
        if (this.selectedViewportId === targetViewport.id) {
          this.selectedViewportId = this.viewports[0]?.id || null;
        }
      }
      return success;
    },

    swapViewports(viewport1Id: string, viewport2Id: string) {
      if (!this.workspace) return false;

      const viewport1 = this.getViewportById(viewport1Id);
      const viewport2 = this.getViewportById(viewport2Id);

      if (!viewport1 || !viewport2) return false;

      const success = this.workspace.swapViewports(viewport1, viewport2);
      if (success) {
        this.refreshViewports();
      }
      return success;
    },

    // Selection management
    selectViewport(viewportId: string | null) {
      this.selectedViewportId = viewportId;
    },

    // Workspace management
    updateWorkspaceBounds(bounds: Partial<typeof this.workspaceBounds>) {
      this.workspaceBounds = { ...this.workspaceBounds, ...bounds };

      if (this.workspace) {
        this.workspace.updatePosition(this.workspaceBounds);
        this.refreshViewports();
      }
    },

    // Internal helpers
    refreshViewports() {
      if (this.workspace) {
        this.viewports = this.workspace.getViewports();
      }
    },

    // Reset workspace
    resetWorkspace() {
      this.workspace = null;
      this.viewports = [];
      this.selectedViewportId = null;
    }
  }
});
```

### Using the Store in Components

```vue
<template>
  <div class="workspace-app">
    <div class="controls">
      <button @click="splitUp" :disabled="!canSplit">Split Up</button>
      <button @click="splitDown" :disabled="!canSplit">Split Down</button>
      <button @click="splitLeft" :disabled="!canSplit">Split Left</button>
      <button @click="splitRight" :disabled="!canSplit">Split Right</button>
      <button @click="removeSelected" :disabled="!canRemove">Remove</button>
    </div>

    <div class="workspace" :style="workspaceStyle">
      <div
        v-for="viewport in viewports"
        :key="viewport.id"
        class="viewport"
        :style="getViewportStyle(viewport)"
        :class="{ selected: viewport.id === selectedViewportId }"
        @click="selectViewport(viewport.id)"
      >
        <YourContentComponent :viewport="viewport" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useWorkspaceStore } from '@/stores/workspace';

const workspaceStore = useWorkspaceStore();

// Computed properties from store
const viewports = computed(() => workspaceStore.viewports);
const selectedViewportId = computed(() => workspaceStore.selectedViewportId);
const canSplit = computed(() => workspaceStore.hasSelection);
const canRemove = computed(() => workspaceStore.canRemoveViewport);
const workspaceBounds = computed(() => workspaceStore.workspaceBounds);

// Styles
const workspaceStyle = computed(() => ({
  position: 'relative',
  width: `${workspaceBounds.value.width}px`,
  height: `${workspaceBounds.value.height}px`,
  border: '2px solid #ccc'
}));

const getViewportStyle = (viewport) => ({
  position: 'absolute',
  left: `${viewport.screenBounds.x}px`,
  top: `${viewport.screenBounds.y}px`,
  width: `${viewport.screenBounds.width}px`,
  height: `${viewport.screenBounds.height}px`,
  border: '1px solid #999'
});

// Actions
const splitUp = () => workspaceStore.splitViewport('up');
const splitDown = () => workspaceStore.splitViewport('down');
const splitLeft = () => workspaceStore.splitViewport('left');
const splitRight = () => workspaceStore.splitViewport('right');
const removeSelected = () => workspaceStore.removeViewport();
const selectViewport = (id: string) => workspaceStore.selectViewport(id);

// Initialize
onMounted(() => {
  workspaceStore.initializeWorkspace();
});
</script>
```

## 🎯 Event Handling

### Custom Events and Composables

```typescript
// composables/useWorkspaceEvents.ts
import { ref, type Ref } from 'vue';
import type { Viewport } from '@adaptive-desktop/adaptive-workspace';

export interface WorkspaceEvents {
  onViewportCreated?: (viewport: Viewport) => void;
  onViewportRemoved?: (viewportId: string) => void;
  onViewportSelected?: (viewport: Viewport) => void;
  onViewportResized?: (viewport: Viewport) => void;
  onWorkspaceResized?: (bounds: { width: number; height: number }) => void;
}

export function useWorkspaceEvents(events: WorkspaceEvents = {}) {
  const eventHistory = ref<Array<{ type: string; timestamp: number; data: any }>>([]);

  const logEvent = (type: string, data: any) => {
    eventHistory.value.push({
      type,
      timestamp: Date.now(),
      data
    });

    // Keep only last 100 events
    if (eventHistory.value.length > 100) {
      eventHistory.value = eventHistory.value.slice(-100);
    }
  };

  const handleViewportCreated = (viewport: Viewport) => {
    logEvent('viewport-created', { viewportId: viewport.id });
    events.onViewportCreated?.(viewport);
  };

  const handleViewportRemoved = (viewportId: string) => {
    logEvent('viewport-removed', { viewportId });
    events.onViewportRemoved?.(viewportId);
  };

  const handleViewportSelected = (viewport: Viewport) => {
    logEvent('viewport-selected', { viewportId: viewport.id });
    events.onViewportSelected?.(viewport);
  };

  const handleViewportResized = (viewport: Viewport) => {
    logEvent('viewport-resized', {
      viewportId: viewport.id,
      bounds: viewport.screenBounds
    });
    events.onViewportResized?.(viewport);
  };

  const handleWorkspaceResized = (bounds: { width: number; height: number }) => {
    logEvent('workspace-resized', bounds);
    events.onWorkspaceResized?.(bounds);
  };

  return {
    eventHistory: eventHistory as Ref<typeof eventHistory.value>,
    handleViewportCreated,
    handleViewportRemoved,
    handleViewportSelected,
    handleViewportResized,
    handleWorkspaceResized
  };
}
```

### Keyboard Shortcuts

```typescript
// composables/useWorkspaceShortcuts.ts
import { onMounted, onUnmounted } from 'vue';

export function useWorkspaceShortcuts(actions: {
  splitUp?: () => void;
  splitDown?: () => void;
  splitLeft?: () => void;
  splitRight?: () => void;
  removeViewport?: () => void;
  createViewport?: () => void;
}) {
  const handleKeydown = (event: KeyboardEvent) => {
    // Only handle shortcuts when Ctrl/Cmd is pressed
    if (!event.ctrlKey && !event.metaKey) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        actions.splitUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        actions.splitDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        actions.splitLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        actions.splitRight?.();
        break;
      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        actions.removeViewport?.();
        break;
      case 'n':
        event.preventDefault();
        actions.createViewport?.();
        break;
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
}
```

## 🎨 Styling & CSS

### Responsive Workspace

```vue
<template>
  <div class="responsive-workspace" ref="containerRef">
    <div class="workspace" :style="workspaceStyle">
      <div
        v-for="viewport in viewports"
        :key="viewport.id"
        class="viewport"
        :style="getViewportStyle(viewport)"
      >
        <slot :viewport="viewport" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useWorkspaceStore } from '@/stores/workspace';

const workspaceStore = useWorkspaceStore();
const containerRef = ref<HTMLElement>();
const containerSize = ref({ width: 1200, height: 800 });

// Responsive sizing
const updateContainerSize = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    containerSize.value = {
      width: rect.width,
      height: rect.height - 40 // Account for padding
    };

    workspaceStore.updateWorkspaceBounds({
      width: containerSize.value.width,
      height: containerSize.value.height
    });
  }
};

// Computed styles with responsive scaling
const workspaceStyle = computed(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '400px',
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden'
}));

const getViewportStyle = (viewport) => {
  const bounds = viewport.screenBounds;
  return {
    position: 'absolute',
    left: `${bounds.x}px`,
    top: `${bounds.y}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease'
  };
};

// Resize observer
let resizeObserver: ResizeObserver;

onMounted(() => {
  updateContainerSize();

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
.responsive-workspace {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.workspace {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .responsive-workspace {
    padding: 10px;
  }
}
</style>
```

## 🔧 TypeScript Support

### Type-Safe Composable

```typescript
// composables/useAdaptiveWorkspace.ts
import { ref, computed, onMounted, type Ref } from 'vue';
import {
  WorkspaceFactory,
  type Workspace,
  type Viewport,
  type ProportionalBounds
} from '@adaptive-desktop/adaptive-workspace';

export interface UseAdaptiveWorkspaceOptions {
  initialBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  initialViewports?: number;
  autoSelect?: boolean;
}

export interface UseAdaptiveWorkspaceReturn {
  // State
  workspace: Ref<Workspace | null>;
  viewports: Ref<Viewport[]>;
  selectedViewport: Ref<Viewport | null>;

  // Computed
  viewportCount: Ref<number>;
  hasSelection: Ref<boolean>;
  canRemove: Ref<boolean>;

  // Methods
  createViewport: (bounds?: ProportionalBounds) => Viewport | null;
  splitViewport: (
    viewportOrId: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => Viewport | null;
  removeViewport: (viewport: Viewport) => boolean;
  swapViewports: (viewport1: Viewport, viewport2: Viewport) => boolean;
  selectViewport: (viewport: Viewport | null) => void;
  refreshViewports: () => void;

  // Utilities
  getViewportStyle: (viewport: Viewport, offset?: { x: number; y: number }) => Record<string, string>;
  findViewportById: (id: string) => Viewport | undefined;
}

export function useAdaptiveWorkspace(
  options: UseAdaptiveWorkspaceOptions = {}
): UseAdaptiveWorkspaceReturn {
  const {
    initialBounds = { x: 0, y: 0, width: 1200, height: 800 },
    initialViewports = 1,
    autoSelect = true
  } = options;

  // State
  const workspace = ref<Workspace | null>(null);
  const viewports = ref<Viewport[]>([]);
  const selectedViewport = ref<Viewport | null>(null);

  // Computed
  const viewportCount = computed(() => viewports.value.length);
  const hasSelection = computed(() => selectedViewport.value !== null);
  const canRemove = computed(() => hasSelection.value && viewportCount.value > 1);

  // Methods
  const createViewport = (bounds?: ProportionalBounds): Viewport | null => {
    if (!workspace.value) return null;

    const viewport = workspace.value.createViewport(bounds);
    refreshViewports();

    if (autoSelect) {
      selectedViewport.value = viewport;
    }

    return viewport;
  };

  const splitViewport = (
    viewportOrId: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right'
  ): Viewport | null => {
    if (!workspace.value) return null;

    const newViewport = workspace.value.splitViewport(viewportOrId, direction);
    refreshViewports();

    if (autoSelect) {
      selectedViewport.value = newViewport;
    }

    return newViewport;
  };

  const removeViewport = (viewport: Viewport): boolean => {
    if (!workspace.value || viewportCount.value <= 1) return false;

    const success = workspace.value.removeViewport(viewport);
    if (success) {
      refreshViewports();

      // Update selection if removed viewport was selected
      if (selectedViewport.value?.id === viewport.id) {
        selectedViewport.value = viewports.value[0] || null;
      }
    }

    return success;
  };

  const swapViewports = (viewport1: Viewport, viewport2: Viewport): boolean => {
    if (!workspace.value) return false;

    const success = workspace.value.swapViewports(viewport1, viewport2);
    if (success) {
      refreshViewports();
    }

    return success;
  };

  const selectViewport = (viewport: Viewport | null): void => {
    selectedViewport.value = viewport;
  };

  const refreshViewports = (): void => {
    if (workspace.value) {
      viewports.value = workspace.value.getViewports();
    }
  };

  // Utilities
  const getViewportStyle = (
    viewport: Viewport,
    offset: { x: number; y: number } = { x: 0, y: 0 }
  ): Record<string, string> => {
    const bounds = viewport.screenBounds;
    return {
      position: 'absolute',
      left: `${bounds.x - offset.x}px`,
      top: `${bounds.y - offset.y}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`
    };
  };

  const findViewportById = (id: string): Viewport | undefined => {
    return viewports.value.find(v => v.id === id);
  };

  // Initialize
  onMounted(() => {
    workspace.value = WorkspaceFactory.create(initialBounds);

    // Create initial viewports
    for (let i = 0; i < initialViewports; i++) {
      const viewport = workspace.value.createViewport();
      if (i === 0 && autoSelect) {
        selectedViewport.value = viewport;
      }
    }

    refreshViewports();
  });

  return {
    // State
    workspace,
    viewports,
    selectedViewport,

    // Computed
    viewportCount,
    hasSelection,
    canRemove,

    // Methods
    createViewport,
    splitViewport,
    removeViewport,
    swapViewports,
    selectViewport,
    refreshViewports,

    // Utilities
    getViewportStyle,
    findViewportById
  };
}
```

## 🏆 Best Practices

### 1. Component Organization

```
src/
├── components/
│   ├── workspace/
│   │   ├── AdaptiveWorkspace.vue      # Main workspace component
│   │   ├── WorkspaceController.vue    # Controls and toolbar
│   │   ├── ViewportContent.vue        # Individual viewport content
│   │   └── WorkspaceDebugger.vue      # Development debugging tools
│   └── ui/
│       ├── Button.vue
│       └── Toolbar.vue
├── composables/
│   ├── useAdaptiveWorkspace.ts        # Main workspace composable
│   ├── useWorkspaceEvents.ts          # Event handling
│   ├── useWorkspaceShortcuts.ts       # Keyboard shortcuts
│   └── useWorkspaceStorage.ts         # Persistence
├── stores/
│   └── workspace.ts                   # Pinia store
└── types/
    └── workspace.ts                   # Custom type definitions
```

### 2. Performance Optimization

```vue
<script setup lang="ts">
import { ref, computed, shallowRef, markRaw } from 'vue';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';

// Use shallowRef for workspace instance (it's not deeply reactive)
const workspace = shallowRef();

// Use markRaw to prevent Vue from making the workspace reactive
const initializeWorkspace = () => {
  workspace.value = markRaw(WorkspaceFactory.create(bounds));
};

// Memoize expensive computations
const viewportStyles = computed(() => {
  return viewports.value.reduce((styles, viewport) => {
    styles[viewport.id] = getViewportStyle(viewport);
    return styles;
  }, {} as Record<string, any>);
});
</script>
```

### 3. Error Handling

```typescript
// composables/useWorkspaceWithErrorHandling.ts
import { ref } from 'vue';
import { useAdaptiveWorkspace } from './useAdaptiveWorkspace';

export function useWorkspaceWithErrorHandling(options = {}) {
  const errors = ref<string[]>([]);
  const workspace = useAdaptiveWorkspace(options);

  const handleError = (error: Error, operation: string) => {
    console.error(`Workspace ${operation} failed:`, error);
    errors.value.push(`${operation}: ${error.message}`);
  };

  const clearErrors = () => {
    errors.value = [];
  };

  // Wrap methods with error handling
  const safeSplitViewport = async (...args: Parameters<typeof workspace.splitViewport>) => {
    try {
      return workspace.splitViewport(...args);
    } catch (error) {
      handleError(error as Error, 'split viewport');
      return null;
    }
  };

  const safeRemoveViewport = async (...args: Parameters<typeof workspace.removeViewport>) => {
    try {
      return workspace.removeViewport(...args);
    } catch (error) {
      handleError(error as Error, 'remove viewport');
      return false;
    }
  };

  return {
    ...workspace,
    errors,
    clearErrors,
    splitViewport: safeSplitViewport,
    removeViewport: safeRemoveViewport
  };
}
```

## 🔄 Common Patterns

### 1. Persistent Workspace State

```typescript
// composables/useWorkspaceStorage.ts
import { watch } from 'vue';
import type { Viewport } from '@adaptive-desktop/adaptive-workspace';

export function useWorkspaceStorage(
  viewports: Ref<Viewport[]>,
  selectedViewportId: Ref<string | null>
) {
  const STORAGE_KEY = 'adaptive-workspace-state';

  const saveState = () => {
    const state = {
      viewports: viewports.value.map(v => ({
        id: v.id,
        screenBounds: v.screenBounds
      })),
      selectedViewportId: selectedViewportId.value,
      timestamp: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const loadState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load workspace state:', error);
    }
    return null;
  };

  const clearState = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  // Auto-save on changes
  watch([viewports, selectedViewportId], saveState, { deep: true });

  return {
    saveState,
    loadState,
    clearState
  };
}
```

### 2. Drag and Drop Support

```vue
<template>
  <div
    class="viewport"
    :style="getViewportStyle(viewport)"
    draggable="true"
    @dragstart="onDragStart"
    @dragover.prevent
    @drop="onDrop"
  >
    <slot :viewport="viewport" />
  </div>
</template>

<script setup lang="ts">
import type { Viewport } from '@adaptive-desktop/adaptive-workspace';

interface Props {
  viewport: Viewport;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  swapRequested: [viewport1: Viewport, viewport2: Viewport];
}>();

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('viewport-id', props.viewport.id);
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();

  if (event.dataTransfer) {
    const draggedViewportId = event.dataTransfer.getData('viewport-id');
    if (draggedViewportId && draggedViewportId !== props.viewport.id) {
      // Find the dragged viewport and emit swap request
      // This would need access to all viewports to find the dragged one
      emit('swapRequested', draggedViewport, props.viewport);
    }
  }
};
</script>
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Viewports Not Updating After Operations

**Problem**: Viewports don't reflect changes after split/remove operations.

**Solution**: Ensure you're calling `refreshViewports()` after operations:

```typescript
const splitViewport = (direction: string) => {
  if (workspace.value && selectedViewport.value) {
    workspace.value.splitViewport(selectedViewport.value, direction);
    refreshViewports(); // ← Don't forget this!
  }
};
```

#### 2. CSS Positioning Issues

**Problem**: Viewports appear in wrong positions or overlap.

**Solution**: Check that you're correctly offsetting workspace coordinates:

```typescript
const getViewportStyle = (viewport: Viewport) => ({
  position: 'absolute',
  left: `${viewport.screenBounds.x - workspaceX}px`, // ← Subtract workspace offset
  top: `${viewport.screenBounds.y - workspaceY}px`,   // ← Subtract workspace offset
  width: `${viewport.screenBounds.width}px`,
  height: `${viewport.screenBounds.height}px`
});
```

#### 3. Reactivity Issues with Workspace

**Problem**: Vue doesn't detect changes to workspace state.

**Solution**: Use `shallowRef` and trigger updates manually:

```typescript
const workspace = shallowRef<Workspace>();
const viewports = ref<Viewport[]>([]);

const refreshViewports = () => {
  if (workspace.value) {
    viewports.value = [...workspace.value.getViewports()]; // ← Create new array
  }
};
```

#### 4. Memory Leaks with Event Listeners

**Problem**: Event listeners not cleaned up properly.

**Solution**: Use Vue's lifecycle hooks properly:

```typescript
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown); // ← Clean up
});
```

### Debug Tools

```vue
<!-- WorkspaceDebugger.vue -->
<template>
  <div class="debug-panel" v-if="showDebug">
    <h3>Workspace Debug Info</h3>
    <div class="debug-section">
      <h4>Viewports ({{ viewports.length }})</h4>
      <div v-for="viewport in viewports" :key="viewport.id" class="viewport-info">
        <strong>{{ viewport.id.slice(-6) }}</strong>
        <div>Bounds: {{ JSON.stringify(viewport.screenBounds) }}</div>
        <div>Selected: {{ selectedViewportId === viewport.id ? 'Yes' : 'No' }}</div>
      </div>
    </div>

    <div class="debug-section">
      <h4>Workspace Bounds</h4>
      <div>{{ JSON.stringify(workspaceBounds) }}</div>
    </div>

    <div class="debug-actions">
      <button @click="logState">Log State</button>
      <button @click="validateState">Validate State</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWorkspaceStore } from '@/stores/workspace';

interface Props {
  showDebug?: boolean;
}

withDefaults(defineProps<Props>(), {
  showDebug: false
});

const workspaceStore = useWorkspaceStore();

const viewports = computed(() => workspaceStore.viewports);
const selectedViewportId = computed(() => workspaceStore.selectedViewportId);
const workspaceBounds = computed(() => workspaceStore.workspaceBounds);

const logState = () => {
  console.log('Workspace State:', {
    viewports: viewports.value,
    selectedViewportId: selectedViewportId.value,
    workspaceBounds: workspaceBounds.value
  });
};

const validateState = () => {
  const issues = [];

  // Check for overlapping viewports
  for (let i = 0; i < viewports.value.length; i++) {
    for (let j = i + 1; j < viewports.value.length; j++) {
      const v1 = viewports.value[i].screenBounds;
      const v2 = viewports.value[j].screenBounds;

      if (v1.x < v2.x + v2.width && v1.x + v1.width > v2.x &&
          v1.y < v2.y + v2.height && v1.y + v1.height > v2.y) {
        issues.push(`Viewports ${viewports.value[i].id} and ${viewports.value[j].id} overlap`);
      }
    }
  }

  if (issues.length > 0) {
    console.warn('Validation issues:', issues);
  } else {
    console.log('✅ Workspace state is valid');
  }
};
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  font-size: 12px;
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
}

.debug-section {
  margin-bottom: 16px;
}

.viewport-info {
  margin-bottom: 8px;
  padding: 4px;
  background: #f5f5f5;
  border-radius: 2px;
}

.debug-actions {
  display: flex;
  gap: 8px;
}

.debug-actions button {
  padding: 4px 8px;
  font-size: 11px;
}
</style>
```

---

This guide provides comprehensive coverage of Vue.js integration patterns with the adaptive workspace library. For more advanced use cases or specific questions, refer to the main library documentation or create an issue in the GitHub repository.
```
