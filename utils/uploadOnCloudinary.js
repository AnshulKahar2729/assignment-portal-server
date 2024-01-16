const cloudinary = require("cloudinary").v2;
const upload = require("../utils/multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (buffer) => {
  try {
    console.log("BEFORE file path");
    if (!buffer) {
      return null;
    }

    console.log("AFTER file path");

    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ err });
      }

      await cloudinary.uploader
        .upload_stream(
          {
            // cloudinary options
          },
          async (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error });
            } else{
                const URL = result.secure_url;
                return URL;
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
