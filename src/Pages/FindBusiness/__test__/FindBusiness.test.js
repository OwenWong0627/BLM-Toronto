import * as ReactModule from 'react';
import React from 'react';
import FindBusiness from '..';
import * as GoogleMapsAPI from '@react-google-maps/api';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

const baseMockCenter = { lat: 43.1, lng: -79.2 };
afterEach(cleanup);
describe('Renders FindBusiness Map page without crashing', () => {
   it('Shows a loading text', () => {
      const { getByText } = render(<Router><FindBusiness /></Router>);
      expect(getByText(/Loading.../i)).toBeInTheDocument();
   });
   it('Removes the loading text and renders the Googlemap', () => {
      GoogleMapsAPI.default.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      GoogleMapsAPI.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      ReactModule.useState = jest.fn()
         .mockImplementationOnce(initialState => [false, () => { }])
         .mockImplementationOnce(initialState => [baseMockCenter, () => { }])
         .mockImplementation(initialState => [initialState, () => { }]);
      const { getByTestId } = render(<Router><FindBusiness /></Router>);
      expect(getByTestId("map")).toBeInTheDocument();
   });
   it('Removes the loading text and renders the Home Button', () => {
      GoogleMapsAPI.default.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      GoogleMapsAPI.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      ReactModule.useState = jest.fn()
         .mockImplementationOnce(initialState => [false, () => { }])
         .mockImplementationOnce(initialState => [baseMockCenter, () => { }])
         .mockImplementation(initialState => [initialState, () => { }]);
      const { getByTestId } = render(<Router><FindBusiness /></Router>);
      expect(getByTestId("home-button")).toBeInTheDocument();
   });
   it('Removes the loading text and renders the sidebar with the apply filter button and checkbox list', () => {
      GoogleMapsAPI.default.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      GoogleMapsAPI.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      ReactModule.useState = jest.fn()
         .mockImplementationOnce(initialState => [false, () => { }])
         .mockImplementationOnce(initialState => [baseMockCenter, () => { }])
         .mockImplementation(initialState => [initialState, () => { }]);
      const { getByTestId } = render(<Router><FindBusiness /></Router>);
      expect(getByTestId("sidebar")).toBeInTheDocument();
      expect(getByTestId("checkbox-filter")).toBeInTheDocument();
      expect(getByTestId("filter-button")).toBeInTheDocument();
   });
   it('Removes the loading text and renders the centerToUser button', () => {
      GoogleMapsAPI.default.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      GoogleMapsAPI.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      ReactModule.useState = jest.fn()
         .mockImplementationOnce(initialState => [false, () => { }])
         .mockImplementationOnce(initialState => [baseMockCenter, () => { }])
         .mockImplementation(initialState => [initialState, () => { }]);
      const { getByTestId } = render(<Router><FindBusiness /></Router>);
      expect(getByTestId("centerToUser-button")).toBeInTheDocument();
   });
   it('Removes the loading text and renders the search bar', () => {
      GoogleMapsAPI.default.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      GoogleMapsAPI.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
      ReactModule.useState = jest.fn()
         .mockImplementationOnce(initialState => [false, () => { }])
         .mockImplementationOnce(initialState => [baseMockCenter, () => { }])
         .mockImplementation(initialState => [initialState, () => { }]);
      const { getByTestId } = render(<Router><FindBusiness /></Router>);
      expect(getByTestId("search-bar")).toBeInTheDocument();
   });
});

it('matches snapshot', () => {
   GoogleMapsAPI.default.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
   GoogleMapsAPI.useLoadScript = jest.fn().mockReturnValue({ isLoaded: true, loadError: null });
   ReactModule.useState = jest.fn()
      .mockImplementationOnce(initialState => [false, () => { }])
      .mockImplementationOnce(initialState => [baseMockCenter, () => { }])
      .mockImplementation(initialState => [initialState, () => { }]);
   const tree = renderer.create(<Router><FindBusiness /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});