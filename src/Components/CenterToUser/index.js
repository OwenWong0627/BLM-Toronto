import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component will be a small icon placed on the Google Map that will take in a panTo function so when it is clicked,
 * it will "pan to" to the center prop which is also passed into this component
 */
function CenterToUser({ panTo, center }) {
   return (
      <button
         data-testid="centerToUser-button"
         className="centerToUser"
         onClick={() => {
            panTo({
               lat: center.lat,
               lng: center.lng,
            });
         }}
      >
         <img src="/HomeMarker.svg" alt="Home Marker" />
      </button>
   );
}

CenterToUser.propTypes = {
   panTo: PropTypes.func.isRequired,
   center: PropTypes.object.isRequired
}

export default CenterToUser;