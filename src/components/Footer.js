import '../styles/Footer.css';
import { FaRegCopyright } from "react-icons/fa6";

function Footer() {
    return (
        <div className='footerPage-body'>
            <p> <FaRegCopyright className='footerPage-icon-copyright'/> 2025 PixelHive. Built by Lester Lien.</p>
        </div>
    );
}

export default Footer;