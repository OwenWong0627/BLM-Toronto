import React from "react";

import usePlacesAutocomplete, {
   getGeocode,
   getLatLng,
} from "use-places-autocomplete";
import {
   Combobox,
   ComboboxInput,
   ComboboxPopover,
   ComboboxList,
   ComboboxOption,
} from "@reach/combobox";
import '@reach/combobox/styles.css';

//Search Bar
function Searchbar({ panTo, center }) {
   //this is a hook
   //ready just checks whether the google scripts are all loaded up
   //value means what the user is currently inputting
   //suggestions means the suggestions that were returned from the google API
   //setValue is a function to set the value
   //clearSuggestion clears all the suggestions
   const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
   } = usePlacesAutocomplete({
      requestOptions: {
         location: { lat: () => center.lat, lng: () => center.lng },
         radius: 200000,
      },
   });

   return (
      <div className="searchbar">
         <Combobox
            onSelect={async (address) => {
               //the setvalue keeps the text u inputted in the search box without having to call the api
               setValue(address, false);
               clearSuggestions();

               try {
                  const results = await getGeocode({ address });
                  const { lat, lng } = await getLatLng(results[0]);
                  panTo({ lat, lng });
                  console.log(lat, lng);
               }
               catch {
                  console.log("ERROR");
               }
            }}
         >
            <ComboboxInput
               value={value}
               onChange={(event) => {
                  setValue(event.target.value);
               }}
               disabled={!ready}
               placeholder="Enter an address"
            />
            <ComboboxPopover>
               <ComboboxList>
                  {status === "OK" &&
                     data.map(({ place_id, description }) => (
                        <ComboboxOption key={place_id} value={description} />
                     ))}
               </ComboboxList>
            </ComboboxPopover>
         </Combobox>
      </div>
   );
}

export default Searchbar;