import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 🔹 Loading component
const Loading = () => (
  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh", 
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontSize: "24px"
  }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
      <div>Loading BlockDAG Analyzer...</div>
    </div>
  </div>
);

// 🔹 Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" replace />;
};

// 🔹 Public route wrapper
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// 🔹 Layout with conditional footer
const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

// 🔹 Layout without footer for auth pages
const AuthLayout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {/* No footer for auth pages */}
    </div>
  );
};

// 🔹 Main App
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page with footer */}
          <Route 
            path="/" 
            element={
              <Layout>
                <LandingPage />
              </Layout>
            } 
          />

          {/* Auth pages without footer */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <AuthLayout>
                  <Register />
                </AuthLayout>
              </PublicRoute>
            } 
          />

          {/* Protected pages without footer */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Dashboard />
                </AuthLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Profile />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route 
            path="*" 
            element={
              <div style={{ 
                textAlign: "center", 
                padding: "100px 20px",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }}>
                <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>404</h1>
                <p style={{ fontSize: "18px", marginBottom: "30px" }}>Page not found</p>
                <a 
                  href="/" 
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "600",
                    border: "2px solid white",
                    padding: "12px 24px",
                    borderRadius: "8px"
                  }}
                >
                  Go Home
                </a>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;