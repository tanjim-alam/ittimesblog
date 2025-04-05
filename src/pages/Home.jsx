import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import BlogCard from '../components/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogs } from '../redux/blogSlice';
import "../styles/Home.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const blogsList = useSelector(state => state.blog.blogs);
  const fetchBlogs = async () => {
    const blogRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogRef);
    const blogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    dispatch(setBlogs(blogs));
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">All Blogs</h1>
      {loading ? (
        <div className="loader-container">
          <div className="loader" />
          <p>Loading blogs...</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogsList && blogsList.map((blog,i)=><BlogCard key={i} blog={blog} />)}
        </div>
      )}
    </div>
  );
};

export default Home;
