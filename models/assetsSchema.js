const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({

 
    asset_files: {
    type: String,
    required: [true,"Please Enter Asset "],

  }

});

assetSchema.set("timestamps", true);
module.exports = mongoose.model("assets", assetSchema);
