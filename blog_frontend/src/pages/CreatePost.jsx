import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const HandleImage = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate size
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5 mb');
        return;
      }
      
      setError("");  // Clear error if valid
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (imageData) => {
    const response = await axios.post('http://localhost:4000/api/upload', {
      image: imageData
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.url;
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // ✅ FIX: Clear old errors first!
    
    // Validate
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if exists
      if (image) {
        try {
          imageUrl = await uploadImage(image);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setError('Image upload failed');
          setLoading(false);
          return;
        }
      }
      
      // Create post
      const result = await axios.post('http://localhost:4000/api/posts', {
        title,
        content,
        image: imageUrl
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Post created!', result.data);
      navigate('/');  // Redirect to home
      
    } catch (error) {
      console.error('Post creation error:', error);
      setError(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <form onSubmit={HandleSubmit} className="space-y-4">
        <Input 
          type="text"
          placeholder="Enter the title of your post"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />

        <textarea
          placeholder="Enter the content of your post"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          required
          rows="10"
          className="w-full p-3 border rounded-lg"
        />

        {error && (
          <div className="text-red-500 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-2 font-semibold">
            Cover Image (Optional)
          </label>
          <input 
            type="file" 
            accept="image/*"
            onChange={HandleImage}
            className="w-full"
          />
        </div>

        {previewImage && (
          <div>
            <label className="block mb-2 font-semibold">Preview:</label>
            <img 
              src={previewImage} 
              alt="preview"
              className="max-w-md rounded-lg shadow-lg"
            />
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded p-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;