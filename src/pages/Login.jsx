import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css"; // Ensure you have this file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email }));
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message); // or setError(error.message) if using state
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
