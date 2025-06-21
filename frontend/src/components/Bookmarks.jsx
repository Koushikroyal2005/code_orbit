import React from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CiBookmarkMinus } from "react-icons/ci";

const Bookmarks = ({
  bookmarkedProblems,
  selectedProblem,
  setSelectedProblem,
  solvedProblems,
  toggleBookmark,
}) => {
  const total = bookmarkedProblems.length;
  const solvedCount = bookmarkedProblems.filter((p) =>
    solvedProblems.has(`${p.contestId}${p.index}`)
  ).length;
  const percentage = total ? Math.round((solvedCount / total) * 100) : 0;

  const renderBookmarkList = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-gray-300 border-collapse">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="w-12 px-2 py-2 border border-gray-300 text-center">#</th>
            <th className="px-4 py-2 border border-gray-300">Problem Name</th>
            <th className="px-4 py-2 border border-gray-300">Rating</th>
            <th className="px-4 py-2 border border-gray-300">Tags</th>
            <th className="w-24 px-2 py-2 border border-gray-300 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookmarkedProblems.map((p, index) => {
            const isSelected =
              selectedProblem?.contestId === p.contestId &&
              selectedProblem?.index === p.index;

            return (
              <tr
                key={`${p.contestId}${p.index}`}
                className={`cursor-pointer transition ${
                    solvedProblems.has(`${p.contestId}${p.index}`)
                    ? "bg-green-100 hover:bg-green-200"
                    : isSelected
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedProblem(p)}
            >
                <td className="w-12 px-2 py-2 border border-gray-300 text-center">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-gray-800 font-medium truncate">
                  <div className="flex items-center gap-2">
                    <a
                        href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline"
                    >
                        {p.name}
                    </a>
                    {solvedProblems.has(`${p.contestId}${p.index}`) && (
                      <span className="text-green-600 text-xs font-bold">✅</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-300 text-gray-700">
                  {p.rating || "Unrated"}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex flex-wrap gap-1">
                    {p.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="w-24 px-2 py-2 border border-gray-300 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(p);
                    }}
                    title="Remove from bookmarks"
                    className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs transition"
                  >
                    Delete<CiBookmarkMinus className="pl-0.5 text-base"/>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (bookmarkedProblems.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        You haven't bookmarked any problems yet.
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard card */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 w-full sm:w-auto">
          <div className="w-24 h-24">
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                textColor: "#1f2937",
                pathColor: "#3b82f6",
                trailColor: "#e5e7eb",
              })}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Bookmark Progress</h2>
            <p className="text-sm text-gray-600">
              <strong className="text-green-800">{solvedCount}</strong> solved out of <strong className="text-violet-800">{total}</strong> bookmarked
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {renderBookmarkList()}
      </div>
    </div>
  );
};

export default Bookmarks;
