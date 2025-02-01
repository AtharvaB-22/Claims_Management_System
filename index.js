const express = require("express");
const connectDB = require('./config/db');
connectDB();
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const User = require('./models/User');
const Policy = require('./models/Policy');
const Claim=require('./models/Claim');
const SupportingDocument = require('./models/SupportingDocument');  // Ensure correct path


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


app.post('/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Find the highest userId and increment it
        const lastUser = await User.findOne().sort({ userId: -1 });

        // Ensure that lastUser exists before incrementing
        const newUserId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;

        // Check if newUserId is valid
        if (isNaN(newUserId)) {
            return res.status(500).json({ error: "Failed to generate userId" });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user with the generated userId
        const newUser = new User({
            userId: newUserId,
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error("Error in User Registration:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});
// await bcrypt.genSalt(10);	Generates a salt for hashing the password.
// await bcrypt.hash(password, salt);	Encrypts the password before saving.
// Get users api by id 
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from MongoDB
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id }); // Fetch using userId

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.id }, // Find by userId
            req.body, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userId: req.params.id });

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

app.get('/policyholders', async (req, res) => {
    try {
        // Find all users where role is 'policyholder'
        const policyholders = await User.find({ role: "policyholder" }).select("-password");
        
        // Return the list of policyholders
        res.status(200).json(policyholders);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get('/policyholders/:id', async (req, res) => {
    try {
        // Find a policyholder by userId where role is "policyholder"
        const policyholder = await User.findOne({ userId: req.params.id, role: "policyholder" }).select("-password");

        // If no policyholder is found, return 404
        if (!policyholder) {
            return res.status(404).json({ error: "Policyholder not found" });
        }

        // Return the policyholder details
        res.status(200).json(policyholder);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.put('/policyholders/:id', async (req, res) => {
    try {
        // Find and update the policyholder by userId
        const policyholder = await User.findOneAndUpdate(
            { userId: req.params.id, role: "policyholder" },  // Find by userId and role
            { $set: req.body },  // Update fields from request body
            { new: true, runValidators: true }  // Return updated document & enforce validations
        );

        // If no policyholder is found, return 404
        if (!policyholder) {
            return res.status(404).json({ error: "Policyholder not found" });
        }

        // Return updated policyholder details
        res.status(200).json(policyholder);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.delete('/policyholders/:id', async (req, res) => {
    try {
        // Find and delete the policyholder by userId
        const policyholder = await User.findOneAndDelete({ userId: req.params.id, role: "policyholder" });

        // If no policyholder is found, return 404
        if (!policyholder) {
            return res.status(404).json({ error: "Policyholder not found" });
        }

        // Return success message
        res.status(200).json({ message: "Policyholder deleted successfully" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});



app.post("/policies", async (req, res) => {
    try {
        const { policyId, policyNumber, policyType, coverageAmount, premium, policyholderId } = req.body;

        // Check if Users model is correctly imported
        if (!User) {
            return res.status(500).json({ error: "User model is not properly imported" });
        }

        // Check if the provided policyholderId exists in Users and has role 'policyholder'
        const policyholder = await User.findOne({ userId: policyholderId, role: "policyholder" });
        if (!policyholder) {
            return res.status(400).json({ error: "Policyholder with this ID does not exist or is not a policyholder" });
        }

        // Create a new policy
        const newPolicy = new Policy({
            policyId,
            policyNumber,
            policyType,
            coverageAmount,
            premium,
            policyholderId, // Store the custom ID, not MongoDB's ObjectId
        });

        await newPolicy.save();
        res.status(201).json({ message: "Policy created successfully", policy: newPolicy });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.get("/policies", async (req, res) => {
    try {
        const policies = await Policy.find();
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/policies/:id", async (req, res) => {
    try {
        const policy = await Policy.findOne({ policyId: req.params.id });

        if (!policy) {
            return res.status(404).json({ error: "Policy not found" });
        }

        res.status(200).json(policy);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.put("/policies/:id", async (req, res) => {
    try {
        const updatedPolicy = await Policy.findOneAndUpdate(
            { policyId: req.params.id },  // Find policy by custom policyId
            req.body,  // Update fields based on request body
            { new: true, runValidators: true } // Return updated document
        );

        if (!updatedPolicy) {
            return res.status(404).json({ error: "Policy not found" });
        }

        res.status(200).json(updatedPolicy);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.delete("/policies/:id", async (req, res) => {
    try {
        const deletedPolicy = await Policy.findOneAndDelete({ policyId: req.params.id });

        if (!deletedPolicy) {
            return res.status(404).json({ error: "Policy not found" });
        }

        res.status(200).json({ message: "Policy deleted successfully", deletedPolicy });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.post("/claims", async (req, res) => {
    try {
        const { claimId, policyId, policyholderId, claimAmount, status, supportingDocuments } = req.body;

        // Check if the policy exists using our custom numeric ID
        const existingPolicy = await Policy.findOne({ policyId: policyId });
        if (!existingPolicy) {
            return res.status(404).json({ error: "Policy not found" });
        }

        // Check if the policyholder exists using our custom numeric ID
        const existingPolicyholder = await User.findOne({ userId: policyholderId, role: "policyholder" });
        if (!existingPolicyholder) {
            return res.status(404).json({ error: "Policyholder not found" });
        }

        const newClaim = new Claim({
            claimId,
            policyId,
            policyholderId,
            claimAmount,
            status: status || "pending",
            supportingDocuments: supportingDocuments || []
        });

        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/claims", async (req, res) => {
    try {
        const claims = await Claim.find();
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/claims/:claimId", async (req, res) => {
    try {
        const claimId = parseInt(req.params.claimId);
        const claim = await Claim.findOne({ claimId: claimId });

        if (!claim) {
            return res.status(404).json({ error: "Claim not found" });
        }

        res.status(200).json(claim);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Update a Claim by custom claimId
app.put("/claims/:claimId", async (req, res) => {
    try {
        const { claimId } = req.params;
        const updateData = req.body;

        // Check if claim exists
        const existingClaim = await Claim.findOne({ claimId: parseInt(claimId) });
        if (!existingClaim) {
            return res.status(404).json({ error: "Claim not found" });
        }

        // Update claim details
        const updatedClaim = await Claim.findOneAndUpdate(
            { claimId: parseInt(claimId) },  // Filter
            updateData,                      // Update data
            { new: true }                     // Return updated document
        );

        res.json({ message: "Claim updated successfully", updatedClaim });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Delete a Claim by custom claimId
app.delete("/claims/:claimId", async (req, res) => {
    try {
        const { claimId } = req.params;

        // Check if claim exists
        const existingClaim = await Claim.findOne({ claimId: parseInt(claimId) });
        if (!existingClaim) {
            return res.status(404).json({ error: "Claim not found" });
        }

        // Delete the claim
        await Claim.findOneAndDelete({ claimId: parseInt(claimId) });

        res.json({ message: "Claim deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// Create a new Supporting Document
app.post("/documents", async (req, res) => {
    try {
        const { documentId, claimId, fileName, fileType } = req.body;

        // Check if claim exists
        const existingClaim = await Claim.findOne({ claimId: parseInt(claimId) });
        if (!existingClaim) {
            return res.status(404).json({ error: "Claim not found" });
        }

        // Create new document entry
        const newDocument = new SupportingDocument({
            documentId: parseInt(documentId),
            claimId: parseInt(claimId),
            fileName,
            fileType
        });

        await newDocument.save();

        res.json({ message: "Document uploaded successfully", newDocument });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.get("/documents", async (req, res) => {
    try {
        const { claimId } = req.query;

        let query = {};
        if (claimId) {
            query.claimId = parseInt(claimId);
        }

        const documents = await SupportingDocument.find(query);
        res.json(documents);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get Supporting Document by custom documentId
app.get("/documents/:documentId", async (req, res) => {
    try {
        const documentId = parseInt(req.params.documentId); // Convert to number
        const document = await SupportingDocument.findOne({ documentId });

        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// Update Supporting Document by documentId
app.put("/documents/:documentId", async (req, res) => {
    try {
        const { documentId } = req.params;
        const updateData = req.body;

        // Check if document exists
        const existingDocument = await SupportingDocument.findOne({ documentId: parseInt(documentId) });
        if (!existingDocument) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Update document details
        const updatedDocument = await SupportingDocument.findOneAndUpdate(
            { documentId: parseInt(documentId) },
            updateData,
            { new: true }
        );

        res.json({ message: "Document updated successfully", updatedDocument });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Delete Supporting Document by documentId
app.delete("/documents/:documentId", async (req, res) => {
    try {
        const { documentId } = req.params;

        // Check if document exists
        const existingDocument = await SupportingDocument.findOne({ documentId: parseInt(documentId) });
        if (!existingDocument) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Delete document
        await SupportingDocument.findOneAndDelete({ documentId: parseInt(documentId) });

        res.json({ message: "Document deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
