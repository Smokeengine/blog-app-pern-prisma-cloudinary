const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')



router.post('/user/login', async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user_data = await prisma.user.findUnique({
            where: {email},
        });
        if (!user_data){
            return res.status(404).json({
                error: "user not found!"
            })
        }
        const validPassword = await bcrypt.compare(
            password, user_data.password
        )
        if (!validPassword){
            return res.status(401).json({
                error: "Password didn't match"
            })
        }
        const token = jwt.sign({
            
                userid: user_data.id,
                email: user_data.email 
            }, process.env.JWT_SECRET , {expiresIn : '1h'}
        );
        res.json({
            message: "Login successful",
            token: token,
            user:{
            userid: user_data.id,
            name: user_data.name,
            email:user_data.email
            }
        })

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
})

module.exports = router;
