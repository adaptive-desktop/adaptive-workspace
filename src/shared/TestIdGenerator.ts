/**
 * @fileoverview Test ID generator for unit tests
 *
 * Provides predictable ID generation for testing purposes.
 */

import { IdGenerator } from './types';

/**
 * Test ID generator that produces predictable IDs
 *
 * Useful for unit tests where you need deterministic ID generation.
 */
export class TestIdGenerator implements IdGenerator {
  private counter = 0;
  private prefix: string;

  constructor(prefix = 'test-id') {
    this.prefix = prefix;
  }

  /**
   * Generate a predictable test ID
   * @returns A predictable test ID in format "prefix-counter"
   */
  generate(): string {
    return `${this.prefix}-${++this.counter}`;
  }

  /**
   * Reset the counter for fresh test runs
   */
  reset(): void {
    this.counter = 0;
  }
}
