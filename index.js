const express = require("express");
const { 
    createUser, getUsers, getUserByID, updateUser, deleteUser, users 
} = require("./entities");
const { 
    createPolicyholder, policyholders,getPolicyholders,updatePolicyholder,deletePolicyholder,getPolicyholderById
 } = require("./entities"); // imports policyholder functions
const { 
    createPolicy, policies,getPolicies,getPolicyById,updatePolicy,deletePolicy 
} = require("./entities"); 
const { 
    createClaim, claims,getClaimById,getClaims,updateClaim,deleteClaim 
} = require("./entities");
const { 
    createDocument, supportingDocuments,getSupportingDocuments,getSupportingDocumentById,
updateSupportingDocument,deleteSupportingDocument } = require("./entities");
const { reviewClaim } = require("./entities");

const app = express();
const PORT = 3000;

app.use(express.json()); // Allows handling JSON data in requests

app.get("/", (req, res) => {
    const user1 = createUser(1, "AB", "ab@gmail.com", "policyholder");
    const user2 = createUser(2, "TB", "tb@gmail.com", "admin");
    
    const policyholder1 = createPolicyholder(1, user1.id, "9876543210", "Noida");
    const policyholder2 = createPolicyholder(2, user2.id, "8765432109", "G.Noida");

    const policy1 = createPolicy(1, policyholder1.id, "Health", 50000, 500);
    const policy2 = createPolicy(2, policyholder2.id, "Vehicle", 100000, 700);

    const claim1 = createClaim(1, policy1.id, 10000, "pending");
    const claim2 = createClaim(2, policy2.id, 20000, "approved");

    const document1 = createDocument(1, claim1.id, "Medical Report", "http://example.com/report1.pdf");
    const document2 = createDocument(2, claim2.id, "Accident Proof", "http://example.com/proof2.jpg");

    // const allUsers = getUsers();
    // const foundUser=(2);
    // const updatedUser=updateUser(1, { name:"Atharva"});
    // const deletedUser=deleteUser(2);

    // const allPolicyholders = getPolicyholders();
    // const foundPolicyholder = getPolicyholderById(1);
    // const updatedPolicyholder = updatePolicyholder(1, { address: "Gurgaon" });
    // const deletedPolicyholder = deletePolicyholder(2);

    // const allPolicies=getPolicies();
    // const foundPolicy = getPolicyById(1);
    // const updatedPolicy = updatePolicy(1, { coverageAmount: 75000 });
    // const deletedPolicy = deletePolicy(2);

    // const allClaims = getClaims();
    // const foundClaim = getClaimById(1);
    // const updatedClaim = updateClaim(1, { status: "approved" });
    // const deletedClaim = deleteClaim(2);
    // console.log(claims);

    // const allDocuments = getSupportingDocuments();
    // const foundDocument = getSupportingDocumentById(1);
    // const updatedDocument = updateSupportingDocument(1, { documentUrl: "http://example.com/updated_report1.pdf" });
    // const deletedDocument = deleteSupportingDocument(2);

    const adminReview = reviewClaim(user2.id, claim1.id, "approved");



    // console.log(users);
    // console.log(policyholders);
    // console.log(policies);
    // console.log(claims);
    // console.log(supportingDocuments);

    res.json({
        message: "CRUD operations tested!",
        adminReview
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
