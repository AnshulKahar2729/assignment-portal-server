import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

export const uploadOnCloudinary = async(localFilePath) => {
    try{

        if(!localFilePath){
            return null;
        }

        const res = await cloudinary.uploader.upload(localFilePath, {
            folder: 'submittedAssignment',
            resource_type: 'auto'
        });

        // if file is uploaded on cloudinary then delete it from file system
        fs.unlinkSync(localFilePath);
        return res.secure_url;
    }catch(error){
        console.log(error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}