import React from 'react';
import ReactDOM from 'react-dom';
import Hero from '..';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Hero />, div);
});

it('Renders the correct content', () => {
   const { getByTestId } = render(<Hero />);
   expect(getByTestId("hero")).toHaveTextContent("DISCOVER LOCAL BLACK-OWNED BUSINESSES & BLACK ENTREPRENEURS");
   expect(getByTestId("hero")).toHaveTextContent("Location Searching Tool to Locate Local Black-Owned Businesses");
});

it('matches snapshot', () => {
   const tree = renderer.create(<Hero />).toJSON();
   expect(tree).toMatchSnapshot();
});