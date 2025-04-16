import '../styles/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";

function Register(){
  const [username, setUsernameInput] = useState('');
  const [password, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

      try {
        const response = await axios.post('http://localhost:8000/register', {
          username,
          password,
        });

        if (response.status === 200) {
          navigate('/login'); 
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
      <div className="registerPage-page-container">
      <div className="registerPage-login-box">
        <div className="registerPage-login-form-section">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="registerPage-form-group">
              <label htmlFor="username">Name</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => {
                  setUsernameInput(event.target.value);
                  setErrorMessage('');
                }}
              />
            </div>

            <div className="registerPage-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPasswordInput(event.target.value)
                  setErrorMessage('');
                }}
              />
            </div>

            <button type="submit" className="registerPage-submit-button">Register</button>
          </form>

          {errorMessage && (
              <p className="registerPage-error-message">{errorMessage}</p>
          )}

          <div className="registerPage-signup-link">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;