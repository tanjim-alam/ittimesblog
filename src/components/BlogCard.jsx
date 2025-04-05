import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/BlogCard.css";

const BlogCard = ({blog}) => {

  return (
    <div className="blog-list">
        <div className="blog-card" key={blog.id}>
          <img src={blog.image} alt={blog.title} className="blog-image" />
          <div className="blog-content">
            <span className='blogTitle'>{blog.title.substring(0, 25)}..</span>
            <p>{blog.description?.replace(/<[^>]+>/g, '').substring(0, 80)}...</p>
            <Link to={`/blog/${blog.id}`} className="read-more">Read More →</Link>
          </div>
        </div>
    </div>
  );
};

export default BlogCard;
