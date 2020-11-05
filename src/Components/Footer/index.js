import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

/**
 * This component represents the footer in the web app, it has a logo which will redirect users to the home page
 * This component has a Github icon that links the web app's Github repository
 */
function Footer() {
   return (
      <div className='footer-container'>
         <div className='social-media-wrap'>
            <Link data-testid='footer-logo' to="/" className="social-logo">
               BLM-Toronto <img className="footer-logo-image" src='/BLM-Toronto-Logo.svg' alt='Footer Logo' />
            </Link>
         </div>
         <div className='social-media-wrap'>
            <a
               className="social-logo"
               data-testid='github-link'
               target='_blank'
               aria-label='Github'
               href='https://github.com/OwenWong0627/BLM-Toronto'
               rel='noopener noreferrer'
            >
               <img data-testid="github-icon" src='/github-logo.svg' className='github-icon' alt='Github Logo' />
            </a>
         </div>
         <div className='social-media-wrap'>
            <small data-testid='website-rights' className='website-rights'>© Owen Wong & Leo Wang. All rights reserved</small>
         </div>
      </div>
   );
}

export default Footer;