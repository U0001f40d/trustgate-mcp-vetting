export interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  error?: string;
  duration: number;
}

export class TestRunner {
  private results: TestResult[] = [];

  async describe(suiteName: string, fn: () => Promise<void> | void) {
    console.group(`Test Suite: ${suiteName}`);
    await fn();
    console.groupEnd();
  }

  async it(testName: string, fn: () => Promise<void> | void) {
    const start = performance.now();
    try {
      await fn();
      this.results.push({
        name: testName,
        status: 'passed',
        duration: performance.now() - start
      });
      console.log(`✅ ${testName}`);
    } catch (e: any) {
      this.results.push({
        name: testName,
        status: 'failed',
        error: e.message || String(e),
        duration: performance.now() - start
      });
      console.error(`❌ ${testName}: ${e.message}`);
    }
  }

  expect(actual: any) {
    return {
      toBe: (expected: any) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected} but received ${actual}`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected truthy value but received ${actual}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined) {
          throw new Error(`Expected defined value but received undefined`);
        }
      },
      toBeGreaterThan: (num: number) => {
        if (!(actual > num)) {
          throw new Error(`Expected ${actual} to be greater than ${num}`);
        }
      },
      toInclude: (item: any) => {
          if (!actual.includes(item)) {
              throw new Error(`Expected ${JSON.stringify(actual)} to include ${item}`);
          }
      }
    };
  }

  getResults() {
    return this.results;
  }
}