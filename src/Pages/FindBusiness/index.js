import React from "react";
import Delay from 'react-delay-render';

import {
   GoogleMap,
   useLoadScript,
   Marker,
   InfoWindow,
} from '@react-google-maps/api';
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

//The map styles is copied from snazzymaps.com
import mapStyles from './mapStyles';
import './index.css'

const libraries = ["places"];

const mapContainerStyle = {
   height: "100vh",
   width: "100vw",
};
const options = {
   styles: mapStyles,
   disableDefaultUI: true,
   zoomControl: true,
};

let URL = 'http://api.ipapi.com/api/check?access_key=dc3c71b823bbe9c2231225f4eea06429&fields=latitude,longitude';
getUserLocation(URL);
var center = {
   lat: 0,
   lng: 0
};
/**
 * This is function that calls on a the free api from ipapi.com to get the latitude and longitude data
 * from the current user.
 * The fetched latitude and longitude data will be stored in the "center object" created above.
 * This api will avoid prompting the user to allow the "This app wants to know your location" function.
 * 
 * Because this operation takes a moment to execute but the google maps renders instantly,
 * I decided to add a delay to the rendering of the map to allow for this asynchronous function
 * to finish executing before rendering the map, or else the map will be centered in the ocean.
 * 
 * @async
 * @function getUserLocation
 * @param {string} URL - The URL to receive the user's location details from
 * @return {Promise<json>} The data from the URL.
 */
function getUserLocation(URL) {
   fetch(URL)
      .then((response) => {
         return response.json()
      })
      .then((data) => {
         center = {
            lat: data.latitude,
            lng: data.longitude
         }
         console.log(center.lat);
         console.log(center.lng);
      })
      .catch(function (error) {
         console.log(error)
      });
}

function FindBusiness() {
   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyBqjkJOV2Quq6ZSCyfhzmychz1kGlh_-JQ",
      libraries,
   });

   const mapRef = React.useRef();
   const onMapLoad = React.useCallback((map) => {
      mapRef.current = map;
   }, []);

   const panTo = React.useCallback(({ lat, lng }) => {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(11);
   }, []);

   if (loadError) return "Error loading maps";
   if (!isLoaded) return "Loading...";

   return (
      <>
         <div>
            {/* <h1>BLM-Toronto <i className='fas fa-thumbs-up' /></h1> */}

            <Locate panTo={panTo} />
            <Search panTo={panTo} />

            <GoogleMap
               mapContainerStyle={mapContainerStyle}
               zoom={8}
               center={center}
               options={options}
               onLoad={onMapLoad}
            >

            </GoogleMap>
         </div>
      </>
   );
}

function Locate({ panTo }) {
   return (
      <button
         className="locate"
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

function Search({ panTo }) {
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
      <div className="search">
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
                     data.map(({ id, description }) => (
                        <ComboboxOption key={id} value={description} />
                     ))}
               </ComboboxList>
            </ComboboxPopover>
         </Combobox>
      </div>
   );
}

//TODO: add a conditional delay so that it will start rendering when center is changed
//The current method is to delay the rendering of the map by 0.25 seconds
//then in that time frame is when the asynchronous IPAPI call is predicted to be completed
//Then the "center" object will be properly assigned and it can be used to center the rendered map
export default Delay({ delay: 250 })(FindBusiness);
//componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.