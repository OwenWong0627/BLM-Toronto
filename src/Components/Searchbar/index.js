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
import PropTypes from 'prop-types';

/**
 * This component represents the searchbar in the Find a Business map page, and it takes in three props
 * The panTo prop is a function that, when clicked on a searched location, will pan to the searched location
 * The center prop allows the use-places-autocomplete API to give search results based on the user's location; it will give search results tailored to the user's location
 * The third prop name is just a class name for the css styling
 */
function Searchbar({ panTo, center, className }) {
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
      <div className={className}>
         <Combobox
            data-testid="search-bar"
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
               data-testid="input"
               value={value}
               onChange={(event) => {
                  setValue(event.target.value);
               }}
               disabled={!ready}
               placeholder="Enter an address"
            />
            <ComboboxPopover>
               <ComboboxList data-testid="search-results">
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

/**
 * propType Documentation
 */
Searchbar.propTypes = {
   panTo: PropTypes.func.isRequired,
   center: PropTypes.object.isRequired,
   className: PropTypes.string.isRequired
}

export default Searchbar;
