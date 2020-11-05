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

it('Renders the correct content', () => {
   const { getByTestId } = render(<Router><Cards /></Router>);
   expect(getByTestId("cards")).toHaveTextContent("Check Out The App Features & Functionalities!");
   expect(getByTestId("cards")).toContainElement(getByTestId("card-list"));
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><Cards /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});