import React from 'react';
import ReactDOM from 'react-dom';
import Searchbar from '..';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as usePlacesAutocompleteModules from "use-places-autocomplete";

const mockCenter = { lat: 43.1, lng: -79.6 };

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render((<Searchbar />), div);
});

it('Renders the searchbar and checks if the searchbar input area has a placeholder of Enter an address', () => {
   const { getByTestId } = render(<Searchbar />);
   expect(getByTestId("search-bar")).toHaveAttribute("placeholder", "Enter an address");
})

it('Renders the searchbar and checks if the manually set data values are displayed as text values in the searchbar combobox option', () => {
   usePlacesAutocompleteModules.default = jest.fn().mockReturnValue({
      ready: true,
      value: "",
      suggestions: { status: "OK", data: [{ place_id: "1", description: "Toronto, ON" }, { place_id: "2", description: "Mississauga, ON" }] },
      setValue: () => { },
      clearSuggestions: () => { }
   });
   const { getByText } = render(<Searchbar />);
   expect(getByText("Toronto, ON")).toBeInTheDocument();
   expect(getByText("Mississauga, ON")).toBeInTheDocument();
});

it('Renders the searchbar and checks if the manually set user input value is displayed in the search bar and has the correct suggestion', () => {
   usePlacesAutocompleteModules.default = jest.fn().mockReturnValue({
      ready: true,
      value: "Toron",
      suggestions: { status: "OK", data: [{ place_id: "1", description: "Toronto, ON, Canada" }, { place_id: "2", description: "Mississauga, ON, Canada" }] },
      setValue: () => { },
      clearSuggestions: () => { }
   });
   const { getByText, getByTestId } = render(<Searchbar />);
   expect(getByTestId("search-bar")).toHaveAttribute("value", "Toron");
   expect(getByText("Toron")).toBeInTheDocument();
   expect(getByText("to, ON, Canada")).toBeInTheDocument();
});