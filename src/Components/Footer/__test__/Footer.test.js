import React from 'react';
import ReactDOM from 'react-dom';
import Footer from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

afterEach(cleanup);
it("renders without crashing", () => {
   const div = document.createElement("div");
   ReactDOM.render(<Router><Footer /></Router>, div);
});

describe('Renders the correct content and attributes in the footer', () => {
   const { getByTestId } = render(<Router><Footer /></Router>);
   it('Checks if the footer logo has the text content of BLM-Toronto', () => {
      const { getByTestId } = render(<Router><Footer /></Router>);
      expect(getByTestId("footer-logo")).toHaveTextContent("BLM-Toronto");
   });
   it('Checks if the footer logo has the image html element', () => {
      const { getByTestId } = render(<Router><Footer /></Router>);
      expect(getByTestId("footer-logo")).toHaveAttribute("href", "/");
   });
   it('Checks if the Github link in the footer links to the correct URL', () => {
      const { getByTestId } = render(<Router><Footer /></Router>);
      expect(getByTestId("github-link")).toHaveAttribute("href", "https://github.com/OwenWong0627/BLM-Toronto");
   });
   it('Checks if the Github link in the footer redirects the URL to a new page', () => {
      const { getByTestId } = render(<Router><Footer /></Router>);
      expect(getByTestId("github-link")).toHaveAttribute("target", "_blank");
   });
   it('Checks if the Github link of the logo has the image with the testId of github-icon', () => {
      const { getByTestId } = render(<Router><Footer /></Router>);
      expect(getByTestId("github-link")).toContainElement(getByTestId("github-icon"));
   });
   it('Checks if the website rights section of the footer has the text content outlined in the component', () => {
      const { getByTestId } = render(<Router><Footer /></Router>);
      expect(getByTestId("website-rights")).toHaveTextContent("© Owen Wong & Leo Wang. All rights reserved");
   })
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><Footer /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});