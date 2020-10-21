import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';

function Footer() {
   return (
      <div className='footer-container'>
         <section className='social-media'>
            <div className='social-media-wrap'>
               <div className='footer-logo'>
                  <Link to="/" className="social-logo">
                     BLM-Toronto <i className='fas fa-thumbs-up' />
                  </Link>
               </div>
            </div>
         </section>
         <section className='social-media'>
            <div className='social-media-wrap'>
               <div className='social-icons'>
                  <a className='social-icon-link github'
                     target='_blank'
                     aria-label='Github'
                     href='https://github.com/OwenWong0627/BLM-Toronto'
                     rel="noopener noreferrer"
                  >
                     <i className='fab fa-github' />
                  </a>
               </div>
            </div>
         </section>
         <section className='social-media'>
            <div className='social-media-wrap'>
               <small className='website-rights'>© Owen Wong & Leo Wang. All rights reserved.</small>
            </div>
         </section>
      </div>
   );
}

export default Footer;