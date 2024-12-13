const cloudinary = require("cloudinary").v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dox7foksm",
  api_key: "778985742841332",
  api_secret: "1u8UjZ-EEirNfrDHGsertL5CctE",
});

module.exports = cloudinary;
