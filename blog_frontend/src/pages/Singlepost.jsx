import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const SinglePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);  // ✅ For comments LIST
  const [comment, setComment] = useState("");    // ✅ For input TEXT
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setdeleting] = useState(false)

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch post
        const postResponse = await axios.get(`${API_URL}/api/posts/${id}`);
        setPost(postResponse.data.post);
        
        // Fetch comments
        const commentsResponse = await axios.get(`${API_URL}/api/posts/${id}/comments`);
        console.log('Comments response:', commentsResponse.data);
        
        // Handle different response formats
        const commentsData = commentsResponse.data.all_comments || 
                            commentsResponse.data.comments || 
                            [];
        setComments(commentsData);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.error || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostAndComments();
  }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) {
      alert('Please enter a comment!');
      return;
    }
    
    if (!token) {
      alert('Please login to comment!');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await axios.post(
        `${API_URL}/api/posts/${id}/comments`,  // ✅ Fixed URL
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Comment posted:', response.data);
      
      
      setComments([...comments, response.data.comment]);
      
      
      setComment("");
      
    } catch (error) {
      console.error('Comment error:', error);
      alert(error.response?.data?.error || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if(!window.confirm("Are you sure to delete this comment?")){
      return ;
    }
    try {
      setDeleteId(commentId);
      const response = await axios.delete(`${API_URL}/api/comments/${commentId}`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      console.log(response);
      if(response){
        setComments(comments.filter( c=> (c.id !== commentId)));
        alert('Comment deleted successfully!')
      }
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.error || "Failed to delete the comment")
    }finally{
      setDeleteId(null)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>

        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  // No post
  if (!post) {
    return (
      <div>

        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Post not found!</div>
        </div>
      </div>
    );
  }
  const deletePost = async (id) => {
    try {
      if(!window.confirm("Are you sure you want to delete the post!")){
        return;
      }
      setdeleting(true)
      await axios.delete(`${API_URL}/api/posts/${id}`,
        {headers:{
          Authorization: `Bearer ${token}`
        }})
        navigate('/')
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.error || "Failed to Delete the post")
    }finally{
      setdeleting(false)
    }
  }

  const isAuthor = user && post.authorId === user.userid;

  return (
    <div>

      
      <div className="min-h-screen bg-gray-50 p-3">
        <div className="max-w-4xl mx-auto my-10">
          
          {/* Title */}
          <h1 className="mt-10 text-xl lg:text-3xl font-bold text-center">
            {post.title}
          </h1>
          
          {/* Author Info & Menu */}
          <div className="mt-8 mb-10 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                {post.author.name.charAt(0)}
              </div>
              <div className="ml-4 font-semibold">{post.author.name}</div>
            </div>
            
            {!showMenu && (
              <div className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            )}
            
            {isAuthor && (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  {showMenu ? <RxCross2 size={20} /> : <IoMdMenu size={20} />}
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded z-10">
                    <ul className="text-gray-600">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button onClick={()=>navigate(`/update-post/${id}`)}>Update Post</button>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                        <button onClick={()=>deletePost(id)}>{deleting ? 'Deleting...' : 'Delete Post'}</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="border-t mb-4"></div>
          
          {/* Image */}
          {post.image && (
            <div className="flex justify-center my-14">
              <img 
                className="w-full max-w-3xl h-auto rounded-lg shadow-lg" 
                src={post.image} 
                alt={post.title} 
              />
            </div>
          )}
          
          {/* Content */}
          <div className="mt-14 md:leading-loose">
            <p className="text-justify text-gray-700 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
          
          <div className="border-t my-8"></div>
          
          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Comments ({comments.length})
            </h2>
            
            {/* Add Comment Form */}
            {user ? (
              <div className="mb-6">
                <div className="flex gap-3">
                  <textarea 
                    placeholder="Add a comment..." 
                    rows={2} 
                    className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                  />
                  <button 
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 self-start"
                    onClick={handleComment}
                    disabled={submitting || !comment.trim()}
                  >
                    {submitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-gray-600">
                  Please <a href="/login" className="text-blue-600 hover:underline">login</a> to comment
                </p>
              </div>
            )}
            
            {/* Display Comments */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3 p-4 bg-white border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {c.author?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {c.author?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        { user && c.authorId === user.userid && <div>
                          <button className="text-red-500 hover:text-red-700"
                          title="Delete Comment"
                          onClick={()=>handleDeleteComment(c.id)}>{deleteId === c.id ? (  
                            <span className="text-xs animate-pulse">Deleting...</span>
                          ) : (
                            <MdDelete size={18} />
                          )}</button>
                          </div>}
                      </div>
                      <p className="text-gray-700">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;