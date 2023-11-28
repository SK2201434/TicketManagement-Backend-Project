const userSchema = require("../models/userSchema");
const ProjectSchema = require("../models/projectSchema");
const taskSchema = require("../models/taskSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const couldinary = require("../services/couldinary");
const { unlinkSync } = require("fs");
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


// signup api 
const signUp = async (req, res) => {

  const registerData = new userSchema(req.body);
  try {
    const isUserExists = await userSchema.findOne({
      userEmail: req.body.userEmail,
    });
    if (isUserExists) {
      req.file ? unlinkSync(req.file.path) : null // Delete multer unnecessary uploaded photo
      res.status(409).json({
        success: false,
        message: "User is already existed with this email",
      });
    } else {
      // if (req.file !== undefined) {
        const result = await couldinary.uploader.upload(req.file.path, {
          public_id: `${registerData._id}_${Date.now()}_ProfilePIC`,
        });
        registerData.profilePic = result.url;
      // }
      registerData.userPassword = await bcrypt.hash(req.body.userPassword, 10);

      const user = await registerData.save();

      localStorage.setItem("userId",user._id)
      // console.log(localStorage.getItem("userId"));

      res.status(201).json({
        success: true,
        message: "Registered successfully",
        data: user,
        // userId: user._id
      });
   
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      Error: `Error occur ${error.stack}`,
    });
  }
};
//--------------------
// const signUpasAdmin = async (req, res) => {
//   const registerData = new userSchema(req.body);
  
//   try {
//     const isUserExists = await userSchema.findOne({
//       userEmail: req.body.userEmail,
//     });

//     if (isUserExists) {
//       res.status(409).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     } else {
//       const { userPassword } = req.body;
      
//       if (!userPassword) {
//         res.status(400).json({
//           success: false,
//           message: "Password is required",
//         });
//         return;
//       }

//       registerData.userPassword = await bcrypt.hash(userPassword, 10);
//       const user = await registerData.save();

    
//       res.status(201).json({
//         success: true,
//         message: "Registered successfully",
//         data: user,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       Error: `Error occurred: ${error.message}`,
//     });
//   }
// };


// user login API
const userLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body
  try {
      const userData = await userSchema.findOne({ userEmail: userEmail})
      if (!userData) {
          return res.status(400).json({
              success: false,
              message: "Email id not found"
          })
      } else {
          const passwordMatch = await bcrypt.compare(userPassword, userData.userPassword)
          if (userData && passwordMatch) {
              const token = jwt.sign({ userId: userData._id }, process.env.JWT, { expiresIn: "5d" })
              return res.status(200).json({
                  success: true,
                  message: "Login successfully",
                  token: token,
                  userId: userData._id
              })
          } else {
              return res.status(401).json({
                  success: false,
                  message: "Invalid email or password"
              })
          }
      }
  } catch (err) {
      return res.status(500).json({
          success: false,
          error: err.message
      })
  }
}


// user adminlogin API
const adminLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body
  try {
      const userData = await userSchema.findOne({ userEmail: userEmail})
      if (!userData) {
          return res.status(400).json({
              success: false,
              message: "Email id not found"
          })
      } else {
          const passwordMatch = await bcrypt.compare(userPassword, userData.userPassword)
          if (userData && passwordMatch) {
              // const token = jwt.sign({ userId: userData._id }, process.env.JWT, { expiresIn: "5d" })
              return res.status(200).json({
                  success: true,
                  message: "Login successfully",
                  // token: token,
                  userId: userData._id
              })
          } else {
              return res.status(401).json({
                  success: false,
                  message: "Invalid email or password"
              })
          }
      }
  } catch (err) {
      return res.status(500).json({
          success: false,
          error: err.message
      })
  }
}

// get all user list 
const allUsersList = async(req,res)=>{
  try {
    const allUsers = await userSchema.find();
    if (allUsers) {
      res.status(200).json({
        success:true,
        message:"all user list listed  below",
        userList: allUsers
      })
    } else {
      res.status(404)({
        success: false,
        message: "no user found"
    })
    }
  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    })
  }
}

// get user by there name
const getUserByName = async (req,res)=>{
  try {
    const {userName} = req.params
    const allsimillarName = await userSchema.find({userName});
    if (allsimillarName) {
      res.status(200).json({
        success:true,
        message: "all users with this name",
        usernameList:allsimillarName
      })
    } else {
      res.status(404)({
        success:false,
        message:"no user found with this name "
      })
    }
    
  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    })
  }
} 
// const { _id } = req.params;
//     const userClient = await userSchema.findById({ _id })
//     console.log(userClient);

// get userclient details by id
const getuserClientbyId = async (req, res) =>{
  
  // console.log(_id);

  try {
    const { _id } = req.params;
    const userClient = await userSchema.findById({ _id })
    // console.log(userClient);
  const clientEmail = userClient.userEmail

    const allProject = await ProjectSchema.find({ clientEmail }).populate("project_tasks");
    for (let i = 0; i < allProject.length; i++) {
      const allTasks = await taskSchema.find({projectId:allProject[i]._id});  
      Array.prototype.push.apply(allProject[i].project_tasks, allTasks);  
    }

    if (allProject) {
      res.status(200).json({
        success: true,
        message: "Client projects",
        assignedProjects: allProject,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No projects found for client",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
  
// ==========================
// update client details
const updateUserClientDetails = async (req, res) => {
  try {
    const { _id } = req.params;
    const updateUCDetails = await userSchema.findByIdAndUpdate({ _id },req.body);
    if (updateUCDetails != null) {
      await updateUCDetails.save();
      return res.status(200).json({
        success: true,
        message: "Client details updated successfully",
        updatedDetaisl:updateUCDetails
      });
    } else {
      res.status(404).json({
        success: false,
        message: "no such Client",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ==============================
// delete user/clinet 
const deleteUserClient = async (req, res) => {
  const { _id } = req.params;
  const deteleUserClient = await userSchema.findByIdAndDelete(
    { _id },
    req.body
  );
  try {
    if (deteleUserClient != null) {
      res.status(200).json({
        success: true,
        message: "your client deleted successfully",
        deletedClient:deteleUserClient
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Project not deleted try again",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ====================
const getUserAssignedProjects = async (req, res) => {
  try {
    const userIdd = req.params.userId; // Assuming you have middleware to extract the user ID from the token
     const projects= await ProjectSchema.find({userId:userIdd});
   
    if (projects) {
      res.status(200).json({
        success: true,
        message: "Assigned projects for the user",
        assignedProjects: projects,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ==========================================

module.exports = {
  signUp,
  userLogin,
  adminLogin,
  allUsersList,
  getuserClientbyId,
  getUserByName,
  updateUserClientDetails,
  deleteUserClient,
  getUserAssignedProjects,

};
