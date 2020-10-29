import React, { useRef, useCallback, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
   GoogleMap,
   useLoadScript,
   Marker,
   InfoWindow,
} from '@react-google-maps/api';

//The map styles is copied from snazzymaps.com
import mapStyles from './mapStyles';
import * as businessData from '../../businesses.json';
import './MapElements.css';
import './Sidebar.css';
import Checkbox from '../../Components/Checkbox';
import Searchbar from './Searchbar';
import CenterToUser from './CenterToUser';

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

const IPAPIURL = 'http://api.ipapi.com/api/check?access_key=dc3c71b823bbe9c2231225f4eea06429&fields=latitude,longitude';
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
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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

   useEffect(() => {
      async function fetchLocationData() {
         const cntr = await getUserLocation(IPAPIURL);
         setCenter(cntr);
      }
      fetchLocationData();
   }, []);

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
      { name: "Art", value: "Art, Artists & Art Galleries" },
      { name: "Education", value: "Education, Books & Black Authors" },
      { name: "Business", value: "Business, Services & Technology" },
      { name: "Health", value: "Doctors, Health & Fitness" },
      { name: "RealEstate", value: "Real Estate & Home Services" },
      { name: "Shopping", value: "Shopping" },
      { name: "Community", value: "Community & Faith Centers" },
      { name: "Hair", value: "Hair, Barbers & Beauty" },
      { name: "Media", value: "Media, Events & Entertainment" },
      { name: "Restaurant", value: "Restaurants, Bakeries & Grocery" },
      { name: "Finance", value: "Financial & Legal Services" },
      { name: "Other", value: "Travel, Auto & Other Services" }
   ];

   const handleChange = (event) => {
      console.log(event.target);
      console.log(event.target.checked);
      setCheckedItems({ ...checkedItems, [event.target.name]: event.target.checked });
   }

   const [selectAll, setSelectAll] = useState(true);
   const handleAllChecked = (event) => {
      let checked = event.target.checked;
      setSelectAll(checked);
      console.log(event.target);
      console.log(checked);
      Object.keys(checkedItems).forEach((key) => { checkedItems[key] = checked });
   }
   //This state will be just a base array with all the initial businesses, this state will be checked
   //everytime a user applies the filter
   const [allBaseMarkers, setAllBaseMarkers] = useState([]);

   const initializeMarkers = () => {
      const res = businessData.inPersonBusinesses.map((business) => {
         return {
            id: business.ID,
            name: business.NAME,
            type: business.TYPE,
            latitude: business.LATITUDE,
            longitude: business.LONGITUDE,
            address: business.ADDRESS,
            postalCode: business.POSTAL_CODE,
            city: business.CITY,
            website: business.WEBSITE,
            description: business.DESCRIPTION,
            contactInfo: business.CONTACT_INFO
         }
      })
      //TODO: RENAME DESCRIPTIONS to DESCRIPTION
      console.log(res);
      setAllBaseMarkers(res);
      setAllMarkers(res);
   }
   //This useEffect will just initialize the allMarkers and allBaseMarkers States
   useEffect(initializeMarkers, []);

   //This is the state that will actually be modified when filters are applied
   const [allMarkers, setAllMarkers] = useState([]);
   const hideMarkers = () => {
      let availableCategoryArray = []
      const availableCategoryObject = checkboxes.filter((option) => {
         if (checkedItems[option.name]) {
            return option;
         }
         return null;
      });
      Object.values(availableCategoryObject).forEach((value) => {
         availableCategoryArray.push(value.value);
         console.log(value);
      });
      console.log(availableCategoryObject);
      console.log(availableCategoryArray);
      console.log(allMarkers);
      const loadNewMarkerSet = allBaseMarkers.filter((business) => {
         if (availableCategoryArray.includes(business.type)) {
            return business;
         }
         return null;
      });
      console.log(loadNewMarkerSet);
      setAllMarkers(loadNewMarkerSet);
   }

   const [selectedBusiness, setSelectedBusiness] = useState(null);

   //This function listens to if user clicks the escape key, ifW pressed, the info window will close
   useEffect(() => {
      const listener = e => {
         if (e.key === "Escape") {
            setSelectedBusiness(null);
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
   if (!isLoaded || center.lat === 0) return "Loading...";

   return (
      <>
         <div className={sidebar ? 'menu-button invisible' : 'menu-button'} id='menu' onClick={showSidebar}>
            <i className={'fas fa-bars'} />
         </div>
         <div className={sidebar ? 'side-menu active' : 'side-menu'}>
            <ul className='side-menu-items'>
               <li className='sidebar-header'>
                  <div className='menu-button cross' onClick={showSidebar}>
                     <i className={'fas fa-times'} />
                  </div>
               </li>
               {/* The actual filter section */}
               <li>
                  <h1>Categories</h1>
               </li>
               <li><label><input type='checkbox' checked={selectAll} onChange={handleAllChecked} />Check/Uncheck All</label></li>
               {checkboxes.map(item => (
                  <Checkbox
                     key={item.name}
                     id={item.id}
                     name={item.name}
                     value={item.value}
                     checked={checkedItems[item.name]}
                     onChange={handleChange}
                  />
               ))}
            </ul>
            <button
               type="button"
               className="filterButton"
               onClick={() => { hideMarkers(); showSidebar() }}
            >
               Apply Filter
               </button>
         </div>
         <div className="Map">
            {/* <h1>BLM-Toronto <i className='fas fa-thumbs-up' /></h1> */}
            {/* Home Button */}
            <Link to="/">
               <img className='home' src='/HomeButton.svg' alt='Home-Button'></img>
            </Link>

            <CenterToUser panTo={panTo} center={center} />
            <Searchbar panTo={panTo} center={center} className={sidebar ? 'searchbar shifted' : 'searchbar'} />

            <GoogleMap
               mapContainerStyle={mapContainerStyle}
               zoom={9}
               center={center}
               options={options}
               onLoad={onMapLoad}
            >
               <Marker
                  animation={window.google.maps.Animation.DROP}
                  position={{
                     lat: center.lat,
                     lng: center.lng
                  }}
                  icon={{
                     url: `/HomeMarker.svg`,
                     scaledSize: new window.google.maps.Size(50, 50)
                  }}
                  onClick={() => panTo({
                     lat: center.lat,
                     lng: center.lng,
                  })}
               />
               {/* Maps Out All the Markers */}
               {allMarkers.map(business => (
                  <Marker
                     key={business.id}
                     category={business.type}
                     position={{
                        lat: parseFloat(business.latitude),
                        lng: parseFloat(business.longitude)
                     }}
                     onClick={() => {
                        setSelectedBusiness(business);
                        if (sidebar) {
                           showSidebar();
                        }
                     }}
                     icon={{
                        url: `/compass.svg`,
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(12.5, 0),
                        scaledSize: new window.google.maps.Size(25, 25)
                     }}
                  />
               ))}
               {/* Info Window */}
               {selectedBusiness && (
                  <InfoWindow
                     onCloseClick={() => {
                        setSelectedBusiness(null);
                     }}
                     position={{
                        lat: parseFloat(selectedBusiness.latitude),
                        lng: parseFloat(selectedBusiness.longitude)
                     }}
                  >
                     <div>
                        <h2>{selectedBusiness.name}</h2>
                        <h3>{selectedBusiness.city}</h3>
                        <h3>{selectedBusiness.type}</h3>
                        <h4>{selectedBusiness.address}, {selectedBusiness.postalCode}</h4>
                        <p>{selectedBusiness.description}</p>
                        <a target="_blank" rel="noopener noreferrer" href={selectedBusiness.website}>{selectedBusiness.website}</a>
                     </div>
                  </InfoWindow>
               )}
            </GoogleMap>
         </div>
      </>
   );
}

export default FindBusiness;
//componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.