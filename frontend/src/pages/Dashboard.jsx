import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import API_BASE_URL from "../config";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [role, setRole] = useState(""); // Role State
  const navigate = useNavigate(); // ✅ Navigation Hook

  useEffect(() => {
    // Dummy data for now (Backend will be integrated later)
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");

    setUser({ name: storedName || "Guest", email: storedEmail || "No Email" });
    setRole(storedRole || "policyholder"); 

    fetch(`${API_BASE_URL}/policies?email=${storedEmail}`)
      .then((res) => res.json())
      .then((data) => setPolicies(data))
      .catch((err) => console.error("Error fetching policies:", err));
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mt-10">
        <h2 className="text-3xl font-bold text-center text-[#0568a6] mb-6">
          {role === "policyholder" ? "Policyholder Dashboard" : "Admin Dashboard"}
          <button 
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700"
                onClick={handleLogout}
              >
              Logout
          </button>
        </h2>

        {/* User Info */}
        {user && (
          <div className="mb-6 text-center">
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        )}

        {/* Different Views for Admin & Policyholder */}
        {role === "policyholder" ? (
          <>
            {/* Policyholder's View */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Your Policies:</h3>
              <div className="grid grid-cols-2 gap-4">
              {policies.map((policy, index) => (
              <div key={policy.id || index} className="bg-gray-200 p-4 rounded-lg">
                {/* {policies.map((policy) => (
                  <div key={policy.id}  */}
                    <p className="text-lg font-semibold">{policy.type} Insurance</p>
                    <p className="text-gray-700">Coverage: {policy.coverage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center mt-6 space-y-4">
              {/* File a Claim Button */}
              <button
                className="bg-[#0568a6] text-white px-6 py-3 rounded-md hover:bg-[#248e38] transition text-lg font-semibold w-2/3"
                onClick={() => alert("Redirect to claim form")}
              >
                File a New Claim
              </button>

              {/* Buy a New Policy Button */}
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition text-lg font-semibold w-2/3"
                onClick={() => navigate("/buy-policy")} // ✅ Navigates to Buy Policy Page
              >
                ➕ Buy a New Policy
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Admin's View */}
            <h3 className="text-lg font-bold text-gray-800 mt-6">Admin Controls:</h3>
            <div className="bg-gray-200 p-4 rounded-lg mt-2">
              <p className="text-gray-700">Manage Claims and Users here.</p>
              <button
                className="bg-[#0568a6] text-white px-6 py-3 mt-4 rounded-md hover:bg-[#248e38] transition text-lg font-semibold"
                onClick={() => alert("Redirect to admin panel")}
              >
                Go to Admin Panel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
