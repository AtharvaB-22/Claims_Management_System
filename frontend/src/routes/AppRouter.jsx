import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import ClaimDetails from "../pages/ClaimDetails";

const AppRouter = () => {
  const role = localStorage.getItem("role"); // Get role from localStorage

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={role === "policyholder" ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={role === "admin" ? <AdminPage /> : <Navigate to="/" />} />
        <Route path="/claims" element={<ClaimDetails />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
