import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import "../styles/BlogDetails.css";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  
  useEffect(() => {
    const fetchBlog = async () => {
      const blogRef = doc(db, 'blogs', id);
      const blogSnap = await getDoc(blogRef);
      if (blogSnap.exists()) {
        setBlog(blogSnap.data());
      }
    };
    fetchBlog();
  }, [id]);

  return blog ? (
    <div className="blog-detail-container">
      <img src={blog.image} alt={blog.title} className="blog-image" />
      <h2 className="blog-title">{blog.title}</h2>
      <div
        className="blog-description"
        dangerouslySetInnerHTML={{ __html: blog.description }}
      />
    
    </div>
  ) : (
    <div className="loader-container">
          <div className="loader" />
          <p>Loading blogs...</p>
    </div>
  );
};

export default BlogDetails;
