import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return unsub;
  }, []);

  // While Firebase is checking authentication state
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  // If logged in and trying to access login/signup, redirect to home
  if (user && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show NavBar only if authenticated and not on auth pages */}
      {!isAuthPage && user && <NavBar />}

      {/* Add top padding when navbar is visible */}
      <div className={!isAuthPage && user ? "pt-20" : ""}>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/analyze"
            element={user ? <Analyzer /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/history"
            element={user ? <History /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/history/:id"
            element={user ? <HistoryDetail /> : <Navigate to="/login" replace />}
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Catch-All Redirect */}
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
