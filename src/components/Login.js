import '../styles/Login.css';
import logo from '../assets/images/logo.webp';

function Login() {
  return (
    <div className="loginPage-page-container">
      <div className="loginPage-login-box">
        <div className="loginPage-login-form-section">
          <h2>Login</h2>
          <form>
            <div className="loginPage-form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>

            <div className="loginPage-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>

            <button type="submit" className="loginPage-submit-button">Sign in</button>
          </form>

          <div className="loginPage-signup-link">
            <p>Don't have an account? <a href="/register">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
