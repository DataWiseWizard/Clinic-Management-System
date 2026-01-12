/**
 * Calculates the Estimated Wait Time (EWT) for a patient.
 * Uses "Edge Computing" (Client-side math) to reduce server load.
 * * @param {Array} history - List of completed appointment objects
 * @param {Number} queuePosition - How many people are ahead (0-indexed)
 * @returns {Number} Estimated minutes
 */
export const calculateWaitTime = (history, queuePosition) => {
    if (!history || history.length === 0) {
        return (queuePosition + 1) * 15;
    }

    const durations = history
        .map(apt => {
            const start = apt.timestamps?.consultationStart?.toMillis ? apt.timestamps.consultationStart.toMillis() : 0;
            const end = apt.timestamps?.completed?.toMillis ? apt.timestamps.completed.toMillis() : 0;

            if (start === 0 || end === 0 || end < start) return null;

            return (end - start) / 60000;
        })
        .filter(mins => mins !== null && mins > 0)

    if (durations.length === 0) {
        return (queuePosition + 1) * 15;
    }
    const totalMinutes = durations.reduce((sum, val) => sum + val, 0);
    const avgMinutes = Math.ceil(totalMinutes / durations.length);

    return (queuePosition * avgMinutes) + Math.round(avgMinutes / 2);
};