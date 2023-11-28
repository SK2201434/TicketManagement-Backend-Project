const userRouter = require("express").Router();
const upload = require('../middleware/multer')
const user = require("../controllers/userController");
const validate = require('../validator/userValidate/userValidate')
const { isUser, isAdmin, isClient, isAdminAndUser } = require('../middleware/authorization')

userRouter.post("/signup", user.signUp);
userRouter.post("/adminlogin", user.adminLogin);
userRouter.post("/userlogin", user.userLogin);
userRouter.get("/alluserlist/:userRole?",isAdmin, user.allUsersList);
userRouter.get("/userbyname/:userName/:userRole?", isAdmin,user.getUserByName);
userRouter.get("/userclinetdetails/:_id/:userRole?", isClient,user.getuserClientbyId);
userRouter.patch("/updateuserclinetdetails/:_id/:userRole?", isClient,user.updateUserClientDetails);
userRouter.delete("/deleteuserclinet/:_id/:userRole?", isClient,user.deleteUserClient);
// In your user route
userRouter.get('/assignedprojects/:uid',  user.getUserAssignedProjects);
// userRouter.get("/userclients/:emailId/:userRole?", isClient, user.getUserClientProjects);

module.exports = userRouter;












// upload.single('profilePic'),