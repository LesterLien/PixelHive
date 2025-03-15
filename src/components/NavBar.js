
import { Container } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import '../styles/NavBar.css';
import { BsFillPersonFill } from "react-icons/bs";

function NavBar() {
    return (
        <Navbar expand="lg" className="navbar">
        <Container>
            <Navbar.Brand href="#home">PixelHive</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
            <Nav className="me-auto nav-text">
                <Nav.Link href="#games">Games</Nav.Link>
                <Nav.Link href="#favorites">Favorites</Nav.Link>
                <Nav.Link href="#wishlist">Wishlist</Nav.Link>
            </Nav>
            <Nav className="ms-auto user"><BsFillPersonFill className='icon'/>
                    <NavDropdown title="User" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#login" >Login</NavDropdown.Item>
                        <NavDropdown.Item href="#account">Account</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#contact">Contact Us</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default NavBar;