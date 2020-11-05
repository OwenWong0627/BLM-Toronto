import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from '../Button';

/**
 * This component represents the navbar of the web app
 */
function Navbar() {
   const [click, setClick] = useState(false);
   const [button, setButton] = useState((window.innerWidth <= 960) ? false : true);

   /**
    * This function will "flip" the boolean state click, this state basically dictates whether the mobile menu is displayed or not
    * The state will also handle the switch between fas fa-times and fas fa-bars
    */
   const handleClick = () => setClick(!click);
   /**
    * This function will make the boolean state click false, it serves to close the mobile menu once you click on a Link
    */
   const closeMobileMenu = () => setClick(false);

   /**
    * Checks to see if the sceen width is smaller than 960px
    * If yes, then the "desktop" version button will not be displayed
    * If no, then the "desktop" version button will be displayed
    */
   const showButton = () => {
      if (window.innerWidth <= 960) {
         setButton(false);
      } else {
         setButton(true);
      }
   }

   useEffect(() => {
      window.addEventListener('resize', showButton);
      return () => { window.removeEventListener('resize', showButton) };
   }, []);

   return (
      <nav className="navbar">
         <div className="navbar-container">
            {/*title + logo in the navbar*/}
            <Link data-testid="navbar-logo" to="/" className="navbar-logo" onClick={closeMobileMenu}>
               BLM-Toronto <img className='navbar-logo-image' src='/BLM-Toronto-Logo.svg' alt="Navbar Logo" />
            </Link>
            <div className='menu-icon' onClick={handleClick}>
               <i data-testid='mobile-menu-icon' className={click ? 'fas fa-times' : 'fas fa-bars '} />
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
                     to="/list-business/#"
                     className='nav-links'
                     onClick={closeMobileMenu}
                  >
                     Virtual Businesses Near Me
                            </Link>
               </li>
               {/* Mobile Find a Business Button */}
               <li>
                  <Link
                     to='/find-business'
                     className='nav-links-mobile'
                     onClick={closeMobileMenu}
                     data-testid='mobile-button'
                  >
                     Find a Business
                            </Link>
               </li>
            </ul>
            {/* Desktop Find a Business Button */}
            {button && <Button
               buttonStyle='btn--outline'
               label='Find a Business'
               type='button'
            />
            }
         </div>
      </nav>
   )
}

export default Navbar;
