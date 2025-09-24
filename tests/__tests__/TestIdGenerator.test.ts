/**
 * @fileoverview Tests for TestIdGenerator
 *
 * Tests the test ID generator utility for unit tests.
 */

import { TestIdGenerator } from '../../src/shared/TestIdGenerator';

describe('TestIdGenerator', () => {
  test('generates predictable IDs with default prefix', () => {
    const generator = new TestIdGenerator();

    expect(generator.generate()).toBe('test-id-1');
    expect(generator.generate()).toBe('test-id-2');
    expect(generator.generate()).toBe('test-id-3');
  });

  test('generates predictable IDs with custom prefix', () => {
    const generator = new TestIdGenerator('custom');

    expect(generator.generate()).toBe('custom-1');
    expect(generator.generate()).toBe('custom-2');
  });

  test('reset() resets the counter', () => {
    const generator = new TestIdGenerator('test');

    generator.generate(); // test-1
    generator.generate(); // test-2

    generator.reset();

    expect(generator.generate()).toBe('test-1');
  });

  test('different instances have independent counters', () => {
    const generator1 = new TestIdGenerator('gen1');
    const generator2 = new TestIdGenerator('gen2');

    expect(generator1.generate()).toBe('gen1-1');
    expect(generator2.generate()).toBe('gen2-1');
    expect(generator1.generate()).toBe('gen1-2');
    expect(generator2.generate()).toBe('gen2-2');
  });
});
