import React, { useEffect, useState } from "react";
import {fetchUserProblems} from "../utils/fetchSolvedProblems";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RatingBarChart = ({handle}) => {
    const [data,setData]=useState([]);
    useEffect(()=>{
        const prepare=async()=>{
            const solved=await fetchUserProblems(handle);
            const ratingmap={};
            solved.forEach(p=>{
                const rating=p.rating || "Unrated";
                ratingmap[rating]=(ratingmap[rating] || 0)+1;
            });
            const result=Object.entries(ratingmap)
                .map(([rating,cnt])=>({
                    rating,
                    cnt,
                }))
                .sort((a, b) => {
                    if (a.rating === "Unrated") return 1;
                    if (b.rating === "Unrated") return -1;
                    return a.rating - b.rating;
                });
            setData(result);
        };
        if (handle) prepare();
    },[handle]);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-indigo-700">
                Problems Solved By Rating
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cnt" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RatingBarChart;