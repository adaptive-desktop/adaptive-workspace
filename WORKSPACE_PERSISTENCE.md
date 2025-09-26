# Workspace State Persistence

This document describes how Adaptive Workspace handles saving and loading workspace state, including layout profiles, viewport configurations, and user preferences.

## Overview

The persistence system enables users to save their workspace layouts and restore them later, either manually or automatically when switching between device contexts. The system supports both local storage and cloud synchronization.

## Core Concepts

### Workspace Snapshots

A snapshot captures the complete state of a workspace at a point in time:

```typescript
interface WorkspaceSnapshot {
  id: string;
  screenBounds: ScreenBounds;
  viewports: ViewportSnapshot[];
  metadata?: {
    createdAt: number;
    version: string;
    deviceContext?: LayoutContext;
  };
}

interface ViewportSnapshot {
  id: string;
  proportionalBounds: ProportionalBounds;
  isMinimized?: boolean;
  isMaximized?: boolean;
  content?: {
    type: string;
    data: any;
  };
}
```

### Persistence Strategies

The system supports multiple persistence strategies:

1. **Local Storage** - Browser localStorage for single-device use
2. **IndexedDB** - For larger datasets and offline support
3. **Cloud Storage** - For multi-device synchronization
4. **File Export** - For backup and sharing

## Creating Snapshots

### Manual Snapshots

```typescript
// Create snapshot of current workspace state
const workspace = WorkspaceFactory.create({...});
const snapshot = workspace.createSnapshot();

// Save to storage
await PersistenceManager.save('my-layout', snapshot);
```

### Automatic Snapshots

```typescript
// Auto-save when switching contexts
workspace.switchContext(newBounds, profile); // Automatically saves current state

// Auto-save on interval
const autoSaver = new AutoSaveManager(workspace, {
  interval: 30000, // 30 seconds
  maxSnapshots: 10 // Keep last 10 snapshots
});
```

### Snapshot Metadata

```typescript
const snapshot = workspace.createSnapshot();
snapshot.metadata = {
  createdAt: Date.now(),
  version: '1.0.0',
  deviceContext: workspace.currentContext,
  userNotes: 'Development setup for React project',
  tags: ['development', 'react', 'frontend']
};
```

## Restoring from Snapshots

### Basic Restoration

```typescript
// Load snapshot from storage
const snapshot = await PersistenceManager.load('my-layout');

// Create workspace from snapshot
const workspace = WorkspaceFactory.fromSnapshot(snapshot, idGenerator);
```

### Context-Aware Restoration

```typescript
// Restore with automatic context adaptation
const currentContext = WorkspaceFactory.detectContext(getCurrentBounds());
const workspace = WorkspaceFactory.fromSnapshotAdaptive(
  snapshot,
  currentContext.screenBounds,
  idGenerator,
  currentContext.orientation
);
```

### Partial Restoration

```typescript
// Restore only viewport layout, not content
const workspace = WorkspaceFactory.fromSnapshot(snapshot, idGenerator, {
  restoreContent: false,
  restoreState: true // Keep minimized/maximized states
});
```

## Storage Implementations

### Local Storage Implementation

```typescript
class LocalStoragePersistence implements PersistenceProvider {
  private readonly prefix = 'adaptive-workspace-';

  async save(key: string, snapshot: WorkspaceSnapshot): Promise<void> {
    const data = JSON.stringify(snapshot);
    localStorage.setItem(this.prefix + key, data);
  }

  async load(key: string): Promise<WorkspaceSnapshot | null> {
    const data = localStorage.getItem(this.prefix + key);
    return data ? JSON.parse(data) : null;
  }

  async list(): Promise<string[]> {
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
    return keys;
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(this.prefix + key);
  }
}
```

### IndexedDB Implementation

```typescript
class IndexedDBPersistence implements PersistenceProvider {
  private db: IDBDatabase;

  async save(key: string, snapshot: WorkspaceSnapshot): Promise<void> {
    const transaction = this.db.transaction(['snapshots'], 'readwrite');
    const store = transaction.objectStore('snapshots');
    
    await store.put({
      id: key,
      snapshot,
      timestamp: Date.now()
    });
  }

  async load(key: string): Promise<WorkspaceSnapshot | null> {
    const transaction = this.db.transaction(['snapshots'], 'readonly');
    const store = transaction.objectStore('snapshots');
    const result = await store.get(key);
    
    return result?.snapshot || null;
  }
}
```

### Cloud Storage Implementation

```typescript
class CloudPersistence implements PersistenceProvider {
  constructor(private apiClient: CloudApiClient) {}

  async save(key: string, snapshot: WorkspaceSnapshot): Promise<void> {
    await this.apiClient.post('/workspaces/snapshots', {
      key,
      snapshot,
      userId: this.getCurrentUserId()
    });
  }

  async load(key: string): Promise<WorkspaceSnapshot | null> {
    const response = await this.apiClient.get(`/workspaces/snapshots/${key}`);
    return response.data?.snapshot || null;
  }

  async sync(): Promise<void> {
    // Implement bidirectional sync logic
    const localSnapshots = await this.getLocalSnapshots();
    const remoteSnapshots = await this.getRemoteSnapshots();
    
    // Merge and resolve conflicts
    await this.mergeSnapshots(localSnapshots, remoteSnapshots);
  }
}
```

## Profile Persistence

### Saving Profiles

```typescript
// Save complete profile with all context layouts
const profile: WorkspaceProfile = {
  name: 'Development Setup',
  layouts: new Map([
    ['laptop-landscape', laptopSnapshot],
    ['ultrawide-landscape', ultrawideSnapshot],
    ['tablet-portrait', tabletSnapshot]
  ]),
  fallbacks: {
    defaultPortrait: portraitSnapshot,
    defaultLandscape: landscapeSnapshot
  }
};

await ProfileManager.save('dev-setup', profile);
```

### Loading Profiles

```typescript
// Load profile and apply to workspace
const profile = await ProfileManager.load('dev-setup');
const workspace = WorkspaceFactory.fromProfile(
  profile,
  currentContext,
  idGenerator
);
```

### Profile Templates

```typescript
// Create and save reusable templates
const templates = {
  developer: {
    name: 'Developer Template',
    layouts: new Map([
      ['laptop-landscape', createDeveloperLaptopLayout()],
      ['ultrawide-landscape', createDeveloperUltrawideLayout()]
    ]),
    fallbacks: createDeveloperFallbacks()
  },
  
  designer: {
    name: 'Designer Template',
    layouts: new Map([
      ['laptop-landscape', createDesignerLaptopLayout()],
      ['tablet-portrait', createDesignerTabletLayout()]
    ]),
    fallbacks: createDesignerFallbacks()
  }
};

// Save templates
for (const [key, template] of Object.entries(templates)) {
  await ProfileManager.saveTemplate(key, template);
}
```

## Data Migration and Versioning

### Version Handling

```typescript
interface SnapshotMigrator {
  migrate(snapshot: any, fromVersion: string, toVersion: string): WorkspaceSnapshot;
}

class SnapshotVersionManager {
  private migrators = new Map<string, SnapshotMigrator>();

  async loadWithMigration(key: string): Promise<WorkspaceSnapshot | null> {
    const rawData = await this.persistence.load(key);
    if (!rawData) return null;

    const currentVersion = this.getCurrentVersion();
    if (rawData.metadata?.version !== currentVersion) {
      return this.migrate(rawData, rawData.metadata?.version, currentVersion);
    }

    return rawData;
  }
}
```

### Migration Examples

```typescript
// Migrate from v0.5 to v0.6 (panel -> viewport terminology)
class V05ToV06Migrator implements SnapshotMigrator {
  migrate(snapshot: any): WorkspaceSnapshot {
    return {
      ...snapshot,
      viewports: snapshot.panels?.map(panel => ({
        id: panel.id,
        proportionalBounds: panel.bounds,
        // Map old properties to new structure
      })) || [],
      metadata: {
        ...snapshot.metadata,
        version: '0.6.0'
      }
    };
  }
}
```

## Browser Integration

### Auto-Save on Page Unload

```typescript
class BrowserPersistenceManager {
  constructor(private workspace: Workspace) {
    this.setupAutoSave();
  }

  private setupAutoSave(): void {
    // Save before page unload
    window.addEventListener('beforeunload', () => {
      const snapshot = this.workspace.createSnapshot();
      this.saveToSessionStorage('auto-save', snapshot);
    });

    // Restore on page load
    window.addEventListener('load', () => {
      this.restoreFromSessionStorage('auto-save');
    });
  }

  private saveToSessionStorage(key: string, snapshot: WorkspaceSnapshot): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(snapshot));
    } catch (error) {
      console.warn('Failed to save to session storage:', error);
    }
  }
}
```

### Storage Quota Management

```typescript
class StorageQuotaManager {
  async checkQuota(): Promise<StorageQuota> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
        percentage: (estimate.usage || 0) / (estimate.quota || 1) * 100
      };
    }
    return { used: 0, available: 0, percentage: 0 };
  }

  async cleanup(): Promise<void> {
    const quota = await this.checkQuota();
    if (quota.percentage > 80) {
      // Remove oldest snapshots
      await this.removeOldestSnapshots(10);
    }
  }
}
```

## Framework Integration

### Vue.js Persistence

```vue
<script setup>
import { useWorkspacePersistence } from '@/composables/useWorkspacePersistence';

const { 
  workspace, 
  saveSnapshot, 
  loadSnapshot, 
  autoSave 
} = useWorkspacePersistence();

// Auto-save every 30 seconds
autoSave.start(30000);

// Manual save/load
const handleSave = () => saveSnapshot('my-layout');
const handleLoad = () => loadSnapshot('my-layout');
</script>
```

### React Persistence Hook

```tsx
function useWorkspacePersistence(workspace: Workspace) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSnapshot = useCallback(async (key: string) => {
    try {
      setIsLoading(true);
      const snapshot = workspace.createSnapshot();
      await PersistenceManager.save(key, snapshot);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [workspace]);

  const loadSnapshot = useCallback(async (key: string) => {
    try {
      setIsLoading(true);
      const snapshot = await PersistenceManager.load(key);
      if (snapshot) {
        workspace.restoreFromSnapshot(snapshot);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [workspace]);

  return { saveSnapshot, loadSnapshot, isLoading, error };
}
```

## Security and Privacy

### Data Encryption

```typescript
class EncryptedPersistence implements PersistenceProvider {
  constructor(
    private baseProvider: PersistenceProvider,
    private encryptionKey: string
  ) {}

  async save(key: string, snapshot: WorkspaceSnapshot): Promise<void> {
    const encrypted = await this.encrypt(JSON.stringify(snapshot));
    await this.baseProvider.save(key, { encrypted } as any);
  }

  async load(key: string): Promise<WorkspaceSnapshot | null> {
    const data = await this.baseProvider.load(key);
    if (!data?.encrypted) return null;
    
    const decrypted = await this.decrypt(data.encrypted);
    return JSON.parse(decrypted);
  }
}
```

### User Consent

```typescript
class ConsentAwarePersistence {
  private hasConsent = false;

  async requestConsent(): Promise<boolean> {
    // Show consent dialog
    this.hasConsent = await this.showConsentDialog();
    return this.hasConsent;
  }

  async save(key: string, snapshot: WorkspaceSnapshot): Promise<void> {
    if (!this.hasConsent) {
      throw new Error('User consent required for data persistence');
    }
    // Proceed with save
  }
}
```

## Performance Optimization

### Lazy Loading

```typescript
class LazyPersistenceManager {
  private cache = new Map<string, WorkspaceSnapshot>();

  async load(key: string): Promise<WorkspaceSnapshot | null> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Load from storage
    const snapshot = await this.persistence.load(key);
    if (snapshot) {
      this.cache.set(key, snapshot);
    }

    return snapshot;
  }
}
```

### Compression

```typescript
class CompressedPersistence implements PersistenceProvider {
  async save(key: string, snapshot: WorkspaceSnapshot): Promise<void> {
    const json = JSON.stringify(snapshot);
    const compressed = await this.compress(json);
    await this.baseProvider.save(key, { compressed } as any);
  }

  private async compress(data: string): Promise<string> {
    // Use compression library (e.g., pako, lz-string)
    return LZString.compress(data);
  }
}
```

## Best Practices

### Storage Strategy

1. **Local First** - Always save locally, sync to cloud as enhancement
2. **Incremental Saves** - Only save changed data to reduce storage usage
3. **Cleanup Policy** - Regularly remove old or unused snapshots
4. **Error Recovery** - Gracefully handle storage failures

### Data Structure

1. **Minimal Snapshots** - Only store essential state information
2. **Normalized Data** - Avoid duplication in stored data
3. **Version Compatibility** - Design for forward/backward compatibility
4. **Validation** - Validate data integrity on load

### User Experience

1. **Visual Feedback** - Show save/load progress to users
2. **Conflict Resolution** - Handle sync conflicts gracefully
3. **Offline Support** - Work without network connectivity
4. **Export/Import** - Allow users to backup and share layouts

## Related Documentation

- [Layout Profiles](LAYOUT_PROFILES.md) - Device context and profile management
- [Viewport Management](src/layout/__tests__/viewport/README.md) - Core viewport operations
- [Vue Integration Guide](VUE_INTEGRATION_GUIDE.md) - Framework-specific integration