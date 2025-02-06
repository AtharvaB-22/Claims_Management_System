import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function AdminPage() {
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Dummy users (Replace with Backend API Calls)
      const fetchUsersData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/users`);
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          const data = await response.json();
          setUsers(data.users); // Assuming the response contains { users: [...] }
          console.log("Fetched Users Data:", data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      fetchUsersData();
    }, [] );
    // useEffect(() => {
    //   const fetchAdminData = async () => {
    //     try {
    //       // Fetch users
    //       const usersResponse = await fetch(`${API_BASE_URL}/users`);
    //       if (!usersResponse.ok) {
    //         throw new Error("Failed to fetch users");
    //       }
    //       const usersData = await usersResponse.json();
    //       setUsers(usersData.users); // Assuming response format is { users: [...] }
    //       console.log("Fetched Users Data:", usersData);

    //       // Fetch claims
    //       const claimsResponse = await fetch(`${API_BASE_URL}/claims`);
    //       if (!claimsResponse.ok) {
    //         throw new Error("Failed to fetch claims");
    //       }
    //       const claimsData = await claimsResponse.json();
    //       setClaims(claimsData.claims); // Assuming response format is { claims: [...] }
    //       console.log("Fetched Claims Data:", claimsData);

    //     } catch (error) {
    //       console.error("Error fetching admin data:", error);
    //     }
    //   };

    //   fetchAdminData();
    // }, []);

    const handleUserClick = (userId) => {
      console.log("Selected User ID:", userId);
      setSelectedUserId(userId);
    };

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
      
  return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center text-[#0568a6] mb-4">
              Admin Dashboard
              <button
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700"
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
    
              {/* Display Users Table */}
              <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-semibold">User ID</th>
                  <th className="p-2 text-left font-semibold">Name</th>
                  <th className="p-2 text-left font-semibold">Policies</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td 
                      className="p-2 text-blue-500 cursor-pointer underline"
                      onClick={() => setSelectedUserId(user.id || user.userId)}
                    >
                      {user.id || user.userId || "No ID"}
                    </td>
                    <td className="p-2">{user.name || "No Name"}</td>
                    <td className="p-2">
                      {user.policies?.length > 0 ? user.policies.map(p => p.policyType).join(", ") : "No policies"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


            </div>
    
            {/* Show Selected User Policies */}
            {/* Show Selected User Policies */}
            {selectedUserId && (
            <div className="mt-6 bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold text-[#0568a6] mb-2">
                Policies for User ID: {selectedUserId}
              </h3>
              <ul>
                {users
                  .find(user => user.id === selectedUserId)
                  ?.policies?.map((policy, index) => (
                    <li key={index} className="border p-2 rounded-md my-2 bg-gray-100">
                      {policy.policyNumber} - {policy.policyType}
                    </li>
                ))}
              </ul>
            </div>
          )}


          </div>
        </div>
      );
    
      // {/* Claims Management Section */}
      // <div className="bg-gray-100 p-4 rounded-md mt-6">
      //   <h3 className="text-lg font-semibold text-[#0568a6] mb-2">Claims Management</h3>

      //   <table className="min-w-full bg-white border border-gray-200">
      //     <thead>
      //       <tr className="border-b">
      //         <th className="p-2 text-left font-semibold">Claim ID</th>
      //         <th className="p-2 text-left font-semibold">User ID</th>
      //         <th className="p-2 text-left font-semibold">Policy Type</th>
      //         <th className="p-2 text-left font-semibold">Amount</th>
      //         <th className="p-2 text-left font-semibold">Status</th>
      //         <th className="p-2 text-left font-semibold">Actions</th>
      //       </tr>
      //     </thead>
      //     <tbody>
      //       {claims
      //         .filter(claim => claim.status === "pending")
      //         .map((claim, index) => (
      //           <tr key={index} className="border-b">
      //             <td className="p-2">{claim.claimId}</td>
      //             <td className="p-2">{claim.policyholderId}</td>
      //             <td className="p-2">{claim.policyType || "Unknown"}</td>
      //             <td className="p-2">${claim.claimAmount}</td>
      //             <td className="p-2">
      //               <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md">
      //                 {claim.status}
      //               </span>
      //             </td>
      //             <td className="p-2">
      //               <button
      //                 className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-600"
      //                 onClick={() => handleApprove(claim.claimId)}
      //               >
      //                 Approve
      //               </button>
      //               <button
      //                 className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
      //                 onClick={() => handleReject(claim.claimId)}
      //               >
      //                 Reject
      //               </button>
      //             </td>
      //           </tr>
      //       ))}
      //     </tbody>
      //   </table>
      // </div>
    }
    
    