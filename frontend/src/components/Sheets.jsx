import React, { useState, useEffect, useMemo, useRef } from "react";
//import { useLocation } from "react-router-dom";
import axios from "axios";
import { FixedSizeList as List } from "react-window";
import { FiChevronDown, FiChevronUp, FiRefreshCw, FiArrowLeft, FiExternalLink} from "react-icons/fi";
import { BsBookmarkHeart } from "react-icons/bs";
import { PiEyeLight } from "react-icons/pi";
//<PiEyeLight />
import { PiEyeSlashDuotone } from "react-icons/pi";
//<PiEyeSlashDuotone />
import Bookmarks from "./Bookmarks";
import api from '../services/api';

const ratingBuckets = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600];
const skillLevels = ["Beginner", "Easy", "Intermediate", "Advanced", "Mastery"];

const Sheets = ({user}) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rating");
  const [activeTag, setActiveTag] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [randomProblem, setRandomProblem] = useState(null);
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const topRef = useRef(null);
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [cfHandle, setCfHandle] = useState("");
  const [showTag,setShowTag]=useState(false);
  //const location = useLocation();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.getCurrentUser();
        if (res.data.handle) {
          setCfHandle(res.data.handle);
        }
        if (res.data.bookmarks) {
          setBookmarkedProblems(res.data.bookmarks);
        }
      } catch (error) {
        console.error("Failed to fetch user from backend:", error);
      }
    };
    const fetchBookmarks = async () => {
      try {
        const res = await api.getCurrentUser();
        if (res.data.bookmarks) {
          setBookmarkedProblems(res.data.bookmarks);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };
    if(user?.handle) {
      setCfHandle(user.handle);
      fetchBookmarks();
    } else {
      fetchUserData();
    }
  }, [user]);


  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`https://codeforces.com/api/user.status?handle=${cfHandle}`);
        const solved = new Set();
        res.data.result.forEach(sub => {
          if (sub.verdict === "OK") {
            solved.add(`${sub.problem.contestId}${sub.problem.index}`);
          }
        });
        setSolvedProblems(solved);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      }
    };
    fetchSubmissions();
  }, [cfHandle]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const cached = localStorage.getItem("cf_problems");
        if (cached) {
          setProblems(JSON.parse(cached));
        } else {
          const res = await axios.get("https://codeforces.com/api/problemset.problems");
          const problemList = res.data.result.problems;
          setProblems(problemList);
          localStorage.setItem("cf_problems", JSON.stringify(problemList));
        }
      } catch (err) {
        setError("Failed to load problems. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);


  const problemsByRating = useMemo(() => {
    const map = {};
    ratingBuckets.forEach(r => (map[r] = []));
    problems.forEach(p => {
      const r = p.rating;
      if (map[r]) map[r].push(p);
    });
    return map;
  }, [problems]);

  const tagSet = useMemo(() => {
    const tags = new Set();
    problems.forEach(p => {
      p.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [problems]);

  const problemsByTag = useMemo(() => {
    const map = {};
    problems.forEach(p => {
      p.tags?.forEach(tag => {
        if (!map[tag]) map[tag] = [];
        map[tag].push(p);
      });
    });
    return map;
  }, [problems]);

  const skillLevel = (rating) => {
    if (!rating) return "Unrated";
    if (rating <= 1100) return "Beginner";
    if (rating <= 1400) return "Easy";
    if (rating <= 1700) return "Intermediate";
    if (rating <= 2100) return "Advanced";
    return "Mastery";
  };

  const pickRandomProblem = (problems) => {
    if (!problems || problems.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * problems.length);
    return problems[randomIndex];
  };

  const handleRandomPick = (problems) => {
    const problem = pickRandomProblem(problems);
    setRandomProblem(problem);
    setSelectedProblem(problem);
    setShowTag(false);
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  const toggleBookmark = async (problem) => {
    try {
      const isBookmarked = bookmarkedProblems.some(
        p => p.contestId === problem.contestId && p.index === problem.index
      );
      let updatedBookmarks;
      if (isBookmarked) {
        updatedBookmarks = bookmarkedProblems.filter(
          p => !(p.contestId === problem.contestId && p.index === problem.index)
        );
      } else {
        updatedBookmarks = [...bookmarkedProblems, problem];
      }
      await api.updateBookmarks(updatedBookmarks);
      setBookmarkedProblems(updatedBookmarks);
    } catch (error) {
      console.error("Failed to update bookmarks:", error);
    }
  };

  const isBookmarked = (problem) => {
    return bookmarkedProblems.some(
      p => p.contestId === problem.contestId && p.index === problem.index
    );
  };

  const renderProblems = ({ items, onProblemSelect }) => (
    <div className="px-4 md:px-8 bg-gray-100 rounded-md"> {/* Add padding to the container */}
      <List
        height={Math.min(600, (items.length * 70)+2)}
        itemCount={items.length}
        itemSize={70}
        width="100%"
      >
        {({ index, style }) => {
          const p = items[index];
          return (
            <div 
              key={index} 
              style={{
                ...style,
                padding: "0 8px",
                boxSizing: "border-box",
              }} 
              className={`py-2 border-b hover:bg-rose-50 cursor-pointer transition rounded-md ${
                selectedProblem?.contestId === p.contestId && selectedProblem?.index === p.index 
                  ? "bg-blue-50 border-l-4 border-blue-500" 
                  : "bg-white"
              }`}
              onClick={() => {
                onProblemSelect(p);
                setSelectedProblem(p);
                setTimeout(() => {
                  topRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <div className="flex justify-between items-start px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Rating: {p.rating || "Unrated"}
                  </div>
                </div>
                <div className="flex flex-wrap justify-end ml-2">
                  {p.tags?.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[11px] ml-1 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      </List>
    </div>
  );


  const renderProblemDetail = (problem) => {
    if (!problem) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              <a 
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Codeforces"
              >{problem.name}</a>
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                Rating: {problem.rating || "Unrated"}
              </span>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
                {skillLevel(problem.rating)}
              </span>
            </div>
            {showTag && (
              <div className="flex flex-wrap gap-2">
                {problem.tags?.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <button 
              onClick={()=>setShowTag(!showTag)}
              title={showTag ? "Hide tags" : "Show tags"}
              className={`p-2 rounded-full transition ${
                showTag
                 ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
                {showTag ? <PiEyeSlashDuotone /> : <PiEyeLight />}
            </button>
            <button
              onClick={() => toggleBookmark(problem)}
              className={`p-2 rounded-full transition ${
                isBookmarked(problem) 
                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={isBookmarked(problem) ? "Remove bookmark" : "Add bookmark"}
            >
              <BsBookmarkHeart />
            </button>
            <a
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
              title="Open in Codeforces"
            >
              <FiExternalLink />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto" ref={topRef}>
      <div className="text-center mb-6 relative">
        <h1 className="text-3xl font-bold text-gray-800">
          Codeforces Problem Explorer
          {/* <span>Code</span>
          <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Forces </span>
          <span>Problem Explorer</span> */}
        </h1>
        <p className="text-gray-500 text-base italic mt-[-4px]">- make your customized cp sheet</p>
      </div>
      {/* Navigation Tabs */}
      <div className="flex gap-2 justify-center mb-8">
        <button 
          onClick={() => { 
            setActiveTab("rating"); 
            setActiveTag(null);
            setExpandedSection(null);
            setSelectedProblem(null);
            setRandomProblem(null);
            setShowBookmarks(false);
          }} 
          className={`px-6 py-2 rounded-md font-medium transition border ${
            activeTab === "rating" && !showBookmarks
              ? "bg-blue-500 text-white shadow-md border-black border"  // Added border-2
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border"
          }`}
        >
          By Rating
        </button>
        <button 
          onClick={() => { 
            setActiveTab("tag");
            setSelectedProblem(null);
            setRandomProblem(null);
            setShowBookmarks(false);
          }} 
          className={`px-6 py-2 rounded-md font-medium transition border ${
            activeTab === "tag" && !showBookmarks
              ? "bg-blue-500 text-white shadow-md border-black border"  // Added border-2
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border"
          }`}
        >
          By Tag
        </button>
        <button 
          onClick={() => { 
            setShowBookmarks(true);
            setActiveTab(null);
            setSelectedProblem(null);
            setRandomProblem(null);
          }} 
          className={`px-6 py-2 rounded-md font-medium transition ${
            showBookmarks
              ? "bg-amber-300 text-black shadow-md border" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border"
          }`}
        >
          My Bookmarks ({bookmarkedProblems.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-gray-600">Loading problems from Codeforces...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition"
          >
            Retry
          </button>
        </div>
      ) : showBookmarks ? (
        <Bookmarks  
          bookmarkedProblems={bookmarkedProblems}
          renderProblems={renderProblems}
          setSelectedProblem={setSelectedProblem}
          selectedProblem={selectedProblem} 
          handleRandomPick={handleRandomPick}
          solvedProblems={solvedProblems}
          toggleBookmark={toggleBookmark}
        />
      ) : (
        <>
          {/* Display selected/random problem at the top */}
          {(selectedProblem || randomProblem) && renderProblemDetail(selectedProblem || randomProblem)}

          {/* Rating View */}
          {activeTab === "rating" && (
            <div className="space-y-6">
              {ratingBuckets.map(rating => (
                problemsByRating[rating] && problemsByRating[rating].length > 0 && (
                  <div key={rating} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-rose-50 transition"
                      onClick={() => setExpandedSection(expandedSection === rating ? null : rating)}
                    >
                      <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-gray-800 mr-3">
                          Rating: {rating} ({problemsByRating[rating].length} problems)
                        </h2>
                        <span className={`text-xs px-2 py-1 rounded ${
                          skillLevel(rating) === "Beginner" ? "bg-green-100 text-green-800" :
                          skillLevel(rating) === "Easy" ? "bg-blue-100 text-blue-800" :
                          skillLevel(rating) === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                          skillLevel(rating) === "Advanced" ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {skillLevel(rating)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRandomPick(problemsByRating[rating]);
                          }}
                          className="flex items-center bg-stone-200 hover:bg-stone-300 text-gray-700 px-3 py-1 rounded-md mr-3 transition"
                        >
                          <FiRefreshCw className="mr-1" size={14} />
                          Random
                        </button>
                        {expandedSection === rating ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                    {expandedSection === rating && (
                      <div className="border-t">
                        {renderProblems({
                          items: problemsByRating[rating],
                          onProblemSelect: (p) => setSelectedProblem(p)
                        })}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Tag View */}
          {activeTab === "tag" && !activeTag && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tagSet.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setActiveTag(tag)}
                  className="bg-white hover:bg-rose-50 border border-gray-200 p-4 rounded-lg shadow-sm transition text-center"
                >
                  <span className="font-medium text-gray-800">{tag}</span>
                  <span className="block text-xs text-gray-500 mt-1">
                    {problemsByTag[tag]?.length || 0} problems
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Tag Detail View */}
          {activeTab === "tag" && activeTag && (
            <div>
              <button 
                onClick={() => {
                  setActiveTag(null);
                  setSelectedProblem(null);
                  setRandomProblem(null);
                }} 
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
              >
                <FiArrowLeft className="mr-1" />
                Back to all tags
              </button>

              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Tag: {activeTag} ({problemsByTag[activeTag]?.length || 0} problems)
                  </h2>
                  <button
                    onClick={() => handleRandomPick(problemsByTag[activeTag])}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-3 transition"
                  >
                    <FiRefreshCw className="mr-2" />
                    Pick Random Problem
                  </button>
                </div>
              </div>

              {skillLevels.map(level => {
                const levelProblems = problemsByTag[activeTag]?.filter(p => skillLevel(p.rating) === level);
                if (!levelProblems || levelProblems.length === 0) return null;
                
                return (
                  <div key={level} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-pink-50 transition"
                      onClick={() => setExpandedSection(expandedSection === level ? null : level)}
                    >
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800 mr-3">{level}</h3>
                        <span className={`text-xs px-2 py-1 rounded transition ${
                          level==="Beginner" ? "bg-green-100 text-green-800"
                          : level==="Easy" ? "bg-blue-100 text-blue-800"
                          : level==="Intermediate" ? "bg-yellow-100 text-yellow-800"
                          : level==="Advanced" ? "bg-orange-100 text-orange-800"
                          : level==="Mastery" ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                          {levelProblems.length} problems
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRandomPick(levelProblems);
                          }}
                          className="flex items-center bg-stone-200 hover:bg-stone-300 text-gray-700 px-3 py-1 rounded-md mr-3 transition"
                        >
                          <FiRefreshCw className="mr-1" size={14} />
                          Random
                        </button>
                        {expandedSection === level ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                    {expandedSection === level && (
                      <div className="border-t">
                        {renderProblems({
                          items: levelProblems,
                          onProblemSelect: (p) => setSelectedProblem(p)
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sheets;