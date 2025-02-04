import { useState, useEffect } from "react";

export default function AdminPage() {
  const [claims, setClaims] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [rejectionComment, setRejectionComment] = useState("");

  useEffect(() => {
    // Dummy claims for now (Backend integration coming next)
    setClaims([
      { id: 1, policyType: "Health", amount: "$1000", status: "pending", comment: "" },
      { id: 2, policyType: "Vehicle", amount: "$500", status: "pending", comment: "" }
    ]);
  }, []);

  const handleApprove = (id) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === id ? { ...claim, status: "approved", comment: "" } : claim
      )
    );
    alert(`Claim ${id} has been approved! (Backend integration coming next)`);
  };

  const handleReject = (id) => {
    setSelectedClaimId(id);
    setShowModal(true);
  };

  const submitRejection = () => {
    if (!rejectionComment.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === selectedClaimId
          ? { ...claim, status: "rejected", comment: rejectionComment }
          : claim
      )
    );

    alert(`Claim ${selectedClaimId} has been rejected with comment: "${rejectionComment}"`);
    setShowModal(false);
    setRejectionComment("");
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
                    <td
                        className="border p-2 text-center text-blue-600 cursor-pointer hover:underline"
                        onClick={() => alert(`Viewing details for Claim ID: ${claim.id} (Backend integration coming soon!)`)}
                      >
                        {claim.id}
                    </td>

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
                            onClick={() => handleApprove(claim.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => handleReject(claim.id)}
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

        {/* Show Rejection Comment if Available */}
        <div className="mt-6">
          {claims.map(
            (claim) =>
              claim.status === "rejected" && claim.comment && (
                <div key={claim.id} className="bg-red-100 p-4 rounded-md mt-4">
                  <p className="text-red-500 font-bold">Rejection Comment for Claim {claim.id}:</p>
                  <p className="text-gray-800">{claim.comment}</p>
                </div>
              )
          )}
        </div>

        {/* Rejection Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-2">Reason for Rejection:</h3>
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Enter reason..."
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={submitRejection}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
