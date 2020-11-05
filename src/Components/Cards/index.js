import React from 'react';
import './Cards.css';
import CardItem from '../CardItem';

/**
 * This component represents the card section of the home page where the card items will showcase previews of
 * the other two pages and provide interactive to redirect users to one of the two pages
 */
function Cards() {
   return (
      <div data-testid="cards" className='cards'>
         <h1>Check Out The App Features & Functionalities!</h1>
         <div className='cards__container'>
            <div className='cards__wrapper'>
               <ul data-testid="card-list" className='cards__items'>
                  <CardItem
                     src='/Map_Preview.png'
                     text='Explore The Map to Find Your Local Black-owned Business'
                     label='Map'
                     to='/find-business'
                  />
                  <CardItem
                     src='/List_Business_Preview.png'
                     text='Check Out This Page to Find Your Local Black-owned Virtual Business'
                     label='Pagination'
                     to='/list-business/'
                  />
               </ul>
            </div>
         </div>
      </div>
   );
}

export default Cards;