//TODO: Currently, we are doing front-end pagination which will call all of the data and display
//[number] of businesses at a time. In the future, we wouls make it scalable for a lot of businesses
//in a database by calling the database and displaying the called [number] businesses.
import React, { useState, useEffect } from 'react';
import * as businessData from '../../businesses.json';
import Business from '../../Components/Business';
// import { DistanceMatrix } from '@react-google-maps/api';
import './ListBusiness.css';

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
   const IPAPIURL = 'http://api.ipapi.com/api/check?access_key=dc3c71b823bbe9c2231225f4eea06429&fields=latitude,longitude';

   const allCities = businessData.allCities;
   /**
    * Returns the closest city based on distance from the user's current origin location to a city
    * 
    * @param {Object} origin 
    * @param {Array<String>} cities
    * @return {Promise<String>}
    */
   async function getNearestCity(URL, cities) {
      let IPresponse = await fetch(URL);
      let IPdata = await IPresponse.json();
      console.log(IPdata);
      const center = {
         lat: IPdata.latitude,
         lng: IPdata.longitude
      }
      //
      let citiesString = "";
      for (let i = 0; i < cities.length - 1; i++) {
         //Add just the city name
         console.log(cities[i].split(",")[0]);
         citiesString = citiesString.concat(cities[i].split(",")[0]);
         citiesString = citiesString.concat("+ON%7C");
      }
      citiesString = citiesString.concat(cities[cities.length - 1].split(",")[0]);
      console.log(citiesString);
      //
      //Change the fetch call to get different results
      //Change this because it cant handle too many requests
      let response = await fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${center.lat},${center.lng}&destinations=${citiesString}+ON&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);

      let data = await response.json();
      console.log(data);
      //

      //Linear Search but not really, because it will execute with a complexity of O(n) to find the closesIn
      const closestCityData = { fetchedClosestDistance: Number.MAX_VALUE, fetchedClosestCity: data.destination_addresses[0] };
      console.log(data.rows[0].elements[0].distance.value);
      for (let i = 0; i < cities.length; i++) {
         if (data.rows[0].elements[i].distance.value < closestCityData.fetchedClosestDistance) {
            closestCityData.fetchedClosestDistance = data.rows[0].elements[i].distance.value;
            closestCityData.fetchedClosestCity = data.destination_addresses[i];
         }
      }
      console.log(closestCityData.fetchedClosestDistance);
      console.log(closestCityData.fetchedClosestCity);
      //Checks if Toronto is included in the fetched cities that is not the actual city Toronto
      //ex. "Etobicoke, Toronto, ON" will satisfy the if statement, but "Toronto, ON" will not
      //The expression in the if statement will remove that extra "Toronto"
      if (closestCityData.fetchedClosestCity.indexOf("Toronto, ") > 0) {
         closestCityData.fetchedClosestCity =
            closestCityData.fetchedClosestCity.substring(0, closestCityData.fetchedClosestCity.indexOf("Toronto, ")) +
            closestCityData.fetchedClosestCity.substring(closestCityData.fetchedClosestCity.indexOf("Toronto, ") + 9, closestCityData.fetchedClosestCity.length);
      }
      console.log(closestCityData.fetchedClosestCity);
      return closestCityData.fetchedClosestCity.substring(0, closestCityData.fetchedClosestCity.length - 8);
   }

   function sortAlphaAscending(arrayToBeSorted) {
      //A deep copy of the base array is created
      const temporaryArray = arrayToBeSorted.slice(0);
      temporaryArray.sort(function (a, b) {
         var textA = a.name.toUpperCase();
         var textB = b.name.toUpperCase();
         return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      console.log(temporaryArray);
      return temporaryArray;
      // setVirtualBusinesses(temporaryArray);
   }

   function sortAlphaDescending(arrayToBeSorted) {
      //A deep copy of the base array is created
      const temporaryArray = arrayToBeSorted.slice(0);
      temporaryArray.sort(function (a, b) {
         var textA = a.name.toUpperCase();
         var textB = b.name.toUpperCase();
         return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
      });
      console.log(temporaryArray);
      return temporaryArray;
      // setVirtualBusinesses(temporaryArray);
   }

   useEffect(() => {
      console.log("HELLO");
      if (dropdownValue === "nearestCity") {
         //I could put this entire function into the getNearestCity
         async function fetchNearestCity() {
            const nearestCity = await getNearestCity(IPAPIURL, allCities);
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
            console.log(filteredSortedBusinesses);
            setVirtualBusinesses(filteredSortedBusinesses);
         }
         fetchNearestCity();
         setCurrentPage(1);
      }
      else if (dropdownValue === "default") {
         console.log(baseVirtualBusinesses)
         setVirtualBusinesses(baseVirtualBusinesses);
         setCurrentPage(1);
      }
      else if (dropdownValue === "alphaAscending") {
         // sortAlphaAscending(baseVirtualBusinesses);
         setVirtualBusinesses(sortAlphaAscending(baseVirtualBusinesses));
         setCurrentPage(1);
      }
      else if (dropdownValue === "alphaDescending") {
         setVirtualBusinesses(sortAlphaDescending(baseVirtualBusinesses));
         setCurrentPage(1);
      }// eslint-disable-next-line
   }, [dropdownValue, baseVirtualBusinesses]);
   //baseVirtualBusinesses will never change so I thought to just include it

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

   const handleChange = (event) => {
      console.log(event.target.value);
      setDropdownValue(event.target.value);
   }

   return (
      <>
         <div className="container">
            {/* <button type="button" onClick={console.log(generateAgeGroupArray())} className="filterButton">hahaha</button> */}
            <h1 className="title">Virtual Businesses Near Me</h1>
            <h2 className="selectTitle">Sort</h2>
            <div className="select">
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
            {/* SortBy Menu will be inserted here */}
            <Business businesses={currentBusinesses} />
            <div className="pagination">
               <ul>
                  <li>
                     <a
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
      </>
   )
}

export default ListBusiness;