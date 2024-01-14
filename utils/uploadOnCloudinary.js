const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async(buffer) => {
    try{

        if (!buffer || !Buffer.isBuffer(buffer)) {
            return null;
        }

        const res = await cloudinary.uploader.upload_stream(buffer, {
            resource_type: 'raw',
            type : "authenticated",
        });

        // if file is uploaded on cloudinary then delete it from file system
        // fs.unlinkSync(localFilePath);
        return res.secure_url;
    }catch(error){
        console.log(error);
        return null;
    }
}

