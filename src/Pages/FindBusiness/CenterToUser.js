import React from "react";

//Center to User's Location Button
function CenterToUser({ panTo, center }) {
   return (
      <button
         className="centerToUser"
         onClick={() => {
            panTo({
               lat: center.lat,
               lng: center.lng,
            });
         }}
      >
         <img src="/compass.svg" alt="compass" />
      </button>
   );
}

export default CenterToUser;