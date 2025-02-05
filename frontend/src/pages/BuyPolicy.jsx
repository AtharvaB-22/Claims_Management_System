import { useState } from "react";

export default function BuyPolicy() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [userPolicies, setUserPolicies] = useState([]);

  // Predefined Policies
  const policies = [
    { name: "Health Insurance", coverage: "Rs 50000000", price: "Rs 3500/month" },
    { name: "Vehicle Insurance", coverage: "Rs 335000", price: "Rs 200/month" },
    { name: "Home Insurance", coverage: "Rs 11000000", price: "Rs 400/month" },
    { name: "Life Insurance", coverage: "Rs 5000000", price: "Rs 350/month" }
  ];

  const handleBuyPolicy = () => {
    if (!selectedPolicy) {
      alert("Please select a policy to buy.");
      return;
    }

    setUserPolicies((prev) => [...prev, selectedPolicy]);
    alert(`You have successfully purchased: ${selectedPolicy.name}`);
    setSelectedPolicy(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-[#0568a6] mb-4">
          Buy a New Policy
        </h2>

        {/* Policy Selection */}
        <select
          className="p-2 border rounded w-full mb-4"
          onChange={(e) =>
            setSelectedPolicy(policies.find((p) => p.name === e.target.value))
          }
        >
          <option value="">Select a Policy</option>
          {policies.map((policy) => (
            <option key={policy.name} value={policy.name}>
              {policy.name} - {policy.coverage} - {policy.price}
            </option>
          ))}
        </select>

        <button
          onClick={handleBuyPolicy}
          className="w-full bg-[#0568a6] text-white p-2 rounded hover:bg-[#045a8d]"
        >
          Buy Policy
        </button>

        {/* Display Purchased Policies */}
        {userPolicies.length > 0 && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Your Policies</h3>
            <ul>
              {userPolicies.map((policy, index) => (
                <li key={index} className="text-gray-700">
                  ✅ {policy.name} - {policy.coverage} - {policy.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
