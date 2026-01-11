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

    const recentVisits = history.slice(0, 5);

    const durations = recentVisits.map(apt => {
        if (!apt.timestamps?.consultationStart || !apt.timestamps?.completed) return 15;

        const start = apt.timestamps.consultationStart.toMillis();
        const end = apt.timestamps.completed.toMillis();
        return (end - start) / 60000;
    });

    const totalMinutes = durations.reduce((sum, val) => sum + val, 0);
    const avgMinutes = Math.ceil(totalMinutes / durations.length);

    return (queuePosition * avgMinutes) + Math.round(avgMinutes / 2);
};