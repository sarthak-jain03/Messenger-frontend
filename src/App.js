import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from './redux/userSlice'; // Import your actions
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if there's a token in localStorage when the app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Dispatch the token to Redux store
      dispatch(setToken(token));

      // Fetch user data based on the token (you can create a route to verify user)
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        dispatch(setUser(response.data));
      })
      .catch(() => {
        // If token is invalid, clear token from localStorage
        localStorage.removeItem('token');
        dispatch(setToken(''));
        navigate('/email');
      });
    } else {
      // If no token, navigate to the email screen (login)
      navigate('/email');
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
