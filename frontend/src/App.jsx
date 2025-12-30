import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { CookieConsent } from "./components/legal/CookieConsent";
import { AIChatbot } from "./components/ui/AIChatbot";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Pages critiques (chargement immédiat)
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy loading pour les autres pages (code splitting)
const Pricing = lazy(() => import("./pages/Pricing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const EnhancedAdminDashboard = lazy(() =>
  import("./pages/admin/EnhancedAdminDashboard")
);
const Projects = lazy(() => import("./pages/dashboard/Projects"));
const Inspiration = lazy(() => import("./pages/dashboard/Inspiration"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const Subscription = lazy(() => import("./pages/dashboard/Subscription"));
const AccountSettings = lazy(() => import("./pages/dashboard/AccountSettings"));
const NewProject = lazy(() => import("./pages/create/NewProject"));
const Explore = lazy(() => import("./pages/create/Explore"));
const Plan = lazy(() => import("./pages/create/Plan"));
const Write = lazy(() => import("./pages/create/Write"));
const Export = lazy(() => import("./pages/create/Export"));
const SharedProject = lazy(() => import("./pages/SharedProject"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const CGU = lazy(() => import("./pages/legal/CGU"));
const CGV = lazy(() => import("./pages/legal/CGV"));
const Mentions = lazy(() => import("./pages/legal/Mentions"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/shared/:shareToken" element={<SharedProject />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/legal/cgu" element={<CGU />} />
            <Route path="/legal/cgv" element={<CGV />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/mentions" element={<Mentions />} />
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
                  <EnhancedAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
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
