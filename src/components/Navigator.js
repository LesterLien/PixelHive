import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Games from './Games';
import Favorites from './Favorites';
import Wishlist from './Wishlist';
import Login from './Login';
import Account from './Account';
import Shops from './Shops';
import Register from './Register';

function Navigator() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/shops" element={<Shops />} />


      <Route path="/favorites" element={<Favorites />} />
      <Route path="/wishlist" element={<Wishlist />} />



      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />

    </Routes>
  );
}

export default Navigator;
