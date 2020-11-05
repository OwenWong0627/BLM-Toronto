import React from 'react';
import ReactDOM from 'react-dom';
import Stats from '..';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Stats />, div);
});

it('Renders the correct content', () => {
   const { getByTestId } = render(<Stats />);
   expect(getByTestId("stats")).toContainHTML("h2");
   expect(getByTestId("stats")).toHaveTextContent("100+");
   expect(getByTestId("stats")).toHaveTextContent("Businesses Included");
   expect(getByTestId("stats")).toHaveTextContent("10,000+");
   expect(getByTestId("stats")).toHaveTextContent("Searches Made");
});

it('matches snapshot', () => {
   const tree = renderer.create(<Stats />).toJSON();
   expect(tree).toMatchSnapshot();
});