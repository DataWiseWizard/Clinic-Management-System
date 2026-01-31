import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addToQueue } from './queueService';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP'),
}));

vi.mock('../../lib/firebase', () => ({
    db: {},
}));

describe('queueService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addToQueue', () => {
        it('should generate Token #1 if the queue is empty', async () => {
            getDocs.mockResolvedValueOnce({ empty: true, docs: [] });
            addDoc.mockResolvedValueOnce({ id: 'new_doc_id' });

            const result = await addToQueue('patient_123', { fullName: 'John Doe', purpose: 'Fever' });

            expect(result.token).toBe(1);
            expect(addDoc).toHaveBeenCalledWith(
                undefined,
                expect.objectContaining({
                    patientName: 'John Doe',
                    token: 1,
                    status: 'waiting'
                })
            );
        });

        it('should generate Token #6 if the last token was #5', async () => {
            getDocs.mockResolvedValueOnce({
                empty: false,
                docs: [{ data: () => ({ token: 5 }) }]
            });
            addDoc.mockResolvedValueOnce({ id: 'doc_id_2' });
            const result = await addToQueue('patient_456', { fullName: 'Jane Doe' });
            expect(result.token).toBe(6);
        });
    });
});