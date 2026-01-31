import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processPayment } from './billingService';
import { doc, updateDoc } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    updateDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIME'),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn(),
    limit: vi.fn(),
}));

vi.mock('../../lib/firebase', () => ({
    db: {},
}));

describe('billingService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('processPayment', () => {
        it('should update the document status to paid and completed', async () => {
            const appointmentId = 'apt_123';

            await processPayment(appointmentId);
            expect(updateDoc).toHaveBeenCalledWith(
                undefined,
                expect.objectContaining({
                    status: 'completed',
                    'billing.paymentStatus': 'paid'
                })
            );
        });
    });
});