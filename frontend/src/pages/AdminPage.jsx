import { useState, useEffect } from "react";

export default function AdminPage() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    // Dummy claims for now (Backend integration coming next)
    setClaims([
      { id: 1, policyType: "Health", amount: "$1000", status: "pending" },
      { id: 2, policyType: "Vehicle", amount: "$500", status: "pending" }
    ]);
  }, []);

  const handleAction = (id, action) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === id ? { ...claim, status: action } : claim
      )
    );
    alert(`Claim ${id} has been ${action}! (Backend integration coming next)`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-[#0568a6] mb-6">
          Admin Dashboard - Manage Claims
        </h2>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Claim ID</th>
                <th className="border p-2">Policy Type</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-600">
                    No claims submitted yet.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="border">
                    <td className="border p-2 text-center">{claim.id}</td>
                    <td className="border p-2 text-center">{claim.policyType}</td>
                    <td className="border p-2 text-center">{claim.amount}</td>
                    <td className="border p-2 text-center font-semibold">
                      {claim.status === "pending" ? (
                        <span className="text-yellow-500">{claim.status}</span>
                      ) : claim.status === "approved" ? (
                        <span className="text-green-500">{claim.status}</span>
                      ) : (
                        <span className="text-red-500">{claim.status}</span>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      {claim.status === "pending" ? (
                        <>
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                            onClick={() => handleAction(claim.id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => handleAction(claim.id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500">No Actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
