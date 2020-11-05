import React from 'react';
import './Stats.css';

/**
 * This component represents the Stats component under the Hero Component and above the Card Component
 * This component is completely static and only contains some text
 */
function Stats() {
   return (
      <div className="stats-container">
         <div className="stat-box" data-testid="stats-1">
            <h2 className="stat-number">100+</h2>
            <h2 className="stat-text">Businesses Included</h2>
         </div>
         <div className="stat-box" data-testid="stats-2">
            <h2 className="stat-number">10,000+</h2>
            <h2 className="stat-text">Searches Made</h2>
         </div>
      </div>
   )
}

export default Stats;
