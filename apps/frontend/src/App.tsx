import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import AlgorithmLabPage from "./pages/AlgorithmLabPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes with shared layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/algorithm-lab" element={<AlgorithmLabPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
