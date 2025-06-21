import React, { useEffect, useState } from "react";
import axios from "axios";
import { FcBullish } from "react-icons/fc";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload;
    const delta = data.rating - data.oldRating;
    const trend = delta > 0 ? "📈" : delta < 0 ? "📉" : "⏸";

    return (
      <div className="bg-amber-50 border border-amber-300 px-3 py-2 rounded shadow text-sm text-black">
        <p className="font-bold">{data.name}</p>
        <p>
          {trend} {data.oldRating} → {data.rating} ({delta >= 0 ? "+" : ""}
          {delta})
        </p>
        <p className="text-xs text-amber-700">{data.date}</p>
      </div>
    );
  }
  return null;
};

const RatingGraph = ({ handle }) => {
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${handle}`,
          { timeout: 10000 }
        );

        if (res.data.status === "OK") {
          const data = res.data.result.map((entry, index, arr) => {
            const oldRating =
              index === 0 ? entry.oldRating : arr[index - 1].newRating;
            return {
              name: entry.contestName,
              rating: entry.newRating,
              oldRating,
              date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
              timestamp: entry.ratingUpdateTimeSeconds,
            };
          });
          setRatingData(data);
        } else {
          setError("Failed to fetch rating data");
        }
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      fetchRatings();
    } else {
      setRatingData([]);
      setLoading(false);
    }
  }, [handle]);

  const sortedData = [...ratingData].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-center mb-4 text-indigo-700 flex items-center justify-center gap-2">
        <FcBullish className="text-2xl" />
        Contest Rating History
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : sortedData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rating data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sortedData}>
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#f59e0b" // amber-500
              strokeWidth={2}
              dot={{ fill: "#fbbf24", r: 4 }} // amber-400
              activeDot={{
                fill: "#f59e0b", // amber-500
                stroke: "#fff",
                strokeWidth: 2,
                r: 6,
              }}
              animationDuration={500}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#fbbf24" // amber-200
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#b45309" }} // amber-700
              interval={Math.max(1, Math.floor(sortedData.length / 5))}
              tickMargin={10}
            />
            <YAxis
              tick={{ fill: "#b45309" }} // amber-700
              domain={["dataMin - 100", "dataMax + 100"]}
            />
            <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RatingGraph;
