import React from 'react';
import './Hero.css';

/**
 * This component represents the Hero section of the web app, this section is completely static
 * with only text + a background image
 */
function Hero() {
   return (
      <div data-testid='hero' className='hero-container'>
         <h1><font style={{ color: "#00BFFF" }}>DISCOVER</font> LOCAL BLACK-OWNED BUSINESSES & BLACK ENTREPRENEURS</h1>
         <p>Location Searching Tool to Locate Local Black-Owned Businesses</p>
      </div>
   );
}

export default Hero;