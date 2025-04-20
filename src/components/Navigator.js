import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Games from './Games';
import Favorites from './Favorites';
import Login from './Login';
import Shops from './Shops';
import Register from './Register';

function Navigator({ setUsername }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/shops" element={<Shops />} />


      <Route path="/favorites" element={<Favorites />} />



      <Route path="/login" element={<Login setUsername={setUsername} />} />
      <Route path="/register" element={<Register />} />


    </Routes>
  );
}

export default Navigator;
