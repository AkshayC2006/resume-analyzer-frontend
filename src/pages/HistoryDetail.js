import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { Card, CardContent } from "../components/ui/card";

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null); // For bulk resume details

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const docRef = doc(db, "history", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnalysis(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching analysis detail:", error);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading...
      </div>
    );
  }

  const getColor = (score) => {
    if (score > 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const renderSingleDetails = (data) => {
    const categories = data.categories || {};
    const feedback = data.feedback || {};

    return (
      <div>
        <p className="text-lg font-medium mb-4">
          <strong>Total Match Score:</strong> {data.match_score || data.matchScore || 0}%
        </p>

        {/* Category Scores */}
        <div className="space-y-4 mb-6">
          {Object.entries(categories).map(([key, value]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className="bg-white border rounded-lg shadow p-4"
            >
              <div className="flex justify-between mb-1">
                <span className="capitalize font-semibold">{key}</span>
                <span>{value.score}%</span>
              </div>
              <div className="w-full h-3 rounded bg-gray-200 overflow-hidden">
                <div
                  className={`${getColor(value.score)} h-full`}
                  style={{ width: `${value.score}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Matched Keywords:</strong> {value.matched_keywords?.join(", ") || "None"}</p>
                <p><strong>Missing Keywords:</strong> {value.missing_keywords?.join(", ") || "None"}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Feedback */}
        {feedback && Object.keys(feedback).length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">AI Feedback</h2>
            {Object.entries(feedback).map(([cat, text]) => (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.02 }}
                className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-3 shadow"
              >
                <h4 className="font-semibold capitalize mb-1">{cat}</h4>
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
      >
        ← Back
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-2 text-blue-700"
      >
        {analysis.title || "Untitled Analysis"}
      </motion.h1>
      <p className="text-gray-600 mb-6">
        Analyzed on: {new Date(analysis.analysisDate || analysis.date).toLocaleString()}
      </p>

      {/* SINGLE ANALYSIS */}
      {analysis.type === "single" && renderSingleDetails(analysis.analysisDetails || analysis)}

      {/* BULK ANALYSIS */}
      {analysis.type === "bulk" && (
        <>
          <div className="mb-4">
            <p className="text-lg font-medium">
              <strong>Total Resumes:</strong> {analysis.totalResumes || (analysis.analysisDetails?.length || 0)}
            </p>
            <p className="text-md text-gray-700">
              <strong>Top Resume:</strong> {analysis.topResumeFile || "N/A"}
            </p>
          </div>

          {/* Ranking List or Single Resume View */}
          {!selectedResume ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">Ranked Resumes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.analysisDetails && analysis.analysisDetails.length > 0 ? (
                  analysis.analysisDetails.map((res, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedResume(res)}
                    >
                      <h3 className="font-bold text-lg">
                        #{idx + 1} - {res.file_name || `Resume ${idx + 1}`}
                      </h3>
                      <p className="text-gray-700">Match Score: {res.match_score}%</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-600">No resume details available.</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedResume(null)}
                className="mb-4 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                ← Back to Ranking
              </motion.button>
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                {selectedResume.file_name || "Resume Details"}
              </h2>
              {renderSingleDetails(selectedResume)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryDetail;
