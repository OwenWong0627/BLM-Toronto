import React from 'react';
import './index.css';

function Stats() {
   return (
      <div className="stats-container">
         <div className="stat-box">
            <h2 className="stat-number">100+</h2>
            <h2 className="stat-text">Businesses Included</h2>
         </div>
         <div className="stat-box">
            <h2 className="stat-number">10,000+</h2>
            <h2 className="stat-text">Searches Made</h2>
         </div>
      </div>
   )
}

export default Stats;
