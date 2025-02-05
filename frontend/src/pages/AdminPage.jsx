import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const navigate = useNavigate();

  // Predefined Policies
  const policies = [
    { name: "Health Insurance", amount: "$10,000" },
    { name: "Vehicle Insurance", amount: "$5,000" },
    { name: "Home Insurance", amount: "$20,000" },
    { name: "Life Insurance", amount: "$50,000" }
  ];

  useEffect(() => {
    // Dummy users (Replace with Backend API Calls)
    setUsers([
      { id: 1, name: "John Doe", policies: ["Health Insurance"] },
      { id: 2, name: "Jane Smith", policies: ["Life Insurance"] }
    ]);

    // Dummy claims (Replace with Backend API Calls)
    setClaims([
      { id: 1, userId: 1, policyType: "Health Insurance", amount: "$1000", status: "pending" },
      { id: 2, userId: 2, policyType: "Life Insurance", amount: "$500", status: "pending" }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/");
  };

  const handleApprove = (id) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === id ? { ...claim, status: "approved" } : claim
      )
    );
    alert(`Claim ${id} has been approved!`);
  };

  const handleReject = (id) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === id ? { ...claim, status: "rejected" } : claim
      )
    );
    alert(`Claim ${id} has been rejected!`);
  };

  const handleAssignPolicy = () => {
    if (!selectedUser || !selectedPolicy) {
      alert("Select a user and a policy.");
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? { ...user, policies: [...user.policies, selectedPolicy] }
          : user
      )
    );

    alert(`Policy "${selectedPolicy}" assigned to ${selectedUser.name}.`);
    setSelectedPolicy("");
    setSearchTerm(""); // Clear search after assigning policy
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-[#0568a6] mb-4">
          Admin Dashboard
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </h2>

        {/* User Management Section */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-[#0568a6] mb-2">User Management</h3>
          
          {/* Search for Users */}
          <input
            type="text"
            placeholder="Search user by name..."
            className="p-2 border rounded w-full mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Assign Policy Section */}
          <div className="flex items-center gap-4">
            <select
              className="p-2 border rounded w-full"
              onChange={(e) =>
                setSelectedUser(users.find((user) => user.id === Number(e.target.value)))
              }
            >
              <option value="">Select User</option>
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
            </select>

            <select
              className="p-2 border rounded w-full"
              onChange={(e) => setSelectedPolicy(e.target.value)}
            >
              <option value="">Select Policy</option>
              {policies.map((policy) => (
                <option key={policy.name} value={policy.name}>
                  {policy.name} - {policy.amount}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignPolicy}
              className="bg-[#0568a6] text-white px-4 py-2 rounded"
            >
              Assign Policy
            </button>
          </div>

          {/* Display Users Table */}
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">User ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Policies</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border">
                  <td className="border p-2 text-center">{user.id}</td>
                  <td className="border p-2 text-center">{user.name}</td>
                  <td className="border p-2 text-center">{user.policies.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Claims Management Section */}
        {/* Claims Management Section */}
        <div className="overflow-x-auto">
                  <h3 className="text-lg font-semibold text-[#0568a6] mb-2">Claims Management</h3>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2">Claim ID</th>
                        <th className="border p-2">User ID</th>
                        <th className="border p-2">Policy Type</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim) => (
                        <tr key={claim.id} className="border">
                          <td className="border p-2 text-center">{claim.id}</td>
                          <td className="border p-2 text-center">{claim.userId}</td>
                          <td className="border p-2 text-center">{claim.policyType}</td>
                          <td className="border p-2 text-center">{claim.amount}</td>
                          <td className="border p-2 text-center font-semibold">
                            {claim.status === "pending" ? (
                              <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded">
                                {claim.status}
                              </span>
                            ) : claim.status === "approved" ? (
                              <span className="bg-green-200 text-green-700 px-2 py-1 rounded">
                                {claim.status}
                              </span>
                            ) : (
                              <span className="bg-red-200 text-red-700 px-2 py-1 rounded">
                                {claim.status}
                              </span>
                            )}
                          </td>
                          <td className="border p-2 text-center">
                            {claim.status === "pending" ? (
                              <>
                                <button
                                  className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition"
                                  onClick={() => handleApprove(claim.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }