import './styles/App.css';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import Navigator from './components/Navigator';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username'));
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <NavBar username={username} setUsername={setUsername} />
        <div className="content">
          <Navigator setUsername={setUsername} />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
