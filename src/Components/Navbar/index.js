import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './index.css';
import { Button } from './Button';

function Navbar() {
    //initial state of this const is fas fa-bars
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    //this will handle the switch between fas fa-times and fas fa-bars
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    }

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener('resize', showButton);
    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    {/*title + logo in the navbar*/}
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        BLM-Ontario <i className='fas fa-thumbs-up' />
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars '} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link
                                to="/"
                                className='nav-links'
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link
                                to="/add-business"
                                className='nav-links'
                                onClick={closeMobileMenu}
                            >
                                Add a Business
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/location-serach'
                                className='nav-links-mobile'
                                onClick={closeMobileMenu}
                            >
                                Find a Business
                            </Link>
                        </li>
                    </ul>
                    {button && <Button buttonStyle='btn--outline'>Find a Business</Button>}
                </div>
            </nav>
        </>
    )
}

export default Navbar
