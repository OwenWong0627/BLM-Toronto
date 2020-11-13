//TODO: Currently, we are doing front-end pagination which will call all of the data and display
//[number] of businesses at a time. In the future, we would make it scalable for a lot of businesses
//in a database by calling the database and displaying the called [number] of businesses.
import React, { useState, useEffect } from 'react';
import * as businessData from '../../businesses.json';
import Business from '../../Components/Business';
import './ListBusiness.css';
import ScrollToTopOnMount from '../../Components/ScrollToTopOnMount';

const IPAPIURL = `https://ipinfo.io/json?token=${process.env.REACT_APP_IPINFO_KEY}`;

const allCities = businessData.allCities;

/**
 * This is function that calls on an IPAPI to extract the latitude and longitude data from the current user
 * This api will avoid prompting the user to allow the "This app wants to know your location" function
 * However, it is important to note that IPAPI do not give completely accurate locations
 *
 * @async
 * @param {string} URL - The URL to receive the user's location details from
 * @return {Promise.<Object>} - The latitude and longitude data from the URL
 */
async function getUserLocation(URL) {
   let response = await fetch(URL);
   let data = await response.json();
   console.log(data);
   return ({
      lat: parseFloat(data.loc.split(",")[0]),
      lng: parseFloat(data.loc.split(",")[1])
   });
}

/**
 * This function calculates the nearest city to a location, origin, by searching the cities array and finding the city that has the least distance from the origin
 * 
 * @param {Object.<string, number>} origin - An object containing lat and lng keys that has float values
 * @param {Array.<Object>} cities - An array of city objects that has key for the city name, and a key for city's lat and lng values
 * @returns {string} - The function returns a string with the nearest city from the user's location
 */
export function getNearestCity(origin, cities) {
   //Linear Search but not really, because it will execute with a complexity of O(n) to find the nearest city
   for (let i = 0; i < cities.length; i++) {
      if (typeof (cities[i].LatLng.lat) !== "number" || typeof (cities[i].LatLng.lng) !== "number") {
         console.log('The lat/lng must be numbers');
         return null;
      }
   }
   let nearestDistance = Number.MAX_VALUE;
   let nearestCity = cities[0].city;
   for (let i = 0; i < cities.length; i++) {
      let distance = getDistanceFromLatLonInM(origin.lat, cities[i].LatLng.lat, origin.lng, cities[i].LatLng.lng);
      console.log(distance);
      if (distance < nearestDistance) {
         nearestDistance = distance;
         nearestCity = cities[i].city;
      }
   }
   console.log(nearestCity);
   return nearestCity;
}

/**
 * This function uses the Haversine formula to try and calculate the distance between two locations based on their latitude and longitude values
 * This algorithm calculates the straight line distance between the two locations.
 * 
 * @param {number} lat1 - The latitude value of the first location
 * @param {number} lat2 - The latitude value of the second location
 * @param {number} lon1 - The longitude value of the first location
 * @param {number} lon2 - The longitude value of the second location
 * @returns {number} - The distance between the locations in meters
 */
export function getDistanceFromLatLonInM(lat1, lat2, lon1, lon2) {
   if (typeof (lat1) !== "number" || typeof (lat2) !== "number" || typeof (lon1) !== "number" || typeof (lon2) !== "number") {
      console.log('The lat/lng must be numbers');
      return null;
   }
   let deg2rad = deg => deg * 0.017453293;
   let a =
      Math.pow(Math.sin(deg2rad(lat2 - lat1) / 2), 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.pow(Math.sin(deg2rad(lon2 - lon1) / 2), 2);
   let distance = 12742000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   if (distance < 20000000 && distance >= 0) {
      return distance;
   }
   return null;
}

/**
 * This function sorts an array of objects by alphabetical order from A-Z, it sorts by the name key of each object element
 * 
 * @param {Array.<Object>} arrayToBeSorted - The array that will be sorted by alphabetical order
 * @returns {Array.<Object>} - This function returns an array of objects that is sorted by alphabetical order of the name key from A-Z
 */
export function sortAlphaAscending(arrayToBeSorted) {
   //A deep copy of the base array is created
   const temporaryArray = arrayToBeSorted.slice(0);
   for (let i = 0; i < temporaryArray.length; i++) {
      if (typeof (temporaryArray[i].name) !== "string") {
         console.log('sortAlphaAscending must only accept array of objects where the name object is a string')
         return null;
      }
   }
   temporaryArray.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
   });
   console.log(temporaryArray);
   return temporaryArray;
}

/**
 * This function sorts an array of objects by alphabetical order from Z-A, it sorts by the name key of each object element
 *
 * @param {Array.<Object>} arrayToBeSorted - The array that will be sorted by alphabetical order
 * @returns {Array.<Object>} - This function returns an array of objects that is sorted by alphabetical order of the name key from Z-A
 */
export function sortAlphaDescending(arrayToBeSorted) {
   //A deep copy of the base array is created
   const temporaryArray = arrayToBeSorted.slice(0);
   for (let i = 0; i < temporaryArray.length; i++) {
      if (typeof (temporaryArray[i].name) !== "string") {
         console.log('sortAlphaDescending must only accept array of objects where the name object is a string')
         return null;
      }
   }
   temporaryArray.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
   });
   console.log(temporaryArray);
   return temporaryArray;
}

/**
 * This component represents the list
 */
function ListBusiness() {
   const [baseVirtualBusinesses] = useState(businessData.virtualBusinesses.map((business) => {
      return {
         id: business.ID,
         name: business.NAME,
         type: business.TYPE,
         city: business.CITY,
         website: business.WEBSITE,
         description: business.DESCRIPTION,
         contactInfo: business.CONTACT_INFO
      }
   }));
   const [virtualBusinesses, setVirtualBusinesses] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [dropdownValue, setDropdownValue] = useState("default");
   const [businessesPerPage] = useState(10);
   const [center, setCenter] = useState({
      lat: 0,
      lng: 0
   });

   /**
   * This function calculates the nearest city to the user's location(from the IPAPI) by searching the cities array and finding the city that has the least distance from the user's location
   * 
   * @returns {Array.<Object>} - This functions returns a filtered array of all businesses in the nearest city from the user
   */
   function getNearestCityBusinesses() {
      const nearestCity = getNearestCity(center, allCities);
      console.log(nearestCity);
      //use nearestCity to create a new updated array
      const filteredBusinesses = baseVirtualBusinesses.filter((business) => {
         if (nearestCity === business.city) {
            return business;
         }
         return null;
      });
      console.log(filteredBusinesses);
      //alpha sort below
      const filteredSortedBusinesses = sortAlphaAscending(filteredBusinesses);
      return filteredSortedBusinesses;
   }

   //Initializes the center object when the page loads and initializes the virtualBusinesses array
   useEffect(() => {
      async function fetchCenter() {
         try {
            const cntr = await getUserLocation(IPAPIURL);
            console.log(cntr);
            setCenter(cntr);
         }
         catch (err) {
            setCenter({ lat: 43.5601414, lng: -79.716 });
            alert(err);
         }
      }
      fetchCenter();
      setVirtualBusinesses(baseVirtualBusinesses);
      setCurrentPage(1);
   }, [baseVirtualBusinesses]);

   /**
    * This function executes certain functions depending what the target selectBox value is
    * This function will also reset the pagination page back to the first page
    * @param {EventObject} event 
    */
   const handleChange = (event) => {
      if (event.target.value === "nearestCity") {
         setVirtualBusinesses(getNearestCityBusinesses());
         setCurrentPage(1);
      }
      else if (event.target.value === "default") {
         console.log(baseVirtualBusinesses)
         setVirtualBusinesses(baseVirtualBusinesses);
         setCurrentPage(1);
      }
      else if (event.target.value === "alphaAscending") {
         setVirtualBusinesses(sortAlphaAscending(baseVirtualBusinesses));
         setCurrentPage(1);
      }
      else if (event.target.value === "alphaDescending") {
         setVirtualBusinesses(sortAlphaDescending(baseVirtualBusinesses));
         setCurrentPage(1);
      }
      console.log(event.target.value);
      setDropdownValue(event.target.value);
   }

   //Get Current Businesses(10)
   const indexOfLastBusiness = currentPage * businessesPerPage;
   const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
   const currentBusinesses = virtualBusinesses.slice(indexOfFirstBusiness, indexOfLastBusiness);

   const paginate = pageNumber => setCurrentPage(pageNumber);
   const paginateIncrement = () => setCurrentPage(currentPage + 1);
   const paginateDecrement = () => setCurrentPage(currentPage - 1);

   const pageNumbers = [];

   for (let i = 1; i <= Math.ceil(virtualBusinesses.length / businessesPerPage); i++) {
      pageNumbers.push(i);
   }

   return (
      <div>
         <ScrollToTopOnMount />
         <div className="container">
            <h1 className="title">Virtual Businesses Near Me</h1>

            <h2 className="selectTitle">Sort</h2>
            <div data-testid="sortBy-menu" className="select">
               <select
                  value={dropdownValue}
                  onChange={handleChange}
                  className="select-text"
               >
                  <option value="default">Default</option>
                  <option value="alphaAscending">Name(A-Z)</option>
                  <option value="alphaDescending">Name(Z-A)</option>
                  <option value="nearestCity">Nearest City</option>
               </select>
            </div>
            <Business businesses={currentBusinesses} />
            <div data-testid="pagination" className="pagination">
               <ul>
                  <li>
                     <a
                        data-testid="pagination-previous"
                        className={(currentPage > 1) ? 'button' : 'button inactive'}
                        onClick={paginateDecrement}
                        href="/list-business/#"
                     >
                        &laquo;
                     </a>
                  </li>
                  {pageNumbers.map(number => (
                     <li key={number}>
                        <a
                           className={(currentPage === number) ? 'activePage' : null}
                           onClick={() => paginate(number)} href='/list-business/#'
                        >
                           {number}
                        </a>
                     </li>
                  ))}
                  <li>
                     <a
                        data-testid="pagination-next"
                        className={(currentPage < Math.ceil(virtualBusinesses.length / businessesPerPage)) ? 'button' : 'button inactive'}
                        onClick={paginateIncrement}
                        href="/list-business/#"
                     >
                        &raquo;
                     </a>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   )
}

export default ListBusiness;
