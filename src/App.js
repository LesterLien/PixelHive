import './styles/App.css';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import Navigator from './components/Navigator';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <NavBar />
        <div className="content">
          <Navigator />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
