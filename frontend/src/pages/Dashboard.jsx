import { useState, useEffect } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [role, setRole] = useState(""); // Role State

  useEffect(() => {
    // Dummy data for now (Backend will be integrated later)
    setUser({ name: "John Doe", email: "johndoe@example.com" });
    setRole("policyholder"); // Change to "admin" to test Admin View

    setPolicies([
      { id: 1, type: "Health", coverage: "$5000" },
      { id: 2, type: "Vehicle", coverage: "$10,000" }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mt-10">
        <h2 className="text-3xl font-bold text-center text-[#0568a6] mb-6">
          {role === "admin" ? "Admin Dashboard" : "Policyholder Dashboard"}
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
                {policies.map((policy) => (
                  <div key={policy.id} className="bg-gray-200 p-4 rounded-lg">
                    <p className="text-lg font-semibold">{policy.type} Insurance</p>
                    <p className="text-gray-700">Coverage: {policy.coverage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* File a Claim Button */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-[#0568a6] text-white px-6 py-3 rounded-md hover:bg-[#248e38] transition text-lg font-semibold"
                onClick={() => alert("Redirect to claim form")}
              >
                File a New Claim
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
