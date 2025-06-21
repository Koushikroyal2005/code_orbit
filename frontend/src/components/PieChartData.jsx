import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Cell
} from "recharts";
import axios from "axios";
import { schemeTableau10 } from "d3-scale-chromatic";
import { fetchUserProblems } from "../utils/fetchSolvedProblems";

// Active shape renderer for interactive slices
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload, percent, value
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 12 : -12)} y={ey} textAnchor={textAnchor} fill="#333">
        {`${value} problems`}
      </text>
      <text x={ex + (cos >= 0 ? 12 : -12)} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

const PieChartData = ({handle}) => {
    const [tagData, setTagData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
      const fetchData = async () => {
        try {
          setLoading(true);
          const solvedProblems = await fetchUserProblems(handle);
          
          const tagCount = {};
          solvedProblems.forEach(problem => {
            problem.tags.forEach(tag => {
              tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
          });

          const formattedData = Object.entries(tagCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

          setTagData(formattedData);
        } catch (error) {
          console.error("Error processing data:", error);
        } finally {
          setLoading(false);
        }
      };
      if (handle) fetchData();
    },[handle]);
    if (loading) {
      return <p className="text-center text-gray-500">Loading pie chart...</p>;
    }
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto w-full">
      <h2 className="text-xl font-semibold text-center mb-4 text-indigo-700">
        Solved Problems by Tags
      </h2>
      {tagData.length === 0 ? (
        <p className="text-center text-gray-500">No solved problems found.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={tagData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={120}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {tagData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={schemeTableau10[index % 10]} 
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default PieChartData