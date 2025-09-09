/**
 * @fileoverview Tests for LayoutManager createViewport functionality
 *
 * Tests the createViewport() method with no parameters, ensuring:
 * 1. Returned viewport has correct values
 * 2. getViewports() returns the newly created viewport
 * 3. Other viewports have correct ProportionalBounds adjustments
 */

import { LayoutManager } from '../../LayoutManager';
import { MutableViewport } from '../../../viewport/MutableViewport';
import { ProportionalBounds } from '../../../viewport/types';
import { ScreenBounds } from '../../../workspace/types';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';

describe('LayoutManager - createViewport()', () => {
  let layoutManager: LayoutManager;
  const testWorkspaceBounds: ScreenBounds = {
    x: 0,
    y: 0,
    width: 1000,
    height: 800,
  };

  beforeEach(() => {
    layoutManager = new LayoutManager(new TestIdGenerator('viewport'));
    layoutManager.setScreenBounds(testWorkspaceBounds);
  });

  describe('createViewport() with no parameters', () => {
    describe('first viewport creation', () => {
      it('should create viewport with full workspace bounds', () => {
        const viewport = layoutManager.createViewport();

        // Check returned viewport has correct values
        expect(viewport.id).toBeDefined();
        expect(typeof viewport.id).toBe('string');
        expect(viewport.id.length).toBeGreaterThan(0);

        // Check screen bounds match full workspace
        expect(viewport.screenBounds).toEqual({
          x: 0,
          y: 0,
          width: 1000,
          height: 800,
        });
      });

      it('should add viewport to getViewports() result', () => {
        const viewport = layoutManager.createViewport();
        const allViewports = layoutManager.getViewports();

        expect(allViewports).toHaveLength(1);
        expect(allViewports[0]).toBe(viewport);
        expect(allViewports[0].id).toBe(viewport.id);
      });

      it('should have correct proportional bounds (full workspace)', () => {
        const viewport = layoutManager.createViewport();

        // Access proportional bounds through MutableViewport
        const mutableViewport = viewport as MutableViewport;
        expect(mutableViewport.proportionalBounds).toEqual({
          x: 0,
          y: 0,
          width: 1.0,
          height: 1.0,
        });
      });

      it('should update viewport count correctly', () => {
        expect(layoutManager.getViewportCount()).toBe(0);

        layoutManager.createViewport();

        expect(layoutManager.getViewportCount()).toBe(1);
      });
    });

    describe('createViewport() with proportional bounds', () => {
      it('should create viewport with specified proportional bounds', () => {
        const customBounds: ProportionalBounds = {
          x: 0.25,
          y: 0.1,
          width: 0.5,
          height: 0.6,
        };

        const viewport = layoutManager.createViewport(customBounds);

        // Check returned viewport has correct values
        expect(viewport.id).toBeDefined();
        expect(typeof viewport.id).toBe('string');
        expect(viewport.id.length).toBeGreaterThan(0);

        // Check screen bounds calculated from proportional bounds
        expect(viewport.screenBounds).toEqual({
          x: 0 + 1000 * 0.25, // 0 + 250 = 250
          y: 0 + 800 * 0.1, // 0 + 80 = 80
          width: 1000 * 0.5, // 500
          height: 800 * 0.6, // 480
        });
      });

      it('should add viewport to getViewports() result', () => {
        const customBounds: ProportionalBounds = {
          x: 0.2,
          y: 0.3,
          width: 0.4,
          height: 0.5,
        };

        const viewport = layoutManager.createViewport(customBounds);
        const allViewports = layoutManager.getViewports();

        expect(allViewports).toHaveLength(1);
        expect(allViewports[0]).toBe(viewport);
        expect(allViewports[0].id).toBe(viewport.id);
      });

      it('should have correct proportional bounds', () => {
        const customBounds: ProportionalBounds = {
          x: 0.1,
          y: 0.2,
          width: 0.3,
          height: 0.4,
        };

        const viewport = layoutManager.createViewport(customBounds);

        // Access proportional bounds through MutableViewport
        const mutableViewport = viewport as MutableViewport;
        expect(mutableViewport.proportionalBounds).toEqual(customBounds);
      });

      it('should update viewport count correctly', () => {
        expect(layoutManager.getViewportCount()).toBe(0);

        const customBounds: ProportionalBounds = {
          x: 0.0,
          y: 0.0,
          width: 0.5,
          height: 0.5,
        };

        layoutManager.createViewport(customBounds);

        expect(layoutManager.getViewportCount()).toBe(1);
      });
    });
  });
});
