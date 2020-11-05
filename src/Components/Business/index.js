import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component represents an array of businesses that will listed on the "List Virtual Businesses Near Me"
 * page. The length of the businesses array of objects prop passed in this component will determine
 * how many li tags will be created for the businesses to be rendered on the page.
 */
const Business = ({ businesses }) => {
   return (
      <>
         <ul data-testid="business-list" className="BusinessList">
            {businesses.map((business) => (
               <li data-testid="single-business-list" className="Business" key={business.id}>
                  <h2>{business.name}</h2>
                  <h3>{business.city}</h3>
                  <h3>{business.type}</h3>
                  <p>{business.description}</p>
                  <a data-testid="business-link" target='_blank' rel="noopener noreferrer" href={business.website}>{business.website.split("://")[1]}</a>
               </li>
            ))}
         </ul>
      </>
   )
};

/**
 * propType Documentation
 */
Business.propTypes = {
   businesses: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Business;
