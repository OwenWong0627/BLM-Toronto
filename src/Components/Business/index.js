import React from "react";
import firebase from "../../utils/firebase";

/**
 * This component represents an array of businesses that will listed on the "List Virtual Businesses Near Me"
 * page. The length of the businesses array of objects prop passed in this component will determine
 * how many li tags will be created for the businesses to be rendered on the page.
 */
const Business = ({ business }) => {
    const deleteBusiness = () => {
        const businessRef = firebase
            .database()
            .ref("virtualBusinesses")
            .child(business.id);
        businessRef.remove();
    };
    return (
        <>
            <li
                data-testid="single-business-list"
                className="Business"
                key={business.id}
            >
                <div className="title-icon">
                    <h2>{business.name}</h2>
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
                <h3>{business.city}</h3>
                <h3>{business.type}</h3>
                <p>{business.description}</p>
                <a
                    data-testid="business-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={business.website}
                >
                    {business.website.split("://")[1]}
                </a>
            </li>
        </>
    );
};

export default Business;
