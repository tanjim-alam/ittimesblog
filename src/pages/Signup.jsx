import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import "../styles/signup.css"; // Make sure this file is imported

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    dispatch(setUser({ uid: userCredential.user.uid, email }));
    navigate('/');
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
