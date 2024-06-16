import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Ensure you create and import the CSS file

function Navbar() {
    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to="/" className='navbar-logo'>
                        Control
                    </Link>
                    <div className='menu-icon'>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src={`/linkedin-logo.svg`} alt="LinkedIn" className="navbar-icon" />
                        </a>
                        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
                            <img src={`/github-logo.svg`} alt="GitHub" className="navbar-icon" />
                        </a>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
