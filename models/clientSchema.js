const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true,"Please Enter UserName "],
  },
  clientEmail: {
    type: String,
    required: [true,"Please Enter User Email "],
  },
  phoneNum: {
    type: Number,
    required: [true,"Please Enter Phone/Mobile Number "],
  },
  clientCompanyName: {
    type: String,
    required: [true,"Please Enter Client Company Name "],
  },
  clientCompanyAddress: {
    type: String,
    required: [true,"Please Enter Client Company address "],
  },
  userRole:{
    type:String,
    default:"client",
}, 
  isActive: {
    type: Boolean,
    default: true,
  },
});
clientSchema.set("timestamps", true);

module.exports = mongoose.model("clientData", clientSchema);
