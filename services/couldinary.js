const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: 'dsfpejlzy', 
  api_key: '526659874374834', 
  api_secret: 'CNdCtllvGDDpJRooOZNymWhd7cs'
});

module.exports = cloudinary;
 
