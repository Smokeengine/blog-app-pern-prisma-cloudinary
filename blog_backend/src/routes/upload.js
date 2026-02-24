const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth');

router.post('/upload', authMiddleware, async (req,res) => {
    try {
        const {image} = req.body;
        if(!image){
            return res.status(400).json({
                message: 'Image required!'
            })
        }
        const response = await cloudinary.uploader.upload(image, {
            folder: 'blog_pics',
            resource_type: 'auto'
        })
        res.status(200).json({
            message: 'Image uploaded successfully!',
            url: response.secure_url
        })
    } catch (error) {
        console.log('upload error: ', error )
        res.status(500).json({
            message: 'Image upload had failed!'
        })
    }
})
module.exports = router;      