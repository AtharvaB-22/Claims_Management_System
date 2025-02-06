import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function BuyPolicy() {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/policies/19`);
        if (!response.ok) {
          throw new Error("Failed to fetch policies");
        }
        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };
    fetchPolicies();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const handleBackToDashboard = () => {
    navigate("/dashboard");
};

    const handleBuyPolicy = async (policy) => {
      if (!policy) {
          alert("Error: Policy data is missing.");
          return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
          alert("User not logged in");
          navigate("/");
          return;
      }

  try {
      // 🟢 **Step 1: Fetch User’s Existing Policies**
      const userPoliciesResponse = await fetch(`${API_BASE_URL}/policies/${userId}`);
      const userPolicies = await userPoliciesResponse.json();

      // 🟢 **Step 2: Check if the User Already Owns the Policy**
      const alreadyOwned = userPolicies.some(existingPolicy => existingPolicy.policyType === policy.policyType);
      
      if (alreadyOwned) {
          alert("You already own this policy and cannot buy it again.");
          return; // Stop execution
      }

      // 🟢 **Step 3: Manually Assign Unique Policy ID**
      const newPolicyId = Math.floor(1000 + Math.random() * 9000);
      const newPolicyNumber = `POL${newPolicyId}`;

      const newPolicy = {
          policyId: newPolicyId,
          policyNumber: newPolicyNumber,
          policyType: policy.policyType,
          coverageAmount: policy.coverageAmount,
          premium: policy.premium,
          policyholderId: parseInt(userId)
      };

      console.log("🚀 Submitting Policy:", newPolicy);

      // 🟢 **Step 4: Submit Policy Purchase**
      const response = await fetch(`${API_BASE_URL}/policies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPolicy),
      });

      const responseData = await response.json();
      console.log("📡 API Response:", responseData);

      if (response.ok) {
          alert("Policy bought successfully!");
          navigate("/dashboard");
      } else {
          alert(`Failed to buy policy: ${responseData.message || "Unknown error"}`);
      }
  } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold text-[#0568a6] mb-6">Available Policies
      <button 
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700"
                onClick={handleLogout}
              >
              Logout
          </button>
      {/* Back to Dashboard Button */}
      {/* Back to Dashboard Button */}
      <button
                className="absolute top-1 left-4 mt-6 bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600"
                onClick={handleBackToDashboard}
            >
                Dashboard
            </button>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.length === 0 ? (
          <p className="text-gray-600">No policies available.</p>
        ) : (
          policies.map((policy) => (
            <div key={policy.policyId} className="bg-white p-4 rounded-lg shadow-md w-72">
              <h3 className="font-bold text-lg">{policy.policyType}</h3>
              <p className="text-gray-700">Coverage: ${policy.coverageAmount}</p>
              <p className="text-gray-700">Premium: ${policy.premium}</p>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleBuyPolicy(policy)}
              >
                Buy Policy
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


