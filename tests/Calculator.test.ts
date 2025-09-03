/**
 * @fileoverview Tests for Calculator class
 */

import { Calculator } from '../src/lib/Calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      const result = calculator.add(2, 3);
      expect(result).toBe(5);
    });

    it('should add negative numbers', () => {
      const result = calculator.add(-2, -3);
      expect(result).toBe(-5);
    });

    it('should add positive and negative numbers', () => {
      const result = calculator.add(5, -3);
      expect(result).toBe(2);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      const result = calculator.subtract(5, 3);
      expect(result).toBe(2);
    });

    it('should subtract negative numbers', () => {
      const result = calculator.subtract(-2, -3);
      expect(result).toBe(1);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      const result = calculator.multiply(3, 4);
      expect(result).toBe(12);
    });

    it('should multiply by zero', () => {
      const result = calculator.multiply(5, 0);
      expect(result).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      const result = calculator.divide(10, 2);
      expect(result).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero is not allowed');
    });
  });

  describe('history', () => {
    it('should track calculation history', () => {
      calculator.add(2, 3);
      calculator.multiply(4, 5);
      calculator.subtract(10, 3);

      const history = calculator.getHistory();
      expect(history).toEqual([5, 20, 7]);
    });

    it('should clear history', () => {
      calculator.add(2, 3);
      calculator.clearHistory();

      const history = calculator.getHistory();
      expect(history).toEqual([]);
    });
  });
});
