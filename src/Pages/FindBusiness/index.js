import React, { useRef, useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";

import mapStyles from "./mapStyles";
import "./MapElements.css";
import Checkbox from "../../Components/Checkbox";
import Searchbar from "../../Components/Searchbar";
import CenterToUser from "../../Components/CenterToUser";
import firebase from "../../utils/firebase";

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

const IPAPIURL = `https://ipinfo.io/json?token=${process.env.REACT_APP_IPINFO_KEY}`;
/**
 * This is function that calls on an IPAPI to extract the latitude and longitude data from the current user
 * This api will avoid prompting the user to allow the "This app wants to know your location" function
 * However, it is important to note that the IPAPI do not give completely accurate locations
 *
 * @async
 * @param {string} URL - The URL to receive the user's location details from
 * @return {Promise.<Object>} - The latitude and longitude data from the URL
 */
export async function getUserLocation(URL) {
    let response = await fetch(URL);
    let data = await response.json();
    console.log(data);
    return {
        lat: parseFloat(data.loc.split(",")[0]),
        lng: parseFloat(data.loc.split(",")[1]),
    };
}

/**
 * This component represents the Google Map + sidebar in the Find a Business Map page
 * It first uses the async call of getUserLocation to fetch the user's location from their IP address
 * Then, it renders a map centered on that location and maps out all the markers from the businesses.json file
 * There is a searchbar on the map that allows users to search a location and center the map on that location
 * There is a sidebar with checkboxes to filter the markers on the map
 * There is also a centerToUser icon on the top right of the page to center the map on the user's current location
 * There is a special blue marker on the map that also serve the same purpose
 * Finally, the web app logo is in the bottom right corner of the map that allows users to go back to the home page
 */
function FindBusiness() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const allBusinessesRef = firebase.database().ref();
    const [allBaseMarkers, setAllBaseMarkers] = useState([]);
    const [allMarkers, setAllMarkers] = useState([]);
    useEffect(() => {
        allBusinessesRef.child("inPersonBusinesses").on("value", (snapshot) => {
            const cities = snapshot.val();
            const list = [];
            for (let id in cities) {
                list.push({
                    id,
                    ...{
                        index: cities[id].ID,
                        name: cities[id].NAME,
                        type: cities[id].TYPE,
                        latitude: cities[id].LATITUDE,
                        longitude: cities[id].LONGITUDE,
                        address: cities[id].ADDRESS,
                        postalCode: cities[id].POSTAL_CODE,
                        city: cities[id].CITY,
                        website: cities[id].WEBSITE,
                        description: cities[id].DESCRIPTION,
                        contactInfo: cities[id].CONTACT_INFO,
                    },
                });
            }
            console.log(list);
            setAllBaseMarkers(list);
            setAllMarkers(list);
        });
    }, []);

    const [sidebar, setSidebar] = useState(false);

    /**
     * This function will open/close the sidebar menu by flipping the boolean state sidebar
     */
    const showSidebar = () => setSidebar(!sidebar);

    const [center, setCenter] = useState({
        lat: 0,
        lng: 0,
    });

    //This will fetch for the current user's current location, according to his/her IP address, when the map first loads
    useEffect(() => {
        async function fetchLocationData() {
            try {
                const cntr = await getUserLocation(IPAPIURL);
                console.log(cntr);
                setCenter(cntr);
            } catch (err) {
                setCenter({ lat: 43.5601414, lng: -79.716 });
                //  alert(err);
            }
        }
        fetchLocationData();
    }, []);

    //The commented out items signify that there are currently no businesses in those categories in the database
    const [checkedItems, setCheckedItems] = useState({
        "Art, Artists & Art Galleries": false,
        "Education, Books & Black Authors": false,
        "Business, Services & Technology": false,
        "Doctors, Health & Fitness": false,
        "Real Estate & Home Services": false,
        // "Shopping": false,
        "Community & Faith Centers": false,
        "Hair, Barbers & Beauty": false,
        "Media, Events & Entertainment": false,
        "Restaurants, Bakeries & Grocery": false,
        // "Financial & Legal Services": false,
        "Travel, Auto & Other Services": false,
    });

    const checkboxes = [
        { name: "Art, Artists & Art Galleries" },
        { name: "Education, Books & Black Authors" },
        { name: "Business, Services & Technology" },
        { name: "Doctors, Health & Fitness" },
        { name: "Real Estate & Home Services" },
        // { name: "Shopping" },
        { name: "Community & Faith Centers" },
        { name: "Hair, Barbers & Beauty" },
        { name: "Media, Events & Entertainment" },
        { name: "Restaurants, Bakeries & Grocery" },
        // { name: "Financial & Legal Services" },
        { name: "Travel, Auto & Other Services" },
    ];

    /**
     * This function updates the CheckedItems array state to reflect which checkbox was just checked/unchekced
     * @param {EventObject} event - It is a MouseEvent Object on the checkbox to update the checkedItems state
     */
    const handleChange = (event) => {
        console.log(event.target);
        console.log(event.target.checked);
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
    };

    const [selectAll, setSelectAll] = useState(false);
    /**
     * This function updates the CheckedItems array to either check/uncheck all the items in the array
     * @param {EventObject} event -
     */
    const handleAllChecked = (event) => {
        let checked = event.target.checked;
        setSelectAll(checked);
        Object.keys(checkedItems).forEach((key) => {
            checkedItems[key] = checked;
        });
    };

    //This useEffect will initialize the allMarkers
    useEffect(() => setAllMarkers(allBaseMarkers), [allBaseMarkers]);

    /**
     * This function filters the markers to only display markers the the user has checked in the sidebar filter menu
     */
    const hideMarkers = () => {
        let availableCategoryArray = [];
        //Gets an object of all the checked checkboxes
        const availableCategoryObject = checkboxes.filter((option) => {
            if (checkedItems[option.name]) {
                return option;
            }
            return null;
        });
        //Convert the object of checked checkboxes into an array
        Object.values(availableCategoryObject).forEach((category) => {
            availableCategoryArray.push(category.name);
            console.log(category);
        });
        console.log(availableCategoryObject);
        console.log(availableCategoryArray);
        //Use the array to filter the markers on the map
        const loadNewMarkerSet = allBaseMarkers.filter((business) => {
            if (availableCategoryArray.includes(business.type)) {
                return business;
            }
            return null;
        });
        console.log(loadNewMarkerSet);
        //Apply the filtered marker set to the allMarkers State
        setAllMarkers(loadNewMarkerSet);
    };

    const [selectedBusiness, setSelectedBusiness] = useState(null);

    //This function listens to if user clicks the escape key, if pressed, the info window will close
    useEffect(() => {
        const listener = (e) => {
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
        mapRef.current.setZoom(13);
    }, []);

    console.log(loadError, isLoaded, center);
    if (loadError) return "Error loading maps";
    if (!isLoaded || center.lat === 0) return "Loading...";

    const deleteBusiness = () => {
        console.log("H!");
        const businessRef = firebase
            .database()
            .ref("inPersonBusinesses")
            .child(selectedBusiness.id);
        businessRef.remove();
        setSelectedBusiness(null);
        setSelectAll(true);
        Object.keys(checkedItems).forEach((key) => {
            checkedItems[key] = true;
        });
    };

    return (
        <>
            <div
                className={sidebar ? "menu-button invisible" : "menu-button"}
                id="menu"
                onClick={showSidebar}
            >
                <i className={"fas fa-bars"} />
            </div>
            <div
                data-testid="sidebar"
                className={sidebar ? "side-menu active" : "side-menu"}
            >
                <ul data-testid="checkbox-filter" className="side-menu-items">
                    <li className="sidebar-header">
                        <div
                            className="menu-button cross"
                            onClick={showSidebar}
                        >
                            <i className={"fas fa-times"} />
                        </div>
                    </li>
                    {/* The filter section */}
                    <li>
                        <h1>Categories</h1>
                    </li>
                    <li>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleAllChecked}
                            />
                            <h2 className="checkAll">Check/Uncheck All</h2>
                        </label>
                    </li>
                    {checkboxes.map((item) => (
                        <Checkbox
                            key={item.name}
                            name={item.name}
                            checked={checkedItems[item.name]}
                            onChange={handleChange}
                        />
                    ))}
                </ul>
                <button
                    type="button"
                    data-testid="filter-button"
                    className="filterButton"
                    onClick={() => {
                        hideMarkers();
                        showSidebar();
                        setSelectedBusiness(null);
                    }}
                >
                    Apply Filter
                </button>
            </div>
            <div data-testid="map" className="Map">
                {/* Home Button */}
                <Link data-testid="home-button" to="/">
                    <img
                        className="home"
                        src="/BLM-Toronto-Logo.svg"
                        alt="Home-Button"
                        title="Go To Home Page"
                    ></img>
                </Link>

                <CenterToUser panTo={panTo} center={center} />
                <Searchbar
                    panTo={panTo}
                    center={center}
                    className={sidebar ? "searchbar shifted" : "searchbar"}
                    maps={true}
                />

                {window.google !== undefined && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={10}
                        center={center}
                        options={options}
                        onLoad={onMapLoad}
                    >
                        <Marker
                            animation={window.google.maps.Animation.DROP}
                            zIndex={999}
                            position={{
                                lat: center.lat,
                                lng: center.lng,
                            }}
                            icon={{
                                url: `/HomeMarker.svg`,
                                scaledSize: new window.google.maps.Size(37, 55),
                            }}
                            onClick={() =>
                                panTo({
                                    lat: center.lat,
                                    lng: center.lng,
                                })
                            }
                        />
                        {/* Maps Out All the Markers */}
                        {allMarkers.map((business) => (
                            <Marker
                                key={business.id}
                                category={business.type}
                                position={{
                                    lat: parseFloat(business.latitude),
                                    lng: parseFloat(business.longitude),
                                }}
                                onClick={() => {
                                    setSelectedBusiness(business);
                                }}
                                icon={{
                                    url: `/BLM-Toronto-Marker.svg`,
                                    origin: new window.google.maps.Point(0, 0),
                                    scaledSize: new window.google.maps.Size(
                                        28,
                                        40
                                    ),
                                }}
                            />
                        ))}
                        {/* Info Window */}
                        {selectedBusiness && (
                            <InfoWindow
                                data-testid="info-window"
                                options={{
                                    pixelOffset: new window.google.maps.Size(
                                        0,
                                        -25
                                    ),
                                }}
                                onCloseClick={() => {
                                    setSelectedBusiness(null);
                                }}
                                position={{
                                    lat: parseFloat(selectedBusiness.latitude),
                                    lng: parseFloat(selectedBusiness.longitude),
                                }}
                            >
                                <div className="InfoWindow">
                                    <div className="title-icon">
                                        <h2>{selectedBusiness.name}</h2>
                                        <button
                                            onClick={deleteBusiness}
                                            title="delete this business"
                                            className="delete-icon"
                                        >
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png"
                                                alt="delete"
                                            />
                                        </button>
                                    </div>
                                    <h3>{selectedBusiness.city}</h3>
                                    <h3>{selectedBusiness.type}</h3>
                                    <h4>
                                        {selectedBusiness.address},{" "}
                                        {selectedBusiness.postalCode}
                                    </h4>
                                    <p>{selectedBusiness.description}</p>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={selectedBusiness.website}
                                    >
                                        {selectedBusiness.website}
                                    </a>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                )}
            </div>
        </>
    );
}

export default FindBusiness;
