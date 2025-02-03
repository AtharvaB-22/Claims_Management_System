import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import ClaimDetails from "../pages/ClaimDetails";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/claim/:id" element={<ClaimDetails />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
