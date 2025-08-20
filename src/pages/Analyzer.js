import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_URL;

function Analyzer() {
  const [activeTab, setActiveTab] = useState("single");

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [title, setResumeTitle] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkJobDescription, setBulkJobDescription] = useState("");
  const [bulkTitle, setBulkTitle] = useState("");
  const [bulkResults, setBulkResults] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const navigate = useNavigate();

  const getColor = (score) => {
    if (score > 75) return "#38a169";
    if (score >= 50) return "#ecc94b";
    return "#e53e3e";
  };

  const chartData = results?.categories
    ? Object.entries(results.categories).map(([category, data]) => ({
        category,
        score: data.score,
      }))
    : [];

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    setLoading(true);
    setResults(null);

    try {
      const res = await axios.post(`${API_BASE}/upload_resume`, formData);
      setResults(res.data);

      const user = auth.currentUser;
      if (user) {
        const id = uuidv4();
        const saveData = {
          type: "single",
          userId: user.uid,
          title: title || "Untitled",
          matchScore: res.data.match_score ?? 0,
          analysisDate: new Date().toISOString(),
          analysisDetails: res.data,
        };
        await setDoc(doc(db, "history", id), saveData);
      }
    } catch (err) {
      console.error("Single analysis error:", err);
      alert("Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBulk = async (e) => {
    e.preventDefault();
    if (bulkFiles.length === 0 || !bulkJobDescription) return;

    const formData = new FormData();
    bulkFiles.slice(0, 10).forEach((f) => formData.append("files", f));
    formData.append("job_description", bulkJobDescription);

    setBulkLoading(true);
    setBulkResults(null);

    try {
      const res = await axios.post(`${API_BASE}/upload_bulk_resumes`, formData);
      const ranked = Array.isArray(res.data.results)  ? res.data.results  : (console.error("Unexpected bulk response:", res.data), []);
      setBulkResults(ranked);

      const user = auth.currentUser;
      if (user) {
        const id = uuidv4();
        const saveData = {
          type: "bulk",
          userId: user.uid,
          title: bulkTitle || "Untitled Bulk Analysis",
          analysisDate: new Date().toISOString(),
          totalResumes: ranked.length,
          topResumeFile: ranked[0]?.file_name || "N/A",
          analysisDetails: ranked,
        };
        await setDoc(doc(db, "history", id), saveData);
      }
    } catch (err) {
      console.error("Bulk analysis error:", err);
      alert("Error analyzing bulk resumes. Please try again.");
    } finally {
      setBulkLoading(false);
    }
  };

  const removeBulkFile = (index) => {
    setBulkFiles((files) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 max-w-6xl mx-auto rounded-lg shadow-lg">
      <motion.h1
        className="text-4xl font-bold text-center mb-10 text-blue-700"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Resume Analyzer
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-6">
        <motion.button
          onClick={() => setActiveTab("single")}
          className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors ${
            activeTab === "single"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          Single Analysis
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("bulk")}
          className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors ${
            activeTab === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          Bulk Analysis
        </motion.button>
      </div>

      {/* SINGLE ANALYSIS TAB */}
      {activeTab === "single" && (
        <motion.div
          key="single"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmitSingle} className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF, DOCX, PNG, JPG)</label>
            <input
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />

            <input
              type="text"
              placeholder="Resume Title (optional)"
              value={title}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <label className="block text-sm font-medium text-gray-700">Paste Job Description</label>
            <textarea
              rows="5"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 resize-none"
            ></textarea>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </motion.button>
          </form>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">Analysis Results</h2>
              <div className="text-gray-700 space-y-1">
                <p><strong>Name:</strong> {results.name || "N/A"}</p>
                <p><strong>Email:</strong> {results.email || "N/A"}</p>
                <p><strong>Phone:</strong> {results.phone || "N/A"}</p>
                <p className="mt-3 text-lg font-semibold">
                  Total Match Score: {results.match_score}%
                </p>
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="mt-8 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Detailed Category Scores */}
              {results.categories && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4 text-blue-700">Detailed Category Scores</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {Object.entries(results.categories).map(([category, data]) => (
                      <motion.div
                        key={category}
                        whileHover={{ scale: 1.03 }}
                        className="border rounded-lg p-5 shadow-sm bg-white"
                      >
                        <h4 className="capitalize font-semibold mb-2">{category}</h4>
                        <p><strong>Score:</strong> {data.score}%</p>
                        <p><strong>Matched Keywords:</strong> {data.matched_keywords.join(", ")}</p>
                        <p><strong>Missing Keywords:</strong> {data.missing_keywords.join(", ") || "None"}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              {results.feedback && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4 text-blue-700">AI Feedback</h3>
                  <div className="space-y-5">
                    {Object.entries(results.feedback).map(([category, message]) => (
                      <motion.div
                        key={category}
                        whileHover={{ scale: 1.02 }}
                        className="bg-blue-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-400"
                      >
                        <h4 className="capitalize font-semibold mb-1">{category}</h4>
                        <p>{message}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* BULK ANALYSIS TAB */}
      {activeTab === "bulk" && (
        <motion.div
          key="bulk"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmitBulk} className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">Upload up to 10 Resumes</label>
            <input
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files);
                if (selectedFiles.length > 10) {
                  alert("You can only select up to 10 files. Please remove extra files.");
                  return;
                }
                setBulkFiles(selectedFiles);
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />

            {/* Selected files list with remove option */}
            {bulkFiles.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
                <h4 className="font-semibold mb-2">Selected Files ({bulkFiles.length})</h4>
                <ul className="list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                  {bulkFiles.map((f, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="truncate max-w-xs">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeBulkFile(idx)}
                        className="text-red-500 hover:text-red-700 font-semibold ml-4"
                        aria-label={`Remove file ${f.name}`}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <input
              type="text"
              placeholder="Bulk Analysis Title (optional)"
              value={bulkTitle}
              onChange={(e) => setBulkTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <label className="block text-sm font-medium text-gray-700">Paste Job Description</label>
            <textarea
              rows="5"
              placeholder="Paste job description here..."
              value={bulkJobDescription}
              onChange={(e) => setBulkJobDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 resize-none"
            ></textarea>

            <motion.button
              type="submit"
              disabled={bulkLoading || bulkFiles.length === 0}
              whileHover={{ scale: bulkLoading ? 1 : 1.05 }}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                bulkLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {bulkLoading ? "Analyzing..." : "Analyze Bulk Resumes"}
            </motion.button>
          </form>

          {/* Bulk results list */}
          {bulkResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold mb-6 text-blue-700">Bulk Analysis Results</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bulkResults.length === 0 ? (
                  <p className="text-gray-600">No results found.</p>
                ) : (
                  bulkResults.map((res, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setResults(res)} // re-use single result view
                    >
                      <h3 className="font-bold text-lg">
                        #{index + 1} - {res.filename}
                      </h3>
                      {res.error ? (
                        <p className="text-red-600 font-semibold">Error: {res.error}</p>
                      ) : (
                        <p>Match Score: {res.match_score}%</p>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Show selected bulk resume detail */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 bg-gray-50 p-6 rounded-lg shadow"
                >
                  <motion.button
                    onClick={() => setResults(null)}
                    whileHover={{ scale: 1.05 }}
                    className="mb-5 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ← Back to Results
                  </motion.button>
                  <h3 className="text-xl font-semibold mb-4 text-blue-700">
                    {results.file_name || "Resume Details"}
                  </h3>

                  {/* Reuse single detail rendering */}
                  <div>
                    <p className="text-lg font-medium mb-2">
                      Total Match Score: {results.match_score ?? 0}%
                    </p>
                    {results.categories && (
                      <div className="grid gap-6 md:grid-cols-2">
                        {Object.entries(results.categories).map(([category, data]) => (
                          <motion.div
                            key={category}
                            whileHover={{ scale: 1.03 }}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                          >
                            <h4 className="capitalize font-semibold mb-2">{category}</h4>
                            <p><strong>Score:</strong> {data.score}%</p>
                            <p><strong>Matched Keywords:</strong> {data.matched_keywords.join(", ")}</p>
                            <p><strong>Missing Keywords:</strong> {data.missing_keywords.join(", ") || "None"}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {results.feedback && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-3 text-blue-700">AI Feedback</h4>
                        {Object.entries(results.feedback).map(([cat, text]) => (
                          <motion.div
                            key={cat}
                            whileHover={{ scale: 1.02 }}
                            className="bg-blue-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-400 mb-3"
                          >
                            <h5 className="capitalize font-semibold mb-1">{cat}</h5>
                            <p>{text}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default Analyzer;
