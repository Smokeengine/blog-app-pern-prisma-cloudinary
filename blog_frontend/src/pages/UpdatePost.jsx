import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';


const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/posts/${id}`);
        const postData = response.data.post;
        
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setPreview(postData.image);
        
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.response.data)
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  // Upload new image to Cloudinary
  const UploadImage = async (imagedata) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/upload`,
        { image: imagedata },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Upload response:', response.data);
      return response.data.url;  // ✅ Return the URL!
      
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.error || 'Image upload failed');
    }
  };

  // Handle image selection
  const HandleImage = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5 MB");
        return;  // ✅ Stop if too large
      }
      
      setError("");  // Clear previous errors
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update post
  const handleUpdate = async () => {
    // Validation
    if (!title || !content) {
      setError("Title and content are required!");
      return;  // ✅ Stop here!
    }
    
    try {
      setUpdating(true);
      setError("");
      
      
      let imageURL = post.image;  
      
 
      if (newImage) {
        try {
          imageURL = await UploadImage(newImage); 
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setError('Image upload failed');
          setUpdating(false);
          return;
        }
      }
      
      // Update post
      const response = await axios.put(  
        `${API_URL}/api/posts/${id}`,
        {
          title,
          content,
          image: imageURL  
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Post updated:', response.data);
      alert('Post updated successfully!');
      navigate(`/posts/${id}`);  
      
    } catch (error) {
      console.error('Update error:', error);
      setError(error.response?.data?.error || 'Failed to update post');
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div>

        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl italic">Loading...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !post) {
    return (
      <div>

        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>

      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            Update Your Post
          </h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Edit the title of your post"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Content
              </label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Edit the content of your post"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
       
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Cover Photo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={HandleImage}  
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            
      
            {preview && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Preview:
                </label>
                <img
                  src={preview}
                  alt={title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
            
            <button
              type="button"
              onClick={handleUpdate}  
              disabled={updating}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updating ? 'Updating Post...' : 'Update Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;