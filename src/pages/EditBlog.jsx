import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import JoditEditor from 'jodit-react';
import imageCompression from 'browser-image-compression';
import "../styles/CreateBlog.css";

const EditBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef(null);

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

  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Update blog content...",
    height: 400,
  }), []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const blogRef = doc(db, 'blogs', id);
      await updateDoc(blogRef, { ...blog });
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true
      });

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "myblog"); // <-- Replace with your Cloudinary preset

      const res = await fetch("https://api.cloudinary.com/v1_1/dh4cehlzj/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setBlog(prev => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return blog ? (
    <div className="form-container1">
      <h2 className="form-title">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Title</label>
        <input
          type="text"
          value={blog.title}
          onChange={e => setBlog({ ...blog, title: e.target.value })}
          required
        />

        <label>Description</label>
        <JoditEditor
          ref={editorRef}
          config={config}
          value={blog.description}
          onBlur={() => {
            const content = editorRef.current?.editor?.getHTML();
            setBlog(prev => ({ ...prev, description: content }));
          }}
        />

        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {uploading && <p style={{ color: 'blue' }}>Uploading image...</p>}
        {blog.image && (
          <img
            src={blog.image}
            alt="Uploaded preview"
            style={{ maxWidth: "100%", marginTop: "10px", borderRadius: "8px" }}
          />
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={uploading || loading}
        >
          {loading ? "Updating..." : uploading ? "Uploading image..." : "Update"}
        </button>
      </form>
    </div>
  ) : (
    <div className="loader-container">
      <div className="loader" />
      <p>Loading blog...</p>
    </div>
  );
};

export default EditBlog;
