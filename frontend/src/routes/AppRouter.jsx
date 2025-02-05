import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClaimDetails from "../pages/ClaimDetails";
import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import Dashboard from "../pages/Dashboard";
import BuyPolicy from "../pages/BuyPolicy";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ ClaimDetails is the default page for testing */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/claim" element={<ClaimDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy-policy" element={<BuyPolicy />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
