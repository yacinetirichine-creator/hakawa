import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { CookieConsent } from "./components/legal/CookieConsent";
import { AIChatbot } from "./components/ui/AIChatbot";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Projects from "./pages/dashboard/Projects";
import Inspiration from "./pages/dashboard/Inspiration";
import Settings from "./pages/dashboard/Settings";
import Subscription from "./pages/dashboard/Subscription";
import NewProject from "./pages/create/NewProject";
import Explore from "./pages/create/Explore";
import Plan from "./pages/create/Plan";
import Write from "./pages/create/Write";
import Export from "./pages/create/Export";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspiration"
            element={
              <ProtectedRoute>
                <Inspiration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/new"
            element={
              <ProtectedRoute>
                <NewProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/:projectId/explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/:projectId/plan"
            element={
              <ProtectedRoute>
                <Plan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/:projectId/write"
            element={
              <ProtectedRoute>
                <Write />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create/:projectId/export"
            element={
              <ProtectedRoute>
                <Export />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <CookieConsent />
        <AIChatbot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#37474F",
              borderRadius: "12px",
              padding: "16px",
            },
            success: {
              iconTheme: {
                primary: "#BA68C8",
                secondary: "#fff",
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
