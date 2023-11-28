const assestsRouter = require("express").Router();
const upload = require('../middleware/multer')
const assests = require("../controllers/assets");
const { isUser, isAdmin, isClient } = require('../middleware/authorization')


const fileSizeLimitErrorHandler = (err, req, res, next) => {
    if (err) {
      res.status(400).json({
      success:false,  
      Error:`Invalid file or file size has exceeded it max limit of 5MB, Please Try Again!!`
      })
    } else {
      next()
    }
  }

assestsRouter.post("/upload/:userRole?", isClient ,upload.single('asset_files'),fileSizeLimitErrorHandler, assests.uploadAssets);

module.exports = assestsRouter;
