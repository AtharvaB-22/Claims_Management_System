import { useState, useEffect } from "react";

export default function PolicyholderDashboard() {
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    // Dummy data for now (Backend will be integrated later)
    setUser({ name: "John Doe", email: "johndoe@example.com" });
    setPolicies([
      { id: 1, type: "Health", coverage: "$5000" },
      { id: 2, type: "Vehicle", coverage: "$10,000" }
    ]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-[#0568a6] mb-4">
          Policyholder Dashboard
        </h2>

        {/* User Info */}
        {user && (
          <div className="mb-4">
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        )}

        {/* Policies List */}
        <h3 className="text-lg font-bold mt-4">Your Policies:</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {policies.map((policy) => (
            <li key={policy.id}>
              {policy.type} - {policy.coverage}
            </li>
          ))}
        </ul>

        {/* Button for Filing a Claim */}
        <button
          className="bg-[#0568a6] text-white px-4 py-2 mt-4 rounded hover:bg-[#248e38] transition"
          onClick={() => alert("Redirect to claim form")}
        >
          File a New Claim
        </button>
      </div>
    </div>
  );
}
