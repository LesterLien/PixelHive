import '../styles/Register.css';
import { Link } from 'react-router-dom';

function Register(){
    return (
        <div className="registerPage-page-container">
          <div className="registerPage-login-box">
            <div className="registerPage-login-form-section">
              <h2>Register</h2>
              <form>
                <div className="registerPage-form-group">
                  <label htmlFor="username">Name</label>
                  <input type="username" id="username" placeholder="Enter your username" />
                </div>
    
                <div className="registerPage-form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" placeholder="Enter your password" />
                </div>
    
                <button type="submit" className="registerPage-submit-button">Register</button>
              </form>
    
              <div className="registerPage-signup-link">
                <p>Already have an account? <Link to="/login">Sign in</Link></p>
              </div>
            </div>
          </div>
        </div>
      );
    }
export default Register;