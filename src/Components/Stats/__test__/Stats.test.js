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

describe('Renders the Stats component with the text content oulined in the component', () => {
   it('Checks if the first stats contain the text content of 100+ and Businesses Included', () => {
      const { getByTestId } = render(<Stats />);
      expect(getByTestId("stats-1")).toHaveTextContent("100+");
      expect(getByTestId("stats-1")).toHaveTextContent("Businesses Included");
   });
   it('Checks if the second stats contain the text content of 10,000+ and Searches Made', () => {
      const { getByTestId } = render(<Stats />);
      expect(getByTestId("stats-2")).toHaveTextContent("10,000+");
      expect(getByTestId("stats-2")).toHaveTextContent("Searches Made");
   });
});

it('matches snapshot', () => {
   const tree = renderer.create(<Stats />).toJSON();
   expect(tree).toMatchSnapshot();
});