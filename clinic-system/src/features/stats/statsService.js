import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export const fetchDailyStats = async () => {
    const q = query(
        collection(db, "appointments"),
        where("status", "==", "completed"),
        orderBy("timestamps.completed", "desc"),
        limit(50)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());

    let totalRevenue = 0;
    let patientsToday = 0;
    const todayStr = new Date().toDateString();

    const revenueData = [];

    data.forEach(apt => {
        const date = apt.timestamps.completed?.toDate();
        if (!date) return;

        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (apt.billing?.paymentStatus === 'paid') {
            totalRevenue += (Number(apt.billing.total) || 0);
        }

        if (date.toDateString() === todayStr) {
            patientsToday++;
        }

        const existingDay = revenueData.find(d => d.name === dateStr);
        if (existingDay) {
            existingDay.revenue += (Number(apt.billing?.total) || 0);
            existingDay.patients += 1;
        } else {
            revenueData.push({ 
                name: dateStr, 
                revenue: Number(apt.billing?.total) || 0,
                patients: 1
            });
        }
    });

    return {
        totalRevenue,
        patientsToday,
        chartData: revenueData.reverse()
    };
};