import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import '../styles/NavBar.css';
import { BsFillPersonFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.webp';
import { useState, useEffect } from 'react';
import axios from 'axios';

function NavBar({ username, setUsername }) {

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
    
        try {
            await axios.delete('http://localhost:8000/logout', {
                data: { token: refreshToken },
            });
    
            localStorage.removeItem('username');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUsername(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    
    return (
        <Navbar className="navbar">
            <Navbar.Brand as={Link} to="/" className="me-auto">
            <img src={logo} alt="PixelHive Logo" className="logo" />
            PixelHive
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="nav-text">
                    <Nav.Link as={Link} to="/games">Games</Nav.Link>
                    <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
                </Nav>
                <Nav className='nav-dropdown-other'>
                    <NavDropdown title="Other" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/shops">Shops</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/contact">Contact Us</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="ms-auto nav-dropdown-user"><BsFillPersonFill className='icon'/>
                    <NavDropdown title={username || "User"} id="basic-nav-dropdown">
                    {!username ? (
                            <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                        ) : (
                            <>
                                <NavDropdown.Item as={Link} to="/account">Account</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/wishlist">Wishlist</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </>
                        )}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;