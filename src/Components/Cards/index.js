import React from 'react';
import './Cards.css';
import CardItem from '../CardItem';

function Cards() {
   return (
      <div className='cards'>
         <h1>Check Out The App Features & Functionalities!</h1>
         <div className='cards__container'>
            <div className='cards__wrapper'>
               <ul className='cards__items'>
                  {/* TODO: Replace these images with screenshots of our pages */}
                  <CardItem
                     src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
                     text='Explore The Map to Find Your Local Black-owned Business'
                     label='Map'
                     path='/find-business'
                  />
                  <CardItem
                     src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
                     text='Check Out This Page to Find Your Local Black-owned Virtual Business'
                     label='Page'
                     path='/add-business'
                  />
               </ul>
            </div>
         </div>
      </div>
   );
}

export default Cards;