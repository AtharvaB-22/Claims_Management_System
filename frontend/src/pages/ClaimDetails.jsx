
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function ClaimDetails() {
  const [formData, setFormData] = useState({
    policyId: "",
    claimAmount: "",
    reason: "",
    documents: null,
  });

  const [policies, setPolicies] = useState([]); // Store user policies
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Error messages
  const [claimAmount, setClaimAmount] = useState("");
  const [reason, setReason] = useState("");
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch Policies for the logged-in user
  useEffect(() => {
    const fetchPolicies = async () => {
      if (!userId) {
        console.log("Invalid User Id");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/policies/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setPolicies(data);
        } else {
          console.error("Failed to fetch policies");
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchPolicies();
  }, [userId, navigate]);

  // Handling Policy Selection
  const handlePolicyChange = (e) => {
    const selectedPolicyId = e.target.value;
    setFormData((prevData) => ({ ...prevData, policyId: selectedPolicyId }));

    // Find the selected policy and store it
    const foundPolicy = policies.find(
      (policy) => policy.policyId === parseInt(selectedPolicyId)
    );
    setSelectedPolicy(foundPolicy || null);
  };

  // Handle Claim Amount and Reason Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "claimAmount" && selectedPolicy) {
      const claimValue = parseFloat(value);
      if (claimValue > selectedPolicy.coverageAmount) {
        setErrorMessage(
          `Claim amount cannot exceed coverage limit: ${selectedPolicy.coverageAmount}`
        );
        return;
      }
      if (claimValue <= 0) {
        setErrorMessage("Claim amount must be greater than Rs 0.");
        return;
      }
    }

    setErrorMessage(""); // Reset errors
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle File Uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSupportingDocuments(files);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation Checks
    if (!formData.policyId) {
      setErrorMessage("Please select a policy.");
      return;
    }
    if (!formData.claimAmount || parseFloat(formData.claimAmount) <= 0) {
      setErrorMessage("Enter a valid claim amount greater than Rs0.");
      return;
    }
    if (!formData.reason.trim()) {
      setErrorMessage("Please enter a reason for your claim.");
      return;
    }
    if (supportingDocuments.length === 0) {
      setErrorMessage("Please upload at least one supporting document.");
      return;
    }
  
    // Generate new Claim ID
    const newClaimId = Date.now(); // Ensures a unique claim ID
  
    // Prepare claimData for submission
    const claimData = {
      claimId: newClaimId,
      policyId: parseInt(formData.policyId),
      policyholderId: parseInt(userId), // Ensure correct number format
      claimAmount: parseFloat(formData.claimAmount), // Ensure numeric value
      status: "pending",
      supportingDocuments: supportingDocuments.map((file) => file.name),
    };
  
    console.log("Submitting Claim:", claimData); // Debugging
  
    try {
      const response = await fetch(`${API_BASE_URL}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`, // Uncomment if needed
        },
        body: JSON.stringify(claimData),
      });
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
  
      if (response.ok) {
        alert("Claim submitted successfully!");
        navigate("/dashboard");
      } else {
        alert(`Failed to submit claim: ${responseData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("An error occurred. Please try again.");
    }
  };


return (
  <div className="container mx-auto p-6">
    <h2 className="text-2xl font-bold text-center">File a Claim</h2>
    {errorMessage && (
      <p className="text-red-500 text-center mb-4">{errorMessage}</p>
    )}
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      {/* Policy Selection */}
      <label className="block mb-2">Policy:</label>
      <select
        name="policyId"
        value={formData.policyId}
        onChange={handlePolicyChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select a Policy</option>
        {policies.map((policy) => (
          <option key={policy.policyId} value={policy.policyId}>
            {policy.policyType} (Coverage: Rs{policy.coverageAmount})
          </option>
        ))}
      </select>

      {/* Claim Amount */}
      <label className="block mt-4 mb-2">Claim Amount:</label>
      <input
        type="number"
        name="claimAmount"
        value={formData.claimAmount}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Reason for Claim */}
      <label className="block mt-4 mb-2">Reason for Claim:</label>
      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      ></textarea>

      {/* Upload Supporting Documents */}
      <label className="block mt-4 mb-2">Upload Supporting Documents:</label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full border p-2 rounded"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit Claim
      </button>
    </form>
  </div>
);
}