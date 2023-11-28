const clientRouter = require("express").Router();
// const upload = require('../middleware/multer')
const client = require("../controllers/clientController");
const { isUser, isAdmin, isClient, isAdminAndUser } = require('../middleware/authorization')



clientRouter.post("/addclient/:userRole?",isAdmin, client.addClient);
clientRouter.get("/allclientlist/:userRole?",isAdmin, client.getAllClients);
clientRouter.get("/getclientdetails/:_id/:userRole?",isAdmin, client.getClientbyId);
clientRouter.patch('/updateclient/:_id/:userRole?', isAdmin, client.updateClientDetails)
clientRouter.delete('/deleteclient/:_id/:userRole?', isAdmin, client.deleteClient)
clientRouter.get("/clients/:emailId/:userRole?", isClient, client.getClientProjects);
clientRouter.get("/getclientprojectsbyid/:_id/:userRole?", isClient, client.getClientProjectsByClientId);
module.exports = clientRouter;
