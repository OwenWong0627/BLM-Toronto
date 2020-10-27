import React, { useRef, useCallback, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
import './index.css';
import * as storeData from "./stores.json";
import '../../Components/SidebarFilter/index.css';
// import SideBarFilter from '../../Components/SidebarFilter';

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
 * @return {Promise<Object>} The latitude and longitude data from the URL.
 */
async function getUserLocation(URL) {
   let response = await fetch(URL);
   let data = await response.json();
   console.log(data);
   return {
      lat: data.latitude,
      lng: data.longitude
   }
}

function FindBusiness() {
   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "false key",
      libraries,
   });

   const [sidebar, setSidebar] = useState(false);

   const showSidebar = () => (
      setSidebar(!sidebar)
   );

   const [center, setCenter] = useState({
      lat: 0,
      lng: 0
   });

   // const[selectOne, setSelectOne] = useState(true);
   const [checkedItems, setCheckedItems] = useState({
      "Art": true,
      "Education": true,
      "Business": true,
      "Health": true,
      "RealEstate": true,
      "Shopping": true,
      "Community": true,
      "Hair": true,
      "Media": true,
      "Restaurant": true,
      "Finance": true,
      "Other": true,
   });
   
   const checkboxes = [
      {id:0, name: "Art", value: "Art, Artists & Art Galleries", isChecked: true},
      {id:1, name: "Education", value: "Education, Books & Black Authors", isChecked: true},
      {id:2, name: "Business", value: "Business, Services & Technology", isChecked: true},
      {id:3, name: "Health", value: "Black Doctors, Health & Fitness", isChecked: true},
      {id:4, name: "RealEstate", value: "Real Estate & Home Services", isChecked: true},
      {id:5, name: "Shopping", value: "Shopping | Buy Black Owned Products", isChecked: true},
      {id:6, name: "Community", value: "Community & Faith Centers", isChecked: true},
      {id:7, name: "Hair", value: "Hair, Barbers & Beauty", isChecked: true},
      {id:8, name: "Media", value: "Black Media, Black Events & Entertainment", isChecked: true},
      {id:9, name: "Restaurant", value: "Restaurants, Bakeries & Grocery", isChecked: true},
      {id:10, name: "Finance", value: "Financial & Legal Services", isChecked: true},
      {id:11, name: "Other", value: "Travel, Auto & Other Services", isChecked: true}
   ];

   const handleChange = (event) => {
      // updating an object instead of a Map
      console.log(event.target);
      console.log(event.target.checked);
      setCheckedItems({...checkedItems, [event.target.name] : event.target.checked });
   }

   const [filterMenu, setfilterMenu] = useState();

   const[selectAll, setSelectAll] = useState(true);
   const handleAllChecked = (event) => {
      let checked = event.target.checked;
      setSelectAll(checked);
      console.log(event.target);
      console.log(checked);
      Object.keys(checkedItems).forEach((key) => { checkedItems[key] = checked });
      // console.log(selectAll);
      // modifiedMenu.forEach(option => option.isChecked = !selectAll);
      // console.log(modifiedMenu);
      // setfilterMenu(modifiedMenu);
  }

//    const handleOneChecked = (e) => {
//       console.log(e);
//       console.log(e.target);
//       console.log(e.target.id);
//       console.log(e.target.checked);
//       const item = e.target.id;
//       let modifiedMenu = filterMenu;
//       console.log(modifiedMenu[item])
//       console.log(!(filterMenu[item].isChecked))
//       modifiedMenu[item].isChecked = !(filterMenu[item].isChecked);
//       console.log(modifiedMenu[item])
//       setfilterMenu(modifiedMenu);
//   }

   const Checkbox = ({ type = 'checkbox', id, name, value, checked=true, onChange }) => (
      <li><label><input type={type} id={id} name={name} checked={checked} onChange={onChange} />{value}</label></li>
   );

   Checkbox.propTypes = {
      type: PropTypes.string,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
   }

   useEffect(() => {
      async function fetchLocationData() {
         const cntr = await getUserLocation(URL);
         setCenter(cntr);
      }
      fetchLocationData();
   }, []);

   const [selectedStore, setSelectedStore] = useState(null);

   //This function listens to if user clicks the escape key, if pressed, the info window will close
   useEffect(() => {
      const listener = e => {
         if (e.key === "Escape") {
            setSelectedStore(null);
         }
      };
      window.addEventListener("keydown", listener);

      return () => {
         window.removeEventListener("keydown", listener);
      };
   }, []);

   const mapRef = useRef();
   const onMapLoad = useCallback((map) => {
      mapRef.current = map;
   }, []);

   const panTo = useCallback(({ lat, lng }) => {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(11);
   }, []);

   if (loadError) return "Error loading maps";
   // console.log(isLoaded, center);
   if (!isLoaded || center.lat === 0) return "Loading...";

   return (
      <>
      <div className={sidebar ? 'menu-button invisible' : 'menu-button'} id='menu' onClick={showSidebar}>
            <i className={'fas fa-bars'} />
         </div>
         <div className={sidebar ? 'side-menu active' : 'side-menu'}>
            <ul className='side-menu-items'>
               <li className='sidebar-header'>
                  <div className='menu-button' id='cross' onClick={showSidebar}>
                     <i className={'fas fa-times'} />
                  </div>
               </li>
               {/* The actual filter section */}
               <li>
                  <h1>Categories</h1>
               </li>
               <li><label><input type='checkbox' checked={selectAll} onChange={handleAllChecked}/>Check/Uncheck All</label></li>
               {/* <li><label><input type='checkbox' key={filterMenu.id} onClick={handleCheckChieldElement} checked={filterMenu[0].isChecked} value={filterMenu[0].value}/> Art, Artists & Art Galleries</label></li> */}
               {/* <li><label><input type='checkbox' checked={filterMenu[1].isChecked} onChange={handleOneChecked}/> Education, Books & Black Authors</label></li>
               <li><label><input type='checkbox' checked={filterMenu[2].isChecked} onChange={handleOneChecked}/> Business, Services & Technology</label></li>
               <li><label><input type='checkbox' checked={filterMenu[3].isChecked} onChange={handleOneChecked}/> Black Doctors, Health & Fitness</label></li>
               <li><label><input type='checkbox' checked={filterMenu[4].isChecked} onChange={handleOneChecked}/> Real Estate & Home Services</label></li>
               <li><label><input type='checkbox' checked={filterMenu[5].isChecked} onChange={handleOneChecked}/> Shopping | Buy Black Owned Products</label></li>
               <li><label><input type='checkbox' checked={filterMenu[6].isChecked} onChange={handleOneChecked}/> Community & Faith Centers</label></li>
               <li><label><input type='checkbox' checked={filterMenu[7].isChecked} onChange={handleOneChecked}/> Hair, Barbers & Beauty</label></li>
               <li><label><input type='checkbox' checked={filterMenu[8].isChecked} onChange={handleOneChecked}/> Black Media, Black Events & Entertainment</label></li>
               <li><label><input type='checkbox' checked={filterMenu[9].isChecked} onChange={handleOneChecked}/> Restaurants, Bakeries & Grocery</label></li>
               <li><label><input type='checkbox' checked={filterMenu[10].isChecked} onChange={handleOneChecked}/> Financial & Legal Services</label></li>
               <li><label><input type='checkbox' checked={filterMenu[11].isChecked} onChange={handleOneChecked}/> Travel, Auto & Other Services</label></li> */}
               {/* {filterMenu.map(item => (
                     <Checkbox key={item.name} id={item.id} value={item.value} checked={item.isChecked} onChange={handleOneChecked} />
               ))} */}
               {
               checkboxes.map(item => (
                 <Checkbox key={item.name} id={item.id} name={item.name} value={item.value} checked={checkedItems[item.name]} onChange={handleChange} />
                  // <label key={item.key}>
                  //     {item.name}
                  //     <Checkbox name={item.name} checked={checkedItems[item.name]} onChange={handleChange} />
                  // </label>
                  ))
               }
               <button
                  type="button"
                  className="btn btn-primary btn-sm float-right my-3"
                  onClick={()=>console.log("haha")}
               >
                  Apply Filter
               </button>
            </ul>
        </div>
         <div className="Map">
            {/* <h1>BLM-Toronto <i className='fas fa-thumbs-up' /></h1> */}
            <Link to="/">
               <img className='home' src='/HomeButton.svg' alt='Home-Button'></img>
            </Link>

            <Locate panTo={panTo} center={center} />
            <Search panTo={panTo} center={center} />

            <GoogleMap
               mapContainerStyle={mapContainerStyle}
               zoom={8}
               center={center}
               options={options}
               onLoad={onMapLoad}
            >
               {/* Maps Out All the Markers */}
               {storeData.inPersonBusinesses.map(store => (
                  <Marker
                     key={store.ID}
                     position={{
                        lat: parseFloat(store.LATITUDE),
                        lng: parseFloat(store.LONGITUDE)
                     }}
                     onClick={() => {
                        setSelectedStore(store);
                     }}
                     icon={{
                        url: `/compass.svg`,
                        scaledSize: new window.google.maps.Size(25, 25)
                     }}
                  />
               ))}
               {/* Info Window */}
               {selectedStore && (
                  <InfoWindow
                     onCloseClick={() => {
                        setSelectedStore(null);
                     }}
                     position={{
                        lat: parseFloat(selectedStore.LATITUDE),
                        lng: parseFloat(selectedStore.LONGITUDE)
                     }}
                  >
                     <div>
                        <h2>{selectedStore.FEATURES}</h2>
                        <p>{selectedStore.DESCRIPTIONS}</p>
                     </div>
                  </InfoWindow>
               )}
            </GoogleMap>
         </div>
      </>
   );
}

//Center to Button
function Locate({ panTo, center }) {
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

//Search Bar
function Search({ panTo, center }) {
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
                     data.map(({ place_id, description }) => (
                        <ComboboxOption key={place_id} value={description} />
                     ))}
               </ComboboxList>
            </ComboboxPopover>
         </Combobox>
      </div>
   );
}

export default FindBusiness;
//componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.