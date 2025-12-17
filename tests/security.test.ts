import { TestRunner } from '../utils/testRunner';

export const runSecurityTests = async () => {
  const runner = new TestRunner();

  // Helper from Dashboard logic to test
  const deriveRiskLevel = (score: number) => {
    if (score >= 80) return 'LOW';
    if (score >= 60) return 'MEDIUM';
    if (score >= 40) return 'HIGH';
    return 'CRITICAL';
  };

  await runner.describe('Scoring Logic Consistency', async () => {
    await runner.it('should correctly derive LOW risk level for high scores', () => {
      runner.expect(deriveRiskLevel(88)).toBe('LOW');
      runner.expect(deriveRiskLevel(100)).toBe('LOW');
    });

    await runner.it('should correctly derive CRITICAL risk level for low scores', () => {
      runner.expect(deriveRiskLevel(39)).toBe('CRITICAL');
      runner.expect(deriveRiskLevel(0)).toBe('CRITICAL');
    });

    await runner.it('should handle boundary conditions for score tiers', () => {
      runner.expect(deriveRiskLevel(80)).toBe('LOW');
      runner.expect(deriveRiskLevel(60)).toBe('MEDIUM');
      runner.expect(deriveRiskLevel(40)).toBe('HIGH');
    });
  });

  await runner.describe('Browser Integration & Export Capabilities', async () => {
    await runner.it('should have access to window.print API', () => {
        runner.expect(typeof window.print).toBe('function');
    });

    await runner.it('should detect if inside a restricted iframe', () => {
        const isIframe = window.self !== window.top;
        if (isIframe) {
            console.warn("Tests running inside an iframe: Exporting PDF via window.print() may be restricted by the parent sandbox.");
        }
        runner.expect(typeof window.self).toBe('object');
    });

    await runner.it('should be able to resolve environment variables', () => {
        runner.expect(process.env.API_KEY).toBeDefined();
    });

    await runner.it('should have access to navigator properties', () => {
        runner.expect(navigator.userAgent).toBeDefined();
    });
  });

  return runner.getResults();
};