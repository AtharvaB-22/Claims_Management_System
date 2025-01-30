const express = require("express");
const { 
    createUser, getUsers, getUserByID, updateUser, deleteUser, users 
} = require("./entities");
const { createPolicyholder, policyholders } = require("./entities"); // imports policyholder functions
const { createPolicy, policies } = require("./entities"); 
const { createClaim, claims } = require("./entities");
const { createDocument, supportingDocuments } = require("./entities");

const app = express();
const PORT = 3000;

app.use(express.json()); // Allows handling JSON data in requests

app.get("/", (req, res) => {
    const user1 = createUser(1, "AB", "ab@gmail.com", "policyholder");
    const user2 = createUser(2, "TB", "tb@gmail.com", "admin");
    // const newPolicyholder=createPolicyholder(1,newUser.id,"9999999999","1 A.street");
    // const newPolicy = createPolicy(1, newPolicyholder.id, "health", 5000, 200000, "active");
    // const newClaim = createClaim(1, newPolicyholder.id, newPolicy.id, 15000, "2025-01-30", "pending", "Under Review");
    // const newDocument = createDocument(1, newClaim.id, "medical_report", "http://example.com/document.pdf");

    const allUsers = getUsers();
    const foundUser=(2);
    const updatedUser=updateUser(1, { name:"Atharva"});
    const deletedUser=deleteUser(2);

    console.log(users);
    console.log(policyholders);
    console.log(policies);
    console.log(claims);
    console.log(supportingDocuments);

    res.json({
        message: "CRUD operations tested!",
        allUsers,
        foundUser,
        updatedUser,
        deletedUser
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
