import './styles/App.css';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import Navigator from './components/Navigator';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <Navigator/>
    <Footer/>
    </BrowserRouter>
  );
}

export default App;
