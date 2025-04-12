import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";
import logo from '../assets/images/logo.webp';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

      try {
        const response = await axios.post('http://localhost:8000/login', {
          username,
          password,
        });

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userId', response.data.user_id);

        if (response.status === 200) {
          navigate('/'); 
          // console.log("successful");
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('Something went wrong!');
        }
      }
    };


  return (
    <div className="loginPage-page-container">
      <div className="loginPage-login-box">
        <div className="loginPage-login-form-section">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="loginPage-form-group">
              <label htmlFor="username">Name</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setErrorMessage('');
                }}
              />
              </div>

            <div className="loginPage-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrorMessage('');
                }}
              />
              </div>

            <button type="submit" className="loginPage-submit-button">Sign in</button>
          </form>

          {errorMessage && (
              <p className="loginPage-error-message">{errorMessage}</p>
          )}

          <div className="loginPage-signup-link">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
