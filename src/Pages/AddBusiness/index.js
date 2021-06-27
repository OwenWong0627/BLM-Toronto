import React, { useState, useEffect, useCallback } from 'react';
import {
   useLoadScript,
} from '@react-google-maps/api';
import './AddBusiness.css';
import ScrollToTopOnMount from '../../Components/ScrollToTopOnMount';
import Searchbar from '../../Components/Searchbar';
import { useForm } from "react-hook-form";
import firebase from '../../utils/firebase';

export async function getUserLocation(URL) {
   let response = await fetch(URL);
   let data = await response.json();
   console.log(data);
   return {
      lat: parseFloat(data.loc.split(",")[0]),
      lng: parseFloat(data.loc.split(",")[1])
   }
}

//TODO: add postal code modifier
function AddBusiness() {
   const [libraries] = useState(['places']);
   const [isVirtual, setIsVirtual] = useState(false);
   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
   });

   const [center, setCenter] = useState({
      lat: 0,
      lng: 0
   });

   const [selectedBusiness, setSelectedBusiness] = useState({
      LATITUDE: 0,
      LONGITUDE: 0,
      ADDRESS: ""
   });

   const IPAPIURL = `https://ipinfo.io/json?token=${process.env.REACT_APP_IPINFO_KEY}`;
   async function fetchLocationData() {
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
   useEffect(() => {
      fetchLocationData();
   }, []);

   // register your input into the hook by invoking the "register" function
   const { register, handleSubmit, formState: { errors } } = useForm();

   const allBusinessesRef = firebase.database().ref();
   const onSubmit = (data) => {
      console.log(data);
      if (isVirtual) {
         console.log(selectedBusiness);
         const mergedData = { ...{ ID: 0 }, ...data, ...selectedBusiness };
         console.log(mergedData);
         if (selectedBusiness.LATITUDE === 0) {
            alert("Please select a valid business adress!");
         }
         else {
            allBusinessesRef.child('inPersonBusinesses').push(mergedData);
            alert(JSON.stringify(mergedData));
         }
      } else {
         const mergedData = { ...{ ID: 0 }, ...data };
         console.log(mergedData);
         // alert("Business Added Successfully");
         allBusinessesRef.child('virtualBusinesses').push(mergedData);
         alert(JSON.stringify(mergedData));
      }
   }

   const handleClick = (event) => {
      console.log(event.target.checked);
      setIsVirtual(event.target.checked);
   }

   // saves the lat and lng of the selected address when the lat/lng value has changed
   const save = useCallback(({ lat, lng, address }) => {
      const newAddress = { LATITUDE: lat, LONGITUDE: lng, ADDRESS: address };
      const newAddressClone = JSON.parse(JSON.stringify(newAddress));
      console.log(lat);
      console.log(lng);
      console.log(address);
      setSelectedBusiness(newAddressClone);
   }, []);

   // console.log(loadError, isLoaded);
   if (loadError) return "Error loading maps";
   if (!isLoaded || center.lat === 0) return "Loading...";
   return (
      <div className="form">
         <script src="https://maps.googleapis.com/maps/api/js?key=&libraries=places"></script>
         <ScrollToTopOnMount />
         {/* handleSubmit will basically check to make sure all validation rules set up here are met before actually calling the onSubmit function */}
         <h1 className="form-title">Add a Business</h1>
         <form onSubmit={handleSubmit(onSubmit)}>
            {/* include validation with required or other standard HTML validation rules */}
            <div className="form-control">
               <label>Business Name</label>
               <input {...register("NAME", { required: true })} type="text" placeholder="Enter Your Business Name" />
               {errors.NAME && <p className="error-message">This field is required</p>}
            </div>
            <div className="form-control">
               <label>What type of business is this?</label>
               <select {...register("TYPE", { validate: value => value !== "" })} defaultValue="">
                  <option disabled value="">Select Type...</option>
                  <option value="Art, Artists & Art Galleries">Art, Artists & Art Galleries</option>
                  <option value="Education, Books & Black Authors">Education, Books & Black Authors</option>
                  <option value="Business, Services & Technology">Business, Services & Technology</option>
                  <option value="Doctors, Health & Fitness">Doctors, Health & Fitness</option>
                  <option value="Real Estate & Home Services">Real Estate & Home Services</option>
                  <option value="Community & Faith Centers">Community & Faith Centers</option>
                  <option value="Hair, Barbers & Beauty">Hair, Barbers & Beauty</option>
                  <option value="Media, Events & Entertainment">Media, Events & Entertainment</option>
                  <option value="Restaurants, Bakeries & Grocery">Restaurants, Bakeries & Grocery</option>
                  <option value="Travel, Auto & Other Services">Travel, Auto & Other Services</option>
               </select>
               {errors.TYPE && <p className="error-message">Please Select an option</p>}
            </div>
            <div className="form-control">
               <label>What city is this business in?</label>
               <select {...register("CITY", { validate: value => value !== "" })} defaultValue="">
                  <option disabled value="">Select City...</option>
                  <option value="Ajax, ON">Ajax, ON</option>
                  <option value="Brampton, ON">Brampton, ON</option>
                  <option value="Burlington, ON">Burlington, ON</option>
                  <option value="Etobicoke, ON">Etobicoke, ON</option>
                  <option value="Hamilton, ON">Hamilton, ON</option>
                  <option value="Kitchener, ON">Kitchener, ON</option>
                  <option value="London, ON">London, ON</option>
                  <option value="Markham, ON">Markham, ON</option>
                  <option value="Mississauga, ON">Mississauga, ON</option>
                  <option value="Niagara Falls, ON">Niagara Falls, ON</option>
                  <option value="North York, ON">North York, ON</option>
                  <option value="Oakville, ON">Oakville, ON</option>
                  <option value="Oshawa, ON">Oshawa, ON</option>
                  <option value="Ottawa, ON">Ottawa, ON</option>
                  <option value="Pickering, ON">Pickering, ON</option>
                  <option value="Scarborough, ON">Scarborough, ON</option>
                  <option value="St. Catharines, ON">St. Catharines, ON</option>
                  <option value="Toronto, ON">Toronto, ON</option>
                  <option value="Vaughan, ON">Vaughan, ON</option>
                  <option value="Windsor, ON">Windsor, ON</option>
               </select>
               {errors.CITY && <p className="error-message">Please Select an option</p>}
            </div>
            {/* Note: we dont want Virtual to be saved */}
            <div className="form-control">
               <label>Does your business have a physical location?</label>
               <label><input type="checkbox" checked={isVirtual} value="virtual" onChange={handleClick} /> Yes</label>
            </div>
            {isVirtual ?
               <div>
                  <div className="form-control">
                     <label>What is the address of the business?</label>
                     <Searchbar center={center} className={'lol'} maps={false} save={save} />
                  </div>
                  <div className="form-control">
                     <label>What is the postal code of the business?</label>
                     <input {...register("POSTAL_CODE", { required: true, pattern: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVXY][ -]?\d[ABCEGHJKLMNPRSTVXY]\d$/i })} type="text" placeholder="Enter Your Business Postal Code" />
                     {errors.POSTAL_CODE && errors.POSTAL_CODE.type === "required" && <p className="error-message">This is required</p>}
                     {errors.POSTAL_CODE && errors.POSTAL_CODE.type === "pattern" && <p className="error-message">This is not a Postal Code</p>}
                  </div>
               </div>
               : <div></div>}
            <div className="form-control">
               <label>Website</label>
               <input {...register("WEBSITE", { required: true, pattern: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/ })} type="text" placeholder="Enter Your Business Website" />
               {errors.WEBSITE && errors.WEBSITE.type === "required" && <p className="error-message">This is required</p>}
               {errors.WEBSITE && errors.WEBSITE.type === "pattern" && <p className="error-message">This is not a website</p>}
            </div>
            <div className="form-control">
               <label>Description</label>
               <input {...register("DESCRIPTION", { required: true })} type="text" placeholder="Enter Your Business Description" />
               {errors.DESCRIPTION && <p className="error-message">This field is required</p>}
            </div>
            <div className="form-control">
               <label>Contact Info</label>
               <input {...register("CONTACT_INFO", { required: true })} type="text" placeholder="Enter Your Business Website" />
               {errors.CONTACT_INFO && <p className="error-message">This field is required</p>}
            </div>
            <button type="submit" className="glow-on-hover">Submit</button>
         </form>
      </div>
   );
}

export default AddBusiness;
