const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true,"Please Enter UserName "],
  },
  userEmail: {
    type: String,
    required: [true,"Please Enter User Email "],
  },
  userPassword: {
    type: String,
    required: [true,"Please Enter Password "],
  },
  userCity: {
    type: String,
    required: [true,"Please Enter  City "],
  },
  userState: {
    type: String,
    required: [true,"Please Enter State"],
  },
  phoneNum: {
    type: Number,
    required: [true,"Please Enter Phone/Mobile Number "],
  },
  // profilePic: [{
  //   type: String,
  //   // required: [false,"Please Add profile pic "],
  // }],
  userRole:{
    type:String,
    default:"client",
},
assignedProjects: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Project' 
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
});
userSchema.set("timestamps", true);

module.exports = mongoose.model("userData", userSchema);
