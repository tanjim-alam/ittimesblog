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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

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

  // Pagination calculations
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogsList.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogsList.length / blogsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0); // scroll to top on page change
  };

  return (
    <div className="home-container">
      <h1 className="home-title">All Blogs</h1>
      {loading ? (
        <div className="loader-container">
          <div className="loader" />
          <p>Loading blogs...</p>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {currentBlogs.map((blog, i) => (
              <BlogCard key={i} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
