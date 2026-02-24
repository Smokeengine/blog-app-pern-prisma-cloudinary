const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma =new PrismaClient();

router.post('/user/register', async (req,res)=>{
    try {
        const {email, name, password} = req.body;
        if (!email || !name || !password){
            return res.status(400).json({
                message: 'all feilds are required'
            })
        }
        const existing_user = await prisma.user.findUnique({
            where: {email}
        })
        if(existing_user){
            return res.status(400).json({
                message: "email id already exists"
            })
        }
        const salt = await bcrypt.genSalt(12)
        const hash = await bcrypt.hash(password,salt)
        const new_user = await prisma.user.create({
            data:{
                name:name,
                password:hash,
                email:email
            }
        })
        res.json({
            message:'user has been created',
            userId:new_user.id
        })
       
    } catch (error) {
        res.status(400).json({
            error:error.message
        })
    }
})

module.exports = router;