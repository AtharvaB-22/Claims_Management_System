const users = []; 
// Empty array to add users 

// Create
function createUser(id, name, email, role) {
    const user = { id, name, email, role };
    users.push(user);
    return user;
}

//Read
function getUsers() {
    return users;
}

function getUserByID(id){
    return users.find(user => user.id===id)||null;
}

// Update
function updateUser(id, newData) {
    const user = users.find(user => user.id === id);
    if (user) {
        Object.assign(user, newData); // Update fields
        return user;
    }
    return null;
}

// Delete
function deleteUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0]; // Remove user
    }
    return null;
}

const policyholders=[];
//create
function createPolicyholder(id,userid,phone,address){
    const policyholder={ id,userid,phone,address };
    policyholders.push(policyholder);
    return policyholder;
}
// Creates a new policyholder, links it to a User (userId), and adds it to policyholders.
// Returns the newly created policyholder

//read
function getPolicyholders() {
    return policyholders;
}

function getPolicyholderById(id){
    return policyholders.find(policyholder => policyholder.id === id) || null;
}

//Update
function updatePolicyholder(id, newData) {
    const policyholder = policyholders.find(policyholder => policyholder.id === id);
    if (policyholder) {
        Object.assign(policyholder, newData); // Update only provided fields
        return policyholder;
    }
    return null;
}

// Delete
function deletePolicyholder(id) {
    const index = policyholders.findIndex(policyholder => policyholder.id === id);
    if (index !== -1) {
        return policyholders.splice(index, 1)[0]; // Remove policyholder
    }
    return null;
}
const policies=[];

function createPolicy(id,policyholderId,type,premiumAmt,coverageAmt,status){
    const policy={ id,policyholderId,type,premiumAmt,coverageAmt,status };
    policies.push(policy);
    return policy;
}  // id is unique id, policyholderId is policyholderId, type is type of policy,premiumAmt is amt paid by customer
// Coverage amt is the amt covered,status - active or expired
function getPolicies() {
    return policies;
}

function getPolicyById(id) {
    return policies.find(policy => policy.id === id) || null;
}

function updatePolicy(id, newData) {
    const policy = policies.find(policy => policy.id === id);
    if (policy) {
        Object.assign(policy, newData); // Update only provided fields
        return policy;
    }
    return null;
}

function deletePolicy(id) {
    const index = policies.findIndex(policy => policy.id === id);
    if (index !== -1) {
        return policies.splice(index, 1)[0]; // Remove policy
    }
    return null;
}

const claims=[];

function createClaim(id,policyholderId,policyId,claimAmt,filedDate,status,claimReview){
    const claim= { id,policyholderId,policyId,claimAmt,filedDate,status,claimReview };
    claims.push(claim);
    return claim;
}// id is unique id, policyholderId is policyholderId,policyId is policyId,claimAmt is amount claimed,
// filedDate-Claim filed date, status is status of claim , claimReview is update about claimReview

function getClaims() {
    return claims;
}

function getClaimById(id) {
    return claims.find(claim => claim.id === id) || null;
}

function updateClaim(id, newData) {
    const claim = claims.find(claim => claim.id === id);
    if (claim) {
        Object.assign(claim, newData); // Update only provided fields
        return claim;
    }
    return null;
}

function deleteClaim(id) {
    const index = claims.findIndex(claim => claim.id === id);
    if (index !== -1) {
        return claims.splice(index, 1)[0]; // Remove claim
    }
    return null;
}

const supportingDocuments = [];

function createDocument(id, claimId, documentType, documentURL) {
    const document = { id, claimId, documentType, documentURL };
    supportingDocuments.push(document);
    return document;
}

function getSupportingDocuments() {
    return supportingDocuments;
}

function getSupportingDocumentById(id) {
    return supportingDocuments.find(document => document.id === id) || null;
}

function updateSupportingDocument(id, newData) {
    const document = supportingDocuments.find(document => document.id === id);
    if (document) {
        Object.assign(document, newData); // Update only provided fields
        return document;
    }
    return null;
}

function deleteSupportingDocument(id) {
    const index = supportingDocuments.findIndex(document => document.id === id);
    if (index !== -1) {
        return supportingDocuments.splice(index, 1)[0]; // Remove document
    }
    return null;
}

function reviewClaim(adminId, claimId, newStatus) {
    const admin = users.find(user => user.id === adminId && user.role === "admin");
    if (!admin) {
        return "Error: Only admins can review claims.";
    }

    const claim = claims.find(claim => claim.id === claimId);
    if (!claim) {
        return "Error: Claim not found.";
    }

    if (!["approved", "rejected"].includes(newStatus)) {
        return "Error: Invalid status. Must be 'approved' or 'rejected'.";
    }

    claim.status = newStatus;
    return claim;
}

module.exports = { users, createUser,getUserByID,getUsers,updateUser,deleteUser,
    policyholders,createPolicyholder,getPolicyholders,updatePolicyholder,deletePolicyholder,getPolicyholderById,
    policies,createPolicy,getPolicies,getPolicyById,updatePolicy,deletePolicy,
    claims,createClaim,getClaims,getClaimById,updateClaim,deleteClaim,
    supportingDocuments,createDocument,getSupportingDocuments,getSupportingDocumentById,
    updateSupportingDocument,deleteSupportingDocument,
reviewClaim};

