import React from 'react';

const Business = ({ businesses }) => {
   return (
      <>
         <ul className="BusinessList">
            {businesses.map((business) => (
               <li className="Business" key={business.id}>
                  <h2>{business.name}</h2>
                  <h3>{business.city}</h3>
                  <h3>{business.type}</h3>
                  <p>{business.description}</p>
                  <a target='_blank' rel="noopener noreferrer" href={business.website}>{business.website}</a>
               </li>
            ))}
         </ul>
      </>
   )
}

export default Business;
