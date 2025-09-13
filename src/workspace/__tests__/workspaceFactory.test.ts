/**
 * @fileoverview Tests for WorkspaceFactory
 *
 * Tests the WorkspaceFactory class and workspace creation methods.
 */

import { WorkspaceFactory } from '../WorkspaceFactory';
import { Workspace } from '../Workspace';
import { TestIdGenerator } from '../../shared/TestIdGenerator';

describe('WorkspaceFactory', () => {
  test('create() produces a workspace with correct id, bounds, and initial snapshot', () => {
    const idGen = new TestIdGenerator('ws');
    const factory = new WorkspaceFactory(idGen);
    const config = { x: 100, y: 200, width: 800, height: 600 };
    const workspace = factory.create(config);
    expect(workspace.id).toBe('ws-1');
    expect(workspace.screenBounds).toEqual(config);
    expect(workspace.layout.getViewportCount()).toBe(0);
    // Optionally: check that a snapshot can be created (if API exists)
    // expect(workspace.createSnapshot()).toBeDefined();
  });

  test('create() returns Workspace instance', () => {
    const factory = new WorkspaceFactory(new TestIdGenerator('ws'));
    const workspace = factory.create({ x: 0, y: 0, width: 800, height: 600 });
    expect(workspace).toBeInstanceOf(Workspace);
  });

  test('create() generates unique IDs per factory', () => {
    const factory = new WorkspaceFactory(new TestIdGenerator('uniq'));
    const ws1 = factory.create({ x: 0, y: 0, width: 800, height: 600 });
    const ws2 = factory.create({ x: 0, y: 0, width: 800, height: 600 });
    expect(ws1.id).not.toBe(ws2.id);
    expect(ws1.id).toBe('uniq-1');
    expect(ws2.id).toBe('uniq-2');
  });

  test('createWithViewport() returns Workspace instance (no viewport yet)', () => {
    const factory = new WorkspaceFactory(new TestIdGenerator('vw'));
    const workspace = factory.createWithViewport({ x: 0, y: 0, width: 800, height: 600 });
    expect(workspace).toBeInstanceOf(Workspace);
    expect(workspace.layout.getViewportCount()).toBe(0); // Will be 1 when implemented
  });

  test('IdGenerator is used for workspace and viewport IDs', () => {
    const factory = new WorkspaceFactory(new TestIdGenerator('vw'));
    const workspace = factory.create({ x: 0, y: 0, width: 800, height: 600 });
    expect(workspace.id).toBe('vw-1');
    const viewport = workspace.createViewport();
    expect(viewport.id).toBe('vw-2');
  });
});
