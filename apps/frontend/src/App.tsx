import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import AppLayout from "./components/AppLayout";
import AlgorithmLabPage from "./pages/AlgorithmLabPage";
import DataStructuresPage from "./pages/DataStructuresPage";
import ApplicationTrackerPage from "./pages/ApplicationTrackerPage";
import LeetcodePage from "./pages/LeetcodePage";
import { useAuthUser } from "./hooks/useAuth";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthUser();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthUser();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public marketing routes */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <PublicOnly>
              <LandingPage />
            </PublicOnly>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicOnly>
              <SignIn />
            </PublicOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnly>
              <SignUp />
            </PublicOnly>
          }
        />
      </Route>

      {/* Authenticated app routes */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/algorithm-lab" element={<AlgorithmLabPage />} />
        <Route path="/data-structures" element={<DataStructuresPage />} />
        <Route
          path="/application-tracker"
          element={<ApplicationTrackerPage />}
        />
        <Route path="/leetcode" element={<LeetcodePage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
