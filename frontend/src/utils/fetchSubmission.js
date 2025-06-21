import axios from "axios"

export const fetchSubmissionDates = async (handle) => {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`);
        const submissions = res.data.result;
        const activitymap = {};
        submissions.forEach(sub => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split("T")[0];
            activitymap[date] = (activitymap[date] || 0) + 1;
        });
        return Object.entries(activitymap).map(([date, cnt]) => ({
            date,
            count: cnt,
        }));
    } catch (err) {
        console.error("Error fetching submissions:", err);
        return [];
    }
};
