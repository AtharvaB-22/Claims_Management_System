import { useState } from "react";

export default function ClaimDetails() {
  const [formData, setFormData] = useState({
    policyId: "",
    claimAmount: "",
    reason: "",
    supportingDocuments: [],
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "supportingDocuments") {
      setFormData((prevData) => ({
        ...prevData,
        supportingDocuments: [...prevData.supportingDocuments, e.target.files[0]],
      }));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Claim Data:", formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-[#0568a6] mb-6">
          File a Claim
        </h2>

        {submitted ? (
          <div className="text-green-600 text-center">
            ✅ Claim Submitted Successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Policy ID:</label>
              <input
                type="text"
                name="policyId"
                value={formData.policyId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Claim Amount:</label>
              <input
                type="number"
                name="claimAmount"
                value={formData.claimAmount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Reason for Claim:</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Upload Supporting Documents:</label>
              <input
                type="file"
                name="supportingDocuments"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                accept=".pdf,.jpg,.png"
                multiple
              />
              {formData.supportingDocuments.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {formData.supportingDocuments.length} file(s) selected
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0568a6] text-white p-2 rounded hover:bg-[#045a8d]"
            >
              Submit Claim
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
