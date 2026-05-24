const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// ✅ Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Memory buffer se upload karne ka function (Render compatible)
const uploadoncloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "swiddy_shops" }, // optional: folder name in cloudinary
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    console.log("✅ Uploaded to Cloudinary:", result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = uploadoncloudinary;