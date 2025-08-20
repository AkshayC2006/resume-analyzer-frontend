import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setHistory([]);
          setLoading(false);
          return;
        }
        const q = query(collection(db, "history"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by analysis date, latest first
        data.sort((a, b) => new Date(b.analysisDate) - new Date(a.analysisDate));
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-blue-700 mb-8"
      >
        Analysis History
      </motion.h1>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 mt-10"
        >
          <p className="text-xl font-medium">No history found.</p>
          <button
            onClick={() => navigate("/analyze")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Analyze Now
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {history.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-lg p-5 cursor-pointer border hover:shadow-xl transition-all"
              onClick={() => navigate(`/history/${item.id}`)}
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {item.title || "Untitled"}
              </h2>
              <p className="text-sm text-gray-600">
                {new Date(item.analysisDate).toLocaleString()}
              </p>
              {item.type === "single" ? (
                <p className="mt-2 text-gray-800">
                  <strong>Match Score:</strong> {item.matchScore}%
                </p>
              ) : (
                <div className="mt-2">
                  <p className="text-gray-800">
                    <strong>Bulk Analysis:</strong> {item.totalResumes} resumes
                  </p>
                  <p className="text-gray-800">
                    <strong>Top Resume:</strong> {item.topResumeFile}
                  </p>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/history/${item.id}`);
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default History;
