// Home.js
import React, { useEffect, useState } from 'react';
import PostCards from '../components/Postcards';
import axios from 'axios';


const Home = () => {
    const [posts, setPosts] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
  // Dummy data for testing
  useEffect(()=> {
    setLoading(true)
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/posts')
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error)
        setError(error)
      }finally{
        setLoading(false)
      }
    } 
    fetchPosts();
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Latest Posts..
        </h1>
        {error && <div className=' text-lg text-red-300'>{error}</div>}
        {loading && <div className='text-xl italic font-semibold'>Loading...</div>}
        {/* Grid of PostCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCards key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;