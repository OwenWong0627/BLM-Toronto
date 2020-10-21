import React from "react";
import '../../App.css';
import Hero from '../../Components/Hero';
import Stats from '../../Components/Stats';
import Cards from '../../Components/Cards';

function Home() {
   return (
      <div>
         <Hero />
         <Stats />
         <Cards />
      </div>
   )
}

export default Home
