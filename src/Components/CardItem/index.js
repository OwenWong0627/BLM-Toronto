import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * This component represents a single card item that will be rendered on the home page, in the Cards component
 * This component will accept a prop, and this component will destructure it to extract information from the prop
 * to display the information in the card item
 */
function CardItem(props) {
   return (
      <>
         <li className='cards__item'>
            <Link to={props.to} data-testid='card-item' className='cards__item__link'>
               <figure data-testid='card-item-label' className='cards__item__pic-wrap' data-category={props.label}>
                  <img
                     data-testid='card-item-img'
                     className='cards__item__img'
                     alt='Page Previews'
                     src={props.src}
                  />
               </figure>
               <div className='cards__item__info'>
                  <h2 className='cards__item__text'>{props.text}</h2>
               </div>
            </Link>
         </li>
      </>
   );
}

/**
 * propType Documentation
 */
CardItem.propTypes = {
   to: PropTypes.string.isRequired,
   label: PropTypes.string.isRequired,
   src: PropTypes.string.isRequired,
   text: PropTypes.string.isRequired,
}

export default CardItem;