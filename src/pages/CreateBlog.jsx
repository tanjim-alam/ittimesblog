import React, { useMemo, useRef, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import "../styles/CreateBlog.css";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dh4cehlzj/image/upload";
const UPLOAD_PRESET = "myblog";

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const editor1 = useRef(null);

  const config1 = useMemo(() => ({
    readonly: false,
    placeholder: "Start typing...",
    height: 600,
  }), []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !description || !image) return alert('All fields are required');
    try {
      setLoading(true);
      const uploadedImageUrl = await handleImageUpload(image);
      await addDoc(collection(db, 'blogs'), {
        title,
        description,
        image: uploadedImageUrl,
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorEmail: user.email,
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container1">
      <h2 className="form-title">Create New Blog</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Title</label>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <JoditEditor
          ref={editor1}
          config={config1}
          tabIndex={1}
          value={description}
          onBlur={() => {
            const content = editor1.current?.editor?.getHTML();
            setDescription(content);
          }}
        />

        <label>Image File</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          required
        />

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
