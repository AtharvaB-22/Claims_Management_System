import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClaimDetails from "../pages/ClaimDetails";
import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ ClaimDetails is the default page for testing */}
        <Route path="/" element={<ClaimDetails />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
