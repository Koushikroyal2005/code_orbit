import React, { useEffect, useState } from "react";
import axios from "axios";

const UserCard = ({ user }) => {
  const [cfUser, setCfUser] = useState(null);

  const setColour = (rank) => {
    if (!rank) return "gray-500";
    rank = rank.toLowerCase();
    if (rank.includes("newbie")) return "text-gray-500";
    else if (rank==="pupil") return "text-green-700";
    else if (rank==="specialist") return "text-teal-500";
    else if (rank==="expert") return "text-blue-500";
    else if (rank==="candidate master") return "text-purple-500";
    else if (rank==="master") return "text-yellow-500";
    else if (rank==="international master") return "text-orange-500";
    else if (rank.includes("grandmaster") || rank.includes("legendary")) return "text-red-500";
    else return "text-gray-500";
  };

  useEffect(() => {
    const fetchCFUser = async () => {
      try {
        const res = await axios.get(
          `https://codeforces.com/api/user.info?handles=${user.handle}`
        );
        if (res.data.status === "OK") {
          setCfUser(res.data.result[0]);
        }
      } catch (err) {
        console.error("Failed to fetch Codeforces user info:", err);
      }
    };

    if (user?.handle) {
      fetchCFUser();
    }
  }, [user]);

  const formatLastSeen = (timestamp) => {
    const now = Math.floor(Date.now() / 1000);
    const secondsAgo = now - timestamp;
    if (secondsAgo < 60) return "Online now";
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
    return `${Math.floor(secondsAgo / 86400)} days ago`;
  };

  if (!cfUser) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        <img
          src={cfUser.avatar || "https://userpic.codeforces.org/no-avatar.jpg"}
          alt="profile pic"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className={`text-xl font-bold ${setColour(cfUser.rank)}`}>
            {cfUser.handle} ({cfUser.rank || "unrated"})
          </h2>
          <p className="text-gray-600">
            Current Rating: {cfUser.rating || "Unrated"} (Max: {cfUser.maxRating || "Unrated"})
          </p>
          <p
            className={`text-sm mt-1 ${
              cfUser.lastOnlineTimeSeconds >= Math.floor(Date.now() / 1000) - 60
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            Last Seen: {formatLastSeen(cfUser.lastOnlineTimeSeconds)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;