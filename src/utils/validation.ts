/**
 * @fileoverview Validation utilities for constraints and bounds
 *
 * This module provides validation functions for layout constraints,
 * bounds checking, and ensuring layout integrity.
 */

import {
  ChildConstraints,
  RegionConstraints,
  Bounds,
  Dimensions,
  LayoutDirection,
  LayoutPath,
  PanelId,
} from '../types';

/**
 * Validate child constraints object
 */
export function validateChildConstraints(constraints: ChildConstraints): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (constraints.minSize !== undefined) {
    if (typeof constraints.minSize !== 'number' || constraints.minSize < 0) {
      errors.push('minSize must be a non-negative number');
    }
  }

  if (constraints.maxSize !== undefined) {
    if (typeof constraints.maxSize !== 'number' || constraints.maxSize < 0) {
      errors.push('maxSize must be a non-negative number');
    }

    if (constraints.minSize !== undefined && constraints.maxSize < constraints.minSize) {
      errors.push('maxSize must be greater than or equal to minSize');
    }
  }

  if (constraints.priority !== undefined) {
    if (typeof constraints.priority !== 'number') {
      errors.push('priority must be a number');
    }
  }

  if (constraints.locked !== undefined) {
    if (typeof constraints.locked !== 'boolean') {
      errors.push('locked must be a boolean');
    }
  }

  if (constraints.collapsible !== undefined) {
    if (typeof constraints.collapsible !== 'boolean') {
      errors.push('collapsible must be a boolean');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate region constraints object
 */
export function validateRegionConstraints(constraints: RegionConstraints): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (constraints.leading) {
    const leadingValidation = validateChildConstraints(constraints.leading);
    if (!leadingValidation.valid) {
      errors.push(...leadingValidation.errors.map((err) => `leading: ${err}`));
    }
  }

  if (constraints.trailing) {
    const trailingValidation = validateChildConstraints(constraints.trailing);
    if (!trailingValidation.valid) {
      errors.push(...trailingValidation.errors.map((err) => `trailing: ${err}`));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate bounds object
 */
export function validateBounds(bounds: Bounds): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof bounds.x !== 'number' || !isFinite(bounds.x)) {
    errors.push('x must be a finite number');
  }

  if (typeof bounds.y !== 'number' || !isFinite(bounds.y)) {
    errors.push('y must be a finite number');
  }

  if (typeof bounds.width !== 'number' || !isFinite(bounds.width) || bounds.width <= 0) {
    errors.push('width must be a positive finite number');
  }

  if (typeof bounds.height !== 'number' || !isFinite(bounds.height) || bounds.height <= 0) {
    errors.push('height must be a positive finite number');
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

  if (
    typeof dimensions.width !== 'number' ||
    !isFinite(dimensions.width) ||
    dimensions.width <= 0
  ) {
    errors.push('width must be a positive finite number');
  }

  if (
    typeof dimensions.height !== 'number' ||
    !isFinite(dimensions.height) ||
    dimensions.height <= 0
  ) {
    errors.push('height must be a positive finite number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate layout direction
 */
export function validateLayoutDirection(direction: unknown): direction is LayoutDirection {
  return direction === 'row' || direction === 'column';
}

/**
 * Validate layout path
 */
export function validateLayoutPath(path: unknown): path is LayoutPath {
  if (!Array.isArray(path)) {
    return false;
  }

  return path.every((branch) => branch === 'leading' || branch === 'trailing');
}

/**
 * Validate panel ID
 */
export function validatePanelId(id: unknown): id is PanelId {
  return typeof id === 'string' || typeof id === 'number';
}

/**
 * Check if a resize operation would violate constraints
 */
export function validateResize(
  constraints: RegionConstraints | undefined,
  currentSize: number,
  newPercentage: number,
  totalSize: number
): {
  valid: boolean;
  reason?: string;
} {
  if (!constraints) {
    return { valid: true };
  }

  const leadingSize = (newPercentage / 100) * totalSize;
  const trailingSize = totalSize - leadingSize;

  // Check leading constraints
  if (constraints.leading) {
    if (constraints.leading.locked) {
      return { valid: false, reason: 'Leading region is locked' };
    }

    if (constraints.leading.minSize && leadingSize < constraints.leading.minSize) {
      return { valid: false, reason: 'Leading region would be smaller than minimum size' };
    }

    if (constraints.leading.maxSize && leadingSize > constraints.leading.maxSize) {
      return { valid: false, reason: 'Leading region would be larger than maximum size' };
    }
  }

  // Check trailing constraints
  if (constraints.trailing) {
    if (constraints.trailing.locked) {
      return { valid: false, reason: 'Trailing region is locked' };
    }

    if (constraints.trailing.minSize && trailingSize < constraints.trailing.minSize) {
      return { valid: false, reason: 'Trailing region would be smaller than minimum size' };
    }

    if (constraints.trailing.maxSize && trailingSize > constraints.trailing.maxSize) {
      return { valid: false, reason: 'Trailing region would be larger than maximum size' };
    }
  }

  return { valid: true };
}

/**
 * Check if dimensions meet constraint requirements
 */
export function validateDimensionsAgainstConstraints(
  dimensions: Dimensions,
  constraints: ChildConstraints
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (constraints.minSize) {
    const minDimension = Math.min(dimensions.width, dimensions.height);
    if (minDimension < constraints.minSize) {
      errors.push(`Minimum dimension ${minDimension} is less than required ${constraints.minSize}`);
    }
  }

  if (constraints.maxSize) {
    const maxDimension = Math.max(dimensions.width, dimensions.height);
    if (maxDimension > constraints.maxSize) {
      errors.push(`Maximum dimension ${maxDimension} exceeds limit ${constraints.maxSize}`);
    }
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
  reason?: string;
} {
  if (typeof percentage !== 'number' || !isFinite(percentage)) {
    return { valid: false, reason: 'Split percentage must be a finite number' };
  }

  if (percentage < 0 || percentage > 100) {
    return { valid: false, reason: 'Split percentage must be between 0 and 100' };
  }

  return { valid: true };
}

/**
 * Check if a layout configuration is valid
 */
export function validateLayoutConfiguration(config: {
  bounds: Bounds;
  constraints?: RegionConstraints;
  splitPercentage?: number;
  direction: LayoutDirection;
}): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate bounds
  const boundsValidation = validateBounds(config.bounds);
  if (!boundsValidation.valid) {
    errors.push(...boundsValidation.errors);
  }

  // Validate direction
  if (!validateLayoutDirection(config.direction)) {
    errors.push('Invalid layout direction');
  }

  // Validate split percentage
  if (config.splitPercentage !== undefined) {
    const splitValidation = validateSplitPercentage(config.splitPercentage);
    if (!splitValidation.valid) {
      errors.push(splitValidation.reason!);
    }
  }

  // Validate constraints
  if (config.constraints) {
    const constraintsValidation = validateRegionConstraints(config.constraints);
    if (!constraintsValidation.valid) {
      errors.push(...constraintsValidation.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
