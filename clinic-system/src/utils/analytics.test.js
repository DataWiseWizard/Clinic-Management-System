import { describe, it, expect } from 'vitest';
import { calculateWaitTime } from './analytics';

describe('calculateWaitTime Algorithm', () => {
    const NOW = new Date().setHours(9, 0, 0, 0);

    it('returns default 15 mins if history is empty', () => {
        const history = [];
        const queuePos = 0;

        const result = calculateWaitTime(history, queuePos);
        expect(result).toBe(15);
    });

    it('calculates average from history and applies to queue position', () => {
        const mockHistory = [
            {
                timestamps: {
                    consultationStart: { toMillis: () => NOW },
                    completed: { toMillis: () => NOW + (10 * 60 * 1000) }
                }
            },
            {
                timestamps: {
                    consultationStart: { toMillis: () => NOW },
                    completed: { toMillis: () => NOW + (20 * 60 * 1000) }
                }
            }
        ];

        const queuePos = 2;

        const result = calculateWaitTime(mockHistory, queuePos);
        expect(result).toBe(38);
    });

    it('ignores incomplete or invalid appointments', () => {
        const mixedHistory = [
            {
                timestamps: {
                    consultationStart: { toMillis: () => NOW },
                    completed: { toMillis: () => NOW + (10 * 60 * 1000) }
                }
            },
            {
                timestamps: {
                    consultationStart: { toMillis: () => 0 },
                    completed: { toMillis: () => 0 }
                }
            }];

        const queuePos = 1;
        const result = calculateWaitTime(mixedHistory, queuePos);
        expect(result).toBe(15);
    });
});