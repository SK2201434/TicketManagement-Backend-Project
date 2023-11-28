// const assetSchema = require("./assetsSchema");

// module.exports = {
//     uploadAssetsValidation: async (req, res, next) => {
//     const value = await assetSchema.uploadAssets.validate(req.body);
//     if (value.error) {
//       res.json({
//         success: false,
//         message: value.error.details[0].message,
//       });
//     } else {
//       next();
//     }
//   },
//   logInValidation: async (req, res, next) => {
//     const value = await userSchema.login.validate(req.body);
//     if (value.error) {
//       res.json({
//         success: false,
//         message: value.error.details[0].message,
//       });
//     } else {
//       next();
//     }
//   },
  
// };
