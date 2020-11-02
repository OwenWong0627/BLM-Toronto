import React from 'react';
import '../../App.css';
import Hero from '../../Components/Hero';
import Stats from '../../Components/Stats';
import Cards from '../../Components/Cards';
import ScrollToTopOnMount from '../../Components/ScrollToTopOnMount';

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
