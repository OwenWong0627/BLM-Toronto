import React from 'react';
import '../../App.css';
import Hero from '../../Components/Hero';
import Stats from '../../Components/Stats';
import Cards from '../../Components/Cards';
import ScrollToTopOnMount from '../../Components/ScrollToTopOnMount';

/**
 * This component represents a parent component to the hero, stats, cards component
 * The ScrollToTopOnMount is also mounted on top to ensure that the page is scrolled to the top when this component loads
 */
function Home() {
   return (
      <div>
         <ScrollToTopOnMount />
         <Hero />
         <Stats />
         <Cards />
      </div>
   )
}

export default Home;
