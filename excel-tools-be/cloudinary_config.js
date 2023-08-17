require('dotenv').config() //.config will look for the .env file and load all the var inside into the runtime environment. runtime env is contained in process.env
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
  });
  
  // Log the configuration
//   console.log(cloudinary.config());

module.exports = {cloudinary}