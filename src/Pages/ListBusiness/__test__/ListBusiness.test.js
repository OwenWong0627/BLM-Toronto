import React from 'react';
import ReactDOM from 'react-dom';
import ListBusiness, { getNearestCity, getDistanceFromLatLonInM, sortAlphaAscending, sortAlphaDescending } from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

//Criteria
//(a) at least 2 working cases,
//(b) at least 1 non-working case,
//(c) any edge/corner cases (like divide by zero, or something that creates infinity, etc.).
afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Router><ListBusiness /></Router>, div);
});

it('Renders List Business page with the correct pagination feature(next page/previous page)', () => {
   const { getByTestId } = render(<Router><ListBusiness /></Router>);
   expect(getByTestId('pagination')).toContainHTML("ul");
   expect(getByTestId('pagination')).toContainElement(getByTestId("pagination-previous"));
   expect(getByTestId('pagination')).toContainElement(getByTestId("pagination-next"));
});

it("Renders List Business page's sortBy dropdown with the correct text content", () => {
   const { getByTestId } = render(<Router><ListBusiness /></Router>);
   expect(getByTestId('sortBy-menu')).toHaveTextContent("Default");
   expect(getByTestId('sortBy-menu')).toHaveTextContent("Name(A-Z)");
   expect(getByTestId('sortBy-menu')).toHaveTextContent("Name(Z-A)");
   expect(getByTestId('sortBy-menu')).toHaveTextContent("Nearest City");
})

describe('getNearestCity works as intended', () => {
   const center = { lat: 43.5789, lng: -79.6583 };
   test('getNearestCity calculates the nearest city from an array of city objects', () => {
      let cities = [
         { city: "Mississauga, ON", LatLng: { lat: 43.5769843, lng: -79.7745394 } },
         { city: "Etobicoke, ON", LatLng: { lat: 43.6723023, lng: -79.6928962 } },
         { city: "Brampton, ON", LatLng: { lat: 43.7248485, lng: -79.8996297 } }
      ]
      expect(getNearestCity(center, cities)).toBe("Mississauga, ON");
      expect(getNearestCity(center, cities)).not.toBe("Etobicoke, ON");
   });
   test('getNearestCity calculates the nearest city from cities that are very close to the center', () => {
      let cities = [
         { city: "Close to User City", LatLng: { lat: center.lat + 0.00001, lng: center.lng } },
         { city: "Very Close to User City", LatLng: { lat: center.lat, lng: center.lng - 0.00000000001 } },
         { city: "Very Very Close to User City", LatLng: { lat: center.lat + 0.000000000000000000001, lng: center.lng - 0.00000000000000000001 } }
      ]
      expect(getNearestCity(center, cities)).toBe("Very Very Close to User City");
   });
   test('getNearestCity returns a null value when the lat or lng value is not a number', () => {
      let cities = [{ city: 123456789, LatLng: { lat: "center.lat + 0.00001", lng: "center.lng" } }];
      expect(getNearestCity(center, cities)).toBeNull();
   })
});

describe('getDistanceFromLatLonInM works as intended', () => {
   test('getDistanceFromLatLonInM returns 0 when the two points are identical', () => {
      expect(getDistanceFromLatLonInM(40.31234, 40.31234, -72.420, -72.420)).toBe(0);
   });
   test('getDistanceFromLatLonInM returns a small value in meters when the two points are close to eachother', () => {
      expect(getDistanceFromLatLonInM(40.3123, 40.31234, -72.420, -72.420)).toBeLessThan(1000);
   });
   test('getDistanceFromLatLonInM returns a null value when accepting a non-number parameter', () => {
      expect(getDistanceFromLatLonInM("String", 40.31234, -72.420, -72.420)).toBeNull();
   });
   test('getDistanceFromLatLonInM returns a null value when the distance calculated is longer then the longest distance possible from two points on the Earth', () => {
      expect(getDistanceFromLatLonInM(90, -90, 180, -181)).toBeNull();
   });
});

describe('sortAlphaAscending works as intended', () => {
   test('sortAlphaAscending sorts an array of objects properly from A-Z by the values associated with the name key', () => {
      expect(sortAlphaAscending([{ name: "haha" }, { name: "aaaaa" }, { name: "zzzzz" }])).toMatchObject([{ name: "aaaaa" }, { name: "haha" }, { name: "zzzzz" }]);
      expect(sortAlphaAscending([{ name: "AAAAA" }, { name: "aaaaa" }, { name: "zzzzz" }])).toMatchObject([{ name: "AAAAA" }, { name: "aaaaa" }, { name: "zzzzz" }]);
   });
   test('sortAlphaAscending returns a null value when one of the names of one of the objects is not a string', () => {
      expect(sortAlphaAscending([{ name: 12321323 }, { name: "aaaaa" }, { name: "zzzzz" }])).toBeNull();
   })
});

describe('sortAlphaDescending works as intended', () => {
   test('sortAlphaDescending sorts an array of objects properly from A-Z by the values associated with the name key', () => {
      expect(sortAlphaDescending([{ name: "haha" }, { name: "aaaaa" }, { name: "zzzzz" }])).toMatchObject([{ name: "zzzzz" }, { name: "haha" }, { name: "aaaaa" }]);
      expect(sortAlphaDescending([{ name: "AAAAA" }, { name: "aaaaa" }, { name: "zzzzz" }])).toMatchObject([{ name: "zzzzz" }, { name: "AAAAA" }, { name: "aaaaa" }]);
   });
   test('sortAlphaAscending returns a null value when one of the names of one of the objects is not a string', () => {
      expect(sortAlphaDescending([{ name: 12321323 }, { name: "aaaaa" }, { name: "zzzzz" }])).toBeNull();
   });
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><ListBusiness /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});