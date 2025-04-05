import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {doc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import "../styles/userDashboard.css"
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const navigate = useNavigate()
  const { authorId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  const fetchBlogs = async () => {
    try {
      const q = query(
        collection(db, 'blogs'),
        where('authorId', '==', authorId)
      );
      const snapshot = await getDocs(q);
      const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching author blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [authorId]);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete")){
      await deleteDoc(doc(db, 'blogs', id));
      fetchBlogs();
    }
    };

  if (loading) return <div className="loader-container">
          <div className="loader" />
          <p>Loading blogs...</p>
        </div>;
  return (
    <div className='dashboardContainer'>
      <div className="author-page">
      <div className='userDashboardHeader'>
      <h2>Blog List</h2>
      <Link to={"/create"} className='btn'>Add Blog</Link>
      </div>
      <div className='' style={{paddingTop: "10px"}}>
      {blogs.length === 0 ? (
        <p>No blogs by this author yet.</p>
      ) : (
        <div className="blog-list1">
          {blogs.map(blog => (
            <div key={blog.id} className="blog-card1">
              <div className='dashbordCardTop'>
              <img src={blog.image} alt={blog.title} className="blog-cover1" />
              <h1 style={{fontSize: "18px", color:"black"}}>{blog.title.slice(0, 25)}...</h1>
              </div>
              <div className='btnBox1'>
                <Link to={`/edit/${blog.id}`} style={{width: "100%", backgroundColor: "green", padding: "0.5rem 1rem", border:"none", textDecoration: "none", color:"white", textAlign:"center", fontSize: "13px"}}>Edit</Link>
                <button 
                style={{width: "100%", backgroundColor: "red", padding: "0.5rem 1rem", border:"none", textDecoration: "none", color:"white", textAlign:"center", fontSize: "13px", cursor: "pointer"}}
                onClick={()=>handleDelete(blog.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
    </div>
  );
};

export default UserDashboard;
