const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

//Creating the comment
router.post('/posts/:postId/comments', authMiddleware, async (req,res)=>{
    try {
        const {postId} = req.params;
        const {content} = req.body;
        if(!content){
            return res.status(400).json({
                message:'comment not found!'
            })
        }
        const post = await prisma.post.findUnique({
            where:{id: parseInt(postId)}
        })
        if(!post){
            return res.status(400).json({
                message: ' post not found!'
            })
        }
        const new_comment = await prisma.comment.create({
            data:{
                postId:parseInt(postId),
                content,
                authorId: req.user.userid
            },
            include:{
                author:{
                    select:{
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })
        res.json({
            message: 'comment created',
            comment: new_comment
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// getting all the comments on a posr
router.get('/posts/:postId/comments', async (req,res)=>{
    try {
        const {postId} = req.params;
        const all_comments = await prisma.comment.findMany({
            where: {postId: parseInt(postId)},
            include:{
                author:{
                    select:{
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'  
              }
        })
       
        res.json({
            message: 'fetched comments success',
            count: all_comments.length,
            all_comments
        })
    } catch (error) {
        res.status(404).json({message:'comments not found!'})
    }
})

//updating the comment
router.put('/comments/:id', authMiddleware, async (req,res)=>{
    try {
        const {id} = req.params;
        const {content} = req.body;
        const comment = await prisma.comment.findUnique({
            where:{id:parseInt(id)}
        })
        if(!comment){
            return res.status(404).json({message:'comment not found!'})
        }
        if(comment.authorId!== req.user.userid){
            return res.status(403).json({message:"you can't edit the comment!"})
        }
        const updated_comment = await prisma.comment.update({
            where:{id: parseInt(id)},
            data:{
                content:content,
            }
        })
        res.json({message:'comment updated successfully!',
            comment:updated_comment
        })
    } catch (error) {
        res.status(404).json({error:error.message})
    }
})

router.delete('/comments/:id', authMiddleware, async (req,res)=>{
        try {
            const {id} = req.params;
            const comment = await prisma.comment.findUnique({
                where:{id: parseInt(id)}
            })
            if(!comment){
                return res.status(404).json({message:' comment not found!'})
            }
            if(comment.authorId !== req.user.userid){
                return res.status(403).json({
                    message: " you can't delete the comment!"
                })
            }
            await prisma.comment.delete({
                where: {
                    id: parseInt(id)
                }
            })
            res.json({
                message: ' comment successfully deleted!'
            })
        } catch (error) {
            res.status(404).json({
                error:error.message
            })
        }
})
module.exports = router;