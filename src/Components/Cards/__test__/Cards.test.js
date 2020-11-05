import React from 'react';
import ReactDOM from 'react-dom';
import Cards from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Router><Cards /></Router>, div);
});

describe('Renders two CardItem components', () => {
   it('Checks if the cards component has the static title outlined in the component', () => {
      const { getByTestId } = render(<Router><Cards /></Router>);
      expect(getByTestId("cards")).toHaveTextContent("Check Out The App Features & Functionalities!");
   });
   it('Checks if the first card item with the Map description is rendered', () => {
      const { getByTestId } = render(<Router><Cards /></Router>);
      expect(getByTestId("cards")).toHaveTextContent("Explore The Map to Find Your Local Black-owned Business");
   });
   it('Checks if the second card item with the List Virtual Businesses description is rendered', () => {
      const { getByTestId } = render(<Router><Cards /></Router>);
      expect(getByTestId("cards")).toHaveTextContent("Check Out This Page to Find Your Local Black-owned Virtual Business");
   });
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><Cards /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});