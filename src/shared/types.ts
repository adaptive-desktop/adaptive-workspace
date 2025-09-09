/**
 * @fileoverview Core type definitions for the viewport-based layout system
 *
 * This module defines the fundamental data structures used throughout the
 * viewport-based layout system. All types are generic and framework-agnostic.
 */

import { ulid } from 'ulid';

/**
 * Common dimensional interface used across all components
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Complete bounds information including position and size
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Interface for generating unique identifiers
 *
 * Allows for framework-specific ID generation strategies while maintaining
 * a consistent interface across the workspace library.
 */
export interface IdGenerator {
  /**
   * Generate a unique identifier
   * @returns A unique string identifier
   */
  generate(): string;
}

/**
 * Default ULID-based ID generator
 *
 * Uses the ULID library for generating unique identifiers.
 * This maintains backward compatibility with existing behavior.
 */
export class DefaultUlidGenerator implements IdGenerator {
  /**
   * Generate a ULID identifier
   * @returns A ULID string
   */
  generate(): string {
    return ulid();
  }
}
