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

const claims=[];

function createClaim(id,policyholderId,policyId,claimAmt,filedDate,status,claimReview){
    const claim= { id,policyholderId,policyId,claimAmt,filedDate,status,claimReview };
    claims.push(claim);
    return claim;
}// id is unique id, policyholderId is policyholderId,policyId is policyId,claimAmt is amount claimed,
// filedDate-Claim filed date, status is status of claim , claimReview is update about claimReview

const supportingDocuments = [];

function createDocument(id, claimId, documentType, documentURL) {
    const document = { id, claimId, documentType, documentURL };
    supportingDocuments.push(document);
    return document;
}
module.exports = { users, createUser,getUserByID,getUsers,updateUser,deleteUser,
    policyholders,createPolicyholder,getPolicyholders,updatePolicyholder,deletePolicyholder,getPolicyholderById };

