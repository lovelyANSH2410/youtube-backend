import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file) => {
    try {
        if(!file){
            throw new Error("No file provided");
        }
        const result = await cloudinary.uploader.upload(file, {
            folder: 'videos',
            resource_type: 'auto',
        });
        console.log('File uploaded successfully', result.url);
        return result;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(file.path); // delete the file from the server
        return null;
    }
}

export default uploadOnCloudinary;

