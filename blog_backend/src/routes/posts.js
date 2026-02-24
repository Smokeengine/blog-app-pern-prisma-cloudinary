const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();

// CREATE post (protected) 
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        image,
        authorId: req.user.userid
      }
    });
    
    res.json({
      message: 'Post created successfully',
      post: newPost
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all posts (public)
router.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          
          }
        }
      },
      orderBy: {
        createdAt: 'desc'  // Newest first
      }
    });
    
    res.json({
      message: 'Posts fetched successfully',
      count: posts.length,
      posts
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single post (public)
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;  // From URL!
    
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!post) {
      return res.status(404).json({ 
        error: "Post not found" 
      });
    }
    
    res.json({
      message: 'Post fetched successfully',
      post
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE post (protected, only author)
router.put('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;  
    const { title, content } = req.body;  // From body
    
    // Find the post
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });
    
    // Check if exists
    if (!post) {
      return res.status(404).json({ 
        error: "Post not found" 
      });
    }
    
    // Check if user owns this post
    if (post.authorId !== req.user.userid) {
      return res.status(403).json({ 
        error: "You can only update your own posts" 
      });
    }
    
    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content
      }
    });
    
    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE post (protected, only author)
router.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;  // From URL!
    
    // Find the post
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });
    
    // Check if exists
    if (!post) {
      return res.status(404).json({ 
        error: "Post not found" 
      });
    }
    
    // Check if user owns this post
    if (post.authorId !== req.user.userid) {
      return res.status(403).json({ 
        error: "You can only delete your own posts" 
      });
    }
    
    // Delete the post
    await prisma.post.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({
      message: 'Post deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;