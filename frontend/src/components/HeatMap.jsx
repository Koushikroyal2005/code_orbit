import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { fetchSubmissionDates } from "../utils/fetchSubmission";
import "./HeatMap.css";

const HeatMap = ({ handle }) => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSubmissionDates(handle);
      setValues(data);
    };
    getData();
  }, [handle]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center">
        Submission Heatmap
      </h2>
      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={values}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 10) return "color-github-4";
            if (value.count >= 5) return "color-github-3";
            if (value.count >= 2) return "color-github-2";
            return "color-github-1";
          }}
          titleForValue={(value) =>
            value?.date ? `${value.date} - ${value.count} submissions` : undefined
          }
          showWeekdayLabels
        />
      </div>
    </div>
  );
};

export default HeatMap;
