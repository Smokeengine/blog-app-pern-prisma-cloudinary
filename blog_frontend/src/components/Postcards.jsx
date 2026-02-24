import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({post}) => {
  const navigate = useNavigate();

  
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
    }
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    if (diffDays < 7) {
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => navigate(`/posts/${post.id}`)}
      className='bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group'
    >
      {/* Image */}
      {post.image && (
        <div className='overflow-hidden'>
          <img 
            src={post.image} 
            alt={post.title}
            className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>
      )}

      {/* Content */}
      <div className='p-6'>
        {/* Title */}
        <h2 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors'>
          {post.title}
        </h2>

        {/* Content Preview */}
        <p className='text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed'>
          {post.content}
        </p>

        {/* Meta Info */}
        <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
          <div className='flex items-center text-sm'>
            {/* Author Avatar (optional) */}
            <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3'>
              {post.author.name.charAt(0)}
            </div>
            
            <div>
              <p className='font-semibold text-gray-700'>
                {post.author.name}
              </p>
              <p className='text-xs text-gray-500'>
                {formatRelativeDate(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Read More Arrow */}
          <svg 
            className='w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all' 
            fill='none' 
            stroke='currentColor' 
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PostCard;