/**
 * @fileoverview Validation utilities for bounds and dimensions
 *
 * This module provides validation functions for bounds checking
 * and ensuring layout integrity.
 */

import { Bounds, Dimensions } from '../shared/types';

/**
 * Validate bounds object
 */
export function validateBounds(bounds: Bounds): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof bounds.x !== 'number') {
    errors.push('x must be a number');
  }

  if (typeof bounds.y !== 'number') {
    errors.push('y must be a number');
  }

  if (typeof bounds.width !== 'number' || bounds.width < 0) {
    errors.push('width must be a non-negative number');
  }

  if (typeof bounds.height !== 'number' || bounds.height < 0) {
    errors.push('height must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate dimensions object
 */
export function validateDimensions(dimensions: Dimensions): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof dimensions.width !== 'number' || dimensions.width < 0) {
    errors.push('width must be a non-negative number');
  }

  if (typeof dimensions.height !== 'number' || dimensions.height < 0) {
    errors.push('height must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate split percentage
 */
export function validateSplitPercentage(percentage: number): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof percentage !== 'number') {
    errors.push('Split percentage must be a number');
  } else if (percentage < 0 || percentage > 100) {
    errors.push('Split percentage must be between 0 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
