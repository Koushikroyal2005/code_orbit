import axios from "axios";

export const fetchUserProblems = async (handle) => {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const solved = new Set();
        const solvedproblems = res.data.result.filter(sub => sub.verdict === "OK").map(sub => {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            if (!solved.has(key)) {
                solved.add(key);
                return sub.problem;
            }
            return null;
        }).filter(Boolean);
        return solvedproblems;
    } catch (err) {
        console.error("Error fetching solved problems:", err);
        return [];
    }
};
