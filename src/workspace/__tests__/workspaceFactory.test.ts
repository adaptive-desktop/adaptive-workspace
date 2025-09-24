import { WorkspaceFactory } from '../WorkspaceFactory';
import { WorkspaceContextFactory } from '../context/WorkspaceContextFactory';
import { WorkspaceContextCollection } from '../context/WorkspaceContextCollection';
import { Workspace } from '../Workspace';
import { WorkspaceSnapshot, ScreenBounds } from '../types';
import { TestIdGenerator } from '../../../tests/TestIdGenerator';

// Mock dependencies
jest.mock('../context/WorkspaceContextFactory');
jest.mock('../context/WorkspaceContextCollection');
jest.mock('../Workspace');

describe('WorkspaceFactory', () => {
  describe('fromSnapshot', () => {
    let factory: WorkspaceFactory;
    let idGenerator: TestIdGenerator;
    let mockSnapshot: WorkspaceSnapshot;
    let mockScreenBounds: ScreenBounds;

    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();

      // Setup test data
      idGenerator = new TestIdGenerator('test');
      factory = new WorkspaceFactory(idGenerator);

      mockScreenBounds = { x: 0, y: 0, width: 1440, height: 900 };
      mockSnapshot = {
        id: 'workspace-1',
        name: 'Test Workspace',
        workspaceContexts: [
          {
            id: 'context-1',
            name: 'Desktop Context',
            maxScreenBounds: { x: 0, y: 0, width: 1920, height: 1080 },
            viewportSnapshots: [
              {
                id: 'viewport-1',
                workspaceContextId: 'context-1',
                bounds: { x: 0, y: 0, width: 0.5, height: 1 },
                isDefault: true,
                isMaximized: false,
                isMinimized: false,
                isRequired: true,
                timestamp: Date.now(),
              },
              {
                id: 'viewport-2',
                workspaceContextId: 'context-1',
                bounds: { x: 0.5, y: 0, width: 0.5, height: 1 },
                isDefault: false,
                isMaximized: false,
                isMinimized: false,
                isRequired: false,
                timestamp: Date.now(),
              },
            ],
            orientation: 'landscape',
            aspectRatio: 16 / 9,
            sizeCategory: 'lg',
            deviceType: 'desktop',
            minimumViewportScreenHeight: 200,
            minimumViewportScreenWidth: 300,
          },
          {
            id: 'context-2',
            name: 'Mobile Context',
            maxScreenBounds: { x: 0, y: 0, width: 390, height: 844 },
            viewportSnapshots: [],
            orientation: 'portrait',
            aspectRatio: 9 / 19.5,
            sizeCategory: 'sm',
            deviceType: 'phone',
            minimumViewportScreenHeight: 100,
            minimumViewportScreenWidth: 150,
          },
        ],
      };

      // Mock WorkspaceContextFactory
      (WorkspaceContextFactory as jest.Mock).mockImplementation(() => ({
        fromSnapshot: jest.fn((contextSnapshot) => ({
          id: contextSnapshot.id,
          name: contextSnapshot.name,
          // Return a mock context object with the same ID as the snapshot
        })),
      }));

      // Mock WorkspaceContextCollection
      (WorkspaceContextCollection as jest.Mock).mockImplementation(() => ({
        // Mock methods as needed
      }));

      // Mock Workspace
      (Workspace as jest.Mock).mockImplementation(() => ({
        setScreenBounds: jest.fn(),
        // Other workspace methods
      }));
    });

    it('should create a workspace from a snapshot with the correct properties', () => {
      // Unmock actual implementations for this test
      jest.unmock('../context/WorkspaceContextFactory');
      jest.unmock('../context/WorkspaceContextCollection');
      jest.unmock('../Workspace');

      // Create real instances instead of mocks
      const realFactory = new WorkspaceFactory(idGenerator);

      // Spy on Workspace constructor
      const workspaceSpy = jest.spyOn(Workspace.prototype, 'setScreenBounds');

      // Execute the method
      const result = realFactory.fromSnapshot(mockSnapshot, mockScreenBounds);

      // Verify the result
      expect(result).toBeDefined();
      expect(result.id).toBe(mockSnapshot.id);
      expect(result.name).toBe(mockSnapshot.name);
      expect(workspaceSpy).toHaveBeenCalledWith(mockScreenBounds);

      // Restore the spy
      workspaceSpy.mockRestore();
    });

    it('should convert all context snapshots using WorkspaceContextFactory', () => {
      // Execute the method
      factory.fromSnapshot(mockSnapshot, mockScreenBounds);

      // Verify WorkspaceContextFactory was used correctly
      const contextFactoryInstance = (WorkspaceContextFactory as jest.Mock).mock.instances[0];
      const fromSnapshotMethod = contextFactoryInstance.fromSnapshot;

      // Should be called once for each context in the snapshot
      expect(fromSnapshotMethod).toHaveBeenCalledTimes(mockSnapshot.workspaceContexts.length);
      expect(fromSnapshotMethod).toHaveBeenNthCalledWith(1, mockSnapshot.workspaceContexts[0]);
      expect(fromSnapshotMethod).toHaveBeenNthCalledWith(2, mockSnapshot.workspaceContexts[1]);
    });

    it('should create a WorkspaceContextCollection with the converted contexts', () => {
      // Setup mock context objects that will be returned by the factory
      mockSnapshot.workspaceContexts.map((ctx) => ({ id: ctx.id }));
      const contextFactoryMock = {
        fromSnapshot: jest.fn((ctx) => ({ id: ctx.id })),
      };
      (WorkspaceContextFactory as jest.Mock).mockImplementation(() => contextFactoryMock);

      // Execute the method
      factory.fromSnapshot(mockSnapshot, mockScreenBounds);

      // Verify WorkspaceContextCollection was created with the contexts
      expect(WorkspaceContextCollection).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'context-1' }),
          expect.objectContaining({ id: 'context-2' }),
        ])
      );
    });

    it('should set the screen bounds on the created workspace', () => {
      // Mock workspace instance
      const setScreenBoundsMock = jest.fn();
      (Workspace as jest.Mock).mockImplementation(() => ({
        setScreenBounds: setScreenBoundsMock,
      }));

      // Execute the method
      factory.fromSnapshot(mockSnapshot, mockScreenBounds);

      // Verify setScreenBounds was called with the correct bounds
      expect(setScreenBoundsMock).toHaveBeenCalledWith(mockScreenBounds);
    });

    it('should handle empty workspaceContexts array', () => {
      // Create a snapshot with no contexts
      const emptySnapshot = {
        ...mockSnapshot,
        workspaceContexts: [],
      };

      // Execute the method
      const result = factory.fromSnapshot(emptySnapshot, mockScreenBounds);

      // Verify a workspace was still created
      expect(result).toBeDefined();
      expect(WorkspaceContextCollection).toHaveBeenCalledWith([]);
    });
  });
});
