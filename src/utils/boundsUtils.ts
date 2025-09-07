/**
 * @fileoverview Utility functions for working with bounds and dimensions
 *
 * This module provides helper functions for calculating and manipulating
 * bounds, dimensions, and workspace areas in the layout system.
 */

import { Bounds, Dimensions } from '../shared/types';

/**
 * Calculate the area of a bounds rectangle
 */
export function calculateArea(bounds: Bounds): number {
  return bounds.width * bounds.height;
}

/**
 * Check if a point is within bounds
 */
export function isPointInBounds(x: number, y: number, bounds: Bounds): boolean {
  return (
    x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height
  );
}

/**
 * Check if two bounds rectangles intersect
 */
export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

/**
 * Calculate the intersection of two bounds rectangles
 */
export function getBoundsIntersection(a: Bounds, b: Bounds): Bounds | null {
  if (!boundsIntersect(a, b)) {
    return null;
  }

  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const width = Math.min(a.x + a.width, b.x + b.width) - x;
  const height = Math.min(a.y + a.height, b.y + b.height) - y;

  return { x, y, width, height };
}

/**
 * Calculate the union of two bounds rectangles
 */
export function getBoundsUnion(a: Bounds, b: Bounds): Bounds {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const width = Math.max(a.x + a.width, b.x + b.width) - x;
  const height = Math.max(a.y + a.height, b.y + b.height) - y;

  return { x, y, width, height };
}

/**
 * Scale bounds by a factor
 */
export function scaleBounds(bounds: Bounds, factor: number): Bounds {
  return {
    x: bounds.x * factor,
    y: bounds.y * factor,
    width: bounds.width * factor,
    height: bounds.height * factor,
  };
}

/**
 * Translate bounds by an offset
 */
export function translateBounds(bounds: Bounds, dx: number, dy: number): Bounds {
  return {
    x: bounds.x + dx,
    y: bounds.y + dy,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * Convert bounds to dimensions (extract width and height)
 */
export function boundsToDimensions(bounds: Bounds): Dimensions {
  return {
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * Create bounds from position and dimensions
 */
export function createBounds(x: number, y: number, dimensions: Dimensions): Bounds {
  return {
    x,
    y,
    width: dimensions.width,
    height: dimensions.height,
  };
}



/**
 * Check if dimensions meet minimum size requirements
 */
export function meetsMinimumSize(
  dimensions: Dimensions,
  minWidth: number,
  minHeight: number
): boolean {
  return dimensions.width >= minWidth && dimensions.height >= minHeight;
}

/**
 * Clamp dimensions to minimum and maximum constraints
 */
export function clampDimensions(
  dimensions: Dimensions,
  minWidth: number,
  minHeight: number,
  maxWidth?: number,
  maxHeight?: number
): Dimensions {
  let { width, height } = dimensions;

  width = Math.max(width, minWidth);
  height = Math.max(height, minHeight);

  if (maxWidth !== undefined) {
    width = Math.min(width, maxWidth);
  }
  if (maxHeight !== undefined) {
    height = Math.min(height, maxHeight);
  }

  return { width, height };
}



/**
 * Check if bounds are valid (positive dimensions)
 */
export function isValidBounds(bounds: Bounds): boolean {
  return bounds.width > 0 && bounds.height > 0;
}

/**
 * Normalize bounds to ensure positive dimensions
 */
export function normalizeBounds(bounds: Bounds): Bounds {
  return {
    x: bounds.width < 0 ? bounds.x + bounds.width : bounds.x,
    y: bounds.height < 0 ? bounds.y + bounds.height : bounds.y,
    width: Math.abs(bounds.width),
    height: Math.abs(bounds.height),
  };
}
