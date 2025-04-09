import '../styles/Register.css';

function Register(){
    return (
        <div className="registerPage-page-container">
          <div className="registerPage-login-box">
            <div className="registerPage-login-form-section">
              <h2>Register</h2>
              <form>
                <div className="registerPage-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="Enter your email" />
                </div>
    
                <div className="registerPage-form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" placeholder="Enter your password" />
                </div>
    
                <button type="submit" className="registerPage-submit-button">Register</button>
              </form>
    
              <div className="registerPage-signup-link">
                <p>Already have an account? <a href="/login">Sign in</a></p>
              </div>
            </div>
          </div>
        </div>
      );
    }
export default Register;