import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import "../styles/navbar.css"; // Make sure to import your CSS

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">ITTimes</Link>
        </div>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to={`/user/${user.uid}`}>Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className='loginBtn'>Login</Link>
              <Link to="/signup" className='signupBtn'>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
