/**
 * @fileoverview Example Calculator class
 *
 * This is an example class to demonstrate TypeScript library structure.
 * Replace this with your actual library code.
 */

export class Calculator {
  private history: number[] = [];

  /**
   * Add two numbers
   * @param a First number
   * @param b Second number
   * @returns Sum of a and b
   */
  add(a: number, b: number): number {
    const result = a + b;
    this.history.push(result);
    return result;
  }

  /**
   * Subtract two numbers
   * @param a First number
   * @param b Second number
   * @returns Difference of a and b
   */
  subtract(a: number, b: number): number {
    const result = a - b;
    this.history.push(result);
    return result;
  }

  /**
   * Multiply two numbers
   * @param a First number
   * @param b Second number
   * @returns Product of a and b
   */
  multiply(a: number, b: number): number {
    const result = a * b;
    this.history.push(result);
    return result;
  }

  /**
   * Divide two numbers
   * @param a First number
   * @param b Second number
   * @returns Quotient of a and b
   * @throws Error if b is zero
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    const result = a / b;
    this.history.push(result);
    return result;
  }

  /**
   * Get calculation history
   * @returns Array of previous results
   */
  getHistory(): number[] {
    return [...this.history];
  }

  /**
   * Clear calculation history
   */
  clearHistory(): void {
    this.history = [];
  }
}
