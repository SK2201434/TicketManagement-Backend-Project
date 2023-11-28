const assetsSchema = require("../models/assetsSchema");
const cloudinary = require("../services/couldinary");
const multer = require('multer');
// const path = require('path')

const uploadAssets = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    if (req.file.size >= 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "File size exceeds the 5MB limit",
      });
    }

    const assetsData = new assetsSchema(req.body);

    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${assetsData._id}_${Date.now()}_assetFiles`,
    });
    assetsData.asset_files = result.url;

    const assets = await assetsData.save();

    res.status(201).json({
      success: true,
      message: "Asset uploaded successfully",
      data: assets,
    });
  } catch (error) {
    console.log(error.message);
    const errorMessage = error.message || error.stack;
    return res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

module.exports = {
  uploadAssets,
};