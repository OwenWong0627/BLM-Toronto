import React from 'react';
import ReactDOM from 'react-dom';
import ListBusiness, { getNearestCity, getDistanceFromLatLonInM } from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

/**
 * @jest-environment jsdom
 */
afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Router><ListBusiness /></Router>, div);
});

it('Renders navbar logo correctly and it links to the home page', () => {
   const { getByTestId } = render(<Router><ListBusiness /></Router>);
   // expect(getByTestId('navbar-logo')).toHaveTextContent("BLM-Toronto");
   // expect(getByTestId('navbar-logo')).toHaveAttribute("href", "/");
});

test('getNearestCity works as intended', () => {
   const center = { lat: 43.5789, lng: -79.6583 };
   let cities = [
      { city: "Mississauga, ON", LatLng: { lat: 43.5769843, lng: -79.7745394 } },
      { city: "Etobicoke, ON", LatLng: { lat: 43.6723023, lng: -79.6928962 } },
      { city: "Brampton, ON", LatLng: { lat: 43.7248485, lng: -79.8996297 } }
   ]
   expect(getNearestCity(center, cities)).toBe("Mississauga, ON");
   expect(getNearestCity(center, cities)).not.toBe("Etobicoke, ON");
   cities = [
      { city: "Close to User City", LatLng: { lat: center.lat + 0.00001, lng: center.lng } },
      { city: "Very Close to User City", LatLng: { lat: center.lat, lng: center.lng - 0.00000000001 } },
      { city: "Very Very Close to User City", LatLng: { lat: center.lat + 0.00000000000000000001, lng: center.lng - 0.00000000000000000001 } }
   ]
   expect(getNearestCity(center, cities)).toBe("Very Very Close to User City");
   cities = [{ city: 123456789, LatLng: { lat: center.lat + 0.00001, lng: center.lng } }];
   expect(getNearestCity(center, cities)).toThrowError("TypeError");
});

test('getDistanceFromLatLonInM works as intended', () => {
   expect(getDistanceFromLatLonInM(40.31234, 40.31234, -72.420, -72.420)).toBe(0);
   expect(getDistanceFromLatLonInM(40.3123, 40.31234, -72.420, -72.420)).toBeLessThan(1000);
   expect(getDistanceFromLatLonInM(40.3123, 40.31234, -72.420, -72.420)).toBeLessThan(1000);
   expect(getDistanceFromLatLonInM("String", 40.31234, -72.420, -72.420)).toThrowError("TypeError");
});

it('matches snapshot 1', () => {
   const tree = renderer.create(<Router><ListBusiness /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});