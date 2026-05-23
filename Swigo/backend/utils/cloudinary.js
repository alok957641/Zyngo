const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary config yahan rahega...

const uploadOnCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(error);
                }
            }
        );
        // Buffer ko stream mein convert karke upload karo
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

module.exports = uploadOnCloudinary;