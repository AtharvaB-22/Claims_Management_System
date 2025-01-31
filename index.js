const express = require("express");
const connectDB = require('./config/db');
connectDB();
const User = require('./models/User');
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
    const user3=createUser(3,"HB","ab@gmail.com","admin");
    
    const policyholder1 = createPolicyholder(1, user1.id, "9876543210", "Noida");
    const policyholder2 = createPolicyholder(2, user2.id, "8765432109", "G.Noida");
    const invalidpolicyholder=createPolicyholder(3,3,"1234567890","K");

    const policy1 = createPolicy(1, policyholder1.id, "Health", 50000, 500);
    const policy2 = createPolicy(2, policyholder2.id, "Vehicle", 100000, 700);
    const invalidPolicyholderPolicy = createPolicy(2, 999, "Vehicle", 100000, 700);
    const invalidCoveragePolicy = createPolicy(3, policyholder1.id, "Health", 0, 500);

    const claim1 = createClaim(1, policy1.id, 10000, "pending");
    const claim2 = createClaim(2, policy2.id, 20000, "approved");
    const invalidPolicyClaim = createClaim(2, 999, 20000, "pending");
    const excessiveAmountClaim = createClaim(3, policy1.id, 60000, "pending");

    const document1 = createDocument(1, claim1.id, "Medical Report", "http://example.com/report1.pdf");
    const document2 = createDocument(2, claim2.id, "Accident Proof", "http://example.com/proof2.jpg");
    const invalidClaimDocument = createDocument(2, 999, "Accident Proof", "http://example.com/proof.jpg");
    const invalidFileTypeDocument = createDocument(3, claim1.id, "Medical Report", "http://example.com/report.docx");


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
        message: "Documnet Validation Tested!",
        document1,
        document2,
        invalidClaimDocument,
        invalidFileTypeDocument
    });
});

app.get("/users", (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({ message: "No users found." });
    }
    return res.status(200).json(users);
});
app.post("/users", (req, res) => {
    const { id, name, email, role } = req.body;

    // Validate required fields
    if (!id || !name || !email || !role) {
        return res.status(400).json({ error: "All fields (id, name, email, role) are required." });
    }

    // Create user
    const result = createUser(id, name, email, role);

    // If there's an error (e.g., duplicate email), return error response
    if (typeof result === "string") {
        return res.status(400).json({ error: result });
    }

    return res.status(201).json({ message: "User created successfully!", user: result });
});
// Get users api by id 
app.get("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id); // Convert ID to integer
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
});

app.put("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id); // Convert ID to integer
    const { name, email } = req.body;

    // Find the user
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Validate input
    if (!name && !email) {
        return res.status(400).json({ message: "At least one field (name or email) is required for update." });
    }

    // Check for duplicate email
    if (email && users.some(u => u.email === email && u.id !== userId)) {
        return res.status(400).json({ message: "Email already in use by another user." });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;

    return res.status(200).json({ message: "User updated successfully!", user });
});

//delete user
app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id); // Convert ID to integer
    
    // Find user index
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found." });
    }

    // Remove user from the array
    users.splice(userIndex, 1);

    return res.status(200).json({ message: "User deleted successfully!" });
});

app.post("/policyholders", (req, res) => {
    const { id, name, email, policyNumber } = req.body;

    // Validate required fields
    if (!id || !name || !email || !policyNumber) {
        return res.status(400).json({ message: "All fields (id, name, email, policyNumber) are required." });
    }

    // Check if policyholder already exists
    if (policyholders.some(p => p.id === id)) {
        return res.status(400).json({ message: "Policyholder ID already exists." });
    }

    // Create and store the policyholder
    const newPolicyholder = { id, name, email, policyNumber };
    policyholders.push(newPolicyholder);

    return res.status(201).json({ message: "Policyholder created successfully!", policyholder: newPolicyholder });
});

app.get("/policyholders", (req, res) => {
    if (policyholders.length === 0) {
        return res.status(404).json({ message: "No policyholders found." });
    }
    return res.status(200).json(policyholders);
});

app.get("/policyholders/:id", (req, res) => {
    const policyholderId = parseInt(req.params.id); // Convert ID to integer
    const policyholder = policyholders.find(p => p.id === policyholderId);

    if (!policyholder) {
        return res.status(404).json({ message: "Policyholder not found." });
    }

    return res.status(200).json(policyholder);
});

app.put("/policyholders/:id", (req, res) => {
    const policyholderId = parseInt(req.params.id); // Convert ID to integer
    const { name, email, policyNumber } = req.body;

    // Find the policyholder
    const policyholder = policyholders.find(p => p.id === policyholderId);
    if (!policyholder) {
        return res.status(404).json({ message: "Policyholder not found." });
    }

    // Validate input
    if (!name && !email && !policyNumber) {
        return res.status(400).json({ message: "At least one field (name, email, or policyNumber) is required for update." });
    }

    // Check for duplicate email
    if (email && policyholders.some(p => p.email === email && p.id !== policyholderId)) {
        return res.status(400).json({ message: "Email already in use by another policyholder." });
    }

    // Update policyholder details
    if (name) policyholder.name = name;
    if (email) policyholder.email = email;
    if (policyNumber) policyholder.policyNumber = policyNumber;

    return res.status(200).json({ message: "Policyholder updated successfully!", policyholder });
});

app.delete("/policyholders/:id", (req, res) => {
    const policyholderId = parseInt(req.params.id); // Convert ID to integer
    
    // Find policyholder index
    const policyholderIndex = policyholders.findIndex(p => p.id === policyholderId);
    
    if (policyholderIndex === -1) {
        return res.status(404).json({ message: "Policyholder not found." });
    }

    // Remove policyholder from the array
    policyholders.splice(policyholderIndex, 1);

    return res.status(200).json({ message: "Policyholder deleted successfully!" });
});


app.post("/policies", (req, res) => {
    const { id, policyholderId, type, coverageAmount, premium } = req.body;

    // Validate required fields
    if (!id || !policyholderId || !type || !coverageAmount || !premium) {
        return res.status(400).json({ message: "All fields (id, policyholderId, type, coverageAmount, premium) are required." });
    }

    // Check if policy already exists
    if (policies.some(p => p.id === id)) {
        return res.status(400).json({ message: "Policy ID already exists." });
    }

    // Create and store the policy
    const newPolicy = { id, policyholderId, type, coverageAmount, premium };
    policies.push(newPolicy);

    return res.status(201).json({ message: "Policy created successfully!", policy: newPolicy });
});

app.get("/policies", (req, res) => {
    if (policies.length === 0) {
        return res.status(404).json({ message: "No policies found." });
    }
    return res.status(200).json(policies);
});

app.get("/policies/:id", (req, res) => {
    const policyId = parseInt(req.params.id); // Convert ID to integer
    const policy = policies.find(p => p.id === policyId);

    if (!policy) {
        return res.status(404).json({ message: "Policy not found." });
    }

    return res.status(200).json(policy);
});

app.put("/policies/:id", (req, res) => {
    const policyId = parseInt(req.params.id); // Convert ID to integer
    const { type, coverageAmount, premium } = req.body;

    // Find the policy
    const policy = policies.find(p => p.id === policyId);
    if (!policy) {
        return res.status(404).json({ message: "Policy not found." });
    }

    // Validate input
    if (!type && !coverageAmount && !premium) {
        return res.status(400).json({ message: "At least one field (type, coverageAmount, or premium) is required for update." });
    }

    // Update policy details
    if (type) policy.type = type;
    if (coverageAmount) policy.coverageAmount = coverageAmount;
    if (premium) policy.premium = premium;

    return res.status(200).json({ message: "Policy updated successfully!", policy });
});

app.delete("/policies/:id", (req, res) => {
    const policyId = parseInt(req.params.id); // Convert ID to integer

    // Find the index of the policy
    const policyIndex = policies.findIndex(p => p.id === policyId);

    if (policyIndex === -1) {
        return res.status(404).json({ message: "Policy not found." });
    }

    // Remove the policy from the array
    const deletedPolicy = policies.splice(policyIndex, 1)[0];

    return res.status(200).json({ 
        message: "Policy deleted successfully!",
        deletedPolicy
    });
});

app.post("/claims", (req, res) => {
    const { id, policyId, status, amount, description } = req.body;

    // Validate required fields
    if (!id || !policyId || !status || !amount || !description) {
        return res.status(400).json({ message: "All fields (id, policyId, status, amount, description) are required." });
    }

    // Check if claim already exists
    if (claims.some(c => c.id === id)) {
        return res.status(400).json({ message: "Claim ID already exists." });
    }

    // Create and store the claim
    const newClaim = { id, policyId, status, amount, description };
    claims.push(newClaim);

    return res.status(201).json({ message: "Claim created successfully!", claim: newClaim });
});

app.get("/claims", (req, res) => {
    if (claims.length === 0) {
        return res.status(404).json({ message: "No claims found." });
    }
    return res.status(200).json(claims);
});

app.get("/claims/:id", (req, res) => {
    const claimId = parseInt(req.params.id); // Convert ID to integer
    const claim = claims.find(c => c.id === claimId);

    if (!claim) {
        return res.status(404).json({ message: "Claim not found." });
    }

    return res.status(200).json(claim);
});

app.put("/claims/:id", (req, res) => {
    const claimId = parseInt(req.params.id); // Convert ID to integer
    const { status, amount, description } = req.body;

    // Find the claim
    const claim = claims.find(c => c.id === claimId);
    if (!claim) {
        return res.status(404).json({ message: "Claim not found." });
    }

    // Validate input
    if (!status && !amount && !description) {
        return res.status(400).json({ message: "At least one field (status, amount, or description) is required for update." });
    }

    // Update claim details
    if (status) claim.status = status;
    if (amount) claim.amount = amount;
    if (description) claim.description = description;

    return res.status(200).json({ message: "Claim updated successfully!", claim });
});

app.delete("/claims/:id", (req, res) => {
    const claimId = parseInt(req.params.id); // Convert ID to integer

    // Find claim index
    const claimIndex = claims.findIndex(c => c.id === claimId);
    if (claimIndex === -1) {
        return res.status(404).json({ message: "Claim not found." });
    }

    // Remove claim from the array
    const deletedClaim = claims.splice(claimIndex, 1)[0];

    return res.status(200).json({ 
        message: "Claim deleted successfully!",
        deletedClaim
    });
});


const documents = []; // In-memory storage for documents

app.post("/documents", (req, res) => {
    const { id, claimId, type, filename, url } = req.body;

    // Validate required fields
    if (!id || !claimId || !type || !filename || !url) {
        return res.status(400).json({ message: "All fields (id, claimId, type, filename, url) are required." });
    }

    // Check if document already exists
    if (documents.some(d => d.id === id)) {
        return res.status(400).json({ message: "Document ID already exists." });
    }

    // Create and store the document
    const newDocument = { id, claimId, type, filename, url };
    documents.push(newDocument);

    return res.status(201).json({ message: "Document uploaded successfully!", document: newDocument });
});

app.get("/documents", (req, res) => {
    if (documents.length === 0) {
        return res.status(404).json({ message: "No documents found." });
    }
    return res.status(200).json(documents);
});

app.get("/documents/:id", (req, res) => {
    const documentId = parseInt(req.params.id); // Convert ID to integer
    const document = documents.find(d => d.id === documentId);

    if (!document) {
        return res.status(404).json({ message: "Document not found." });
    }

    return res.status(200).json(document);
});

app.put("/documents/:id", (req, res) => {
    const documentId = parseInt(req.params.id); // Convert ID to integer
    const { type, filename, url } = req.body;

    // Find the document
    const document = documents.find(d => d.id === documentId);
    if (!document) {
        return res.status(404).json({ message: "Document not found." });
    }

    // Validate input
    if (!type && !filename && !url) {
        return res.status(400).json({ message: "At least one field (type, filename, or url) is required for update." });
    }

    // Update document details
    if (type) document.type = type;
    if (filename) document.filename = filename;
    if (url) document.url = url;

    return res.status(200).json({ message: "Document updated successfully!", document });
});

app.delete("/documents/:id", (req, res) => {
    const documentId = parseInt(req.params.id); // Convert ID to integer

    // Find document index
    const documentIndex = documents.findIndex(d => d.id === documentId);
    if (documentIndex === -1) {
        return res.status(404).json({ message: "Document not found." });
    }

    // Remove document from the array
    const deletedDocument = documents.splice(documentIndex, 1)[0];

    return res.status(200).json({ 
        message: "Document deleted successfully!",
        deletedDocument
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
