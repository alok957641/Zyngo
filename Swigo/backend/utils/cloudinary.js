const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const uploadoncloudinary = async (file) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
        const result = await cloudinary.uploader.upload(file)
        fs.unlinkSync(file)
         console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME); // Apna variable name use karna
        return result.secure_url;
    } catch (error) {
        fs.unlinkSync(file)
        console.log(error)
    }
}


module.exports = uploadoncloudinary;