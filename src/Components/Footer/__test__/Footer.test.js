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

it('Renders the correct content', () => {
   const { getByTestId } = render(<Router><Footer /></Router>);
   expect(getByTestId("footer-logo")).toHaveTextContent("BLM-Toronto");
   expect(getByTestId("footer-logo")).toHaveAttribute("href", "/");
   expect(getByTestId("footer-logo")).toContainHTML("img");
   expect(getByTestId("github-link")).toHaveAttribute("href", "https://github.com/OwenWong0627/BLM-Toronto");
   expect(getByTestId("github-link")).toHaveAttribute("target", "_blank");
   expect(getByTestId("github-link")).toContainElement(getByTestId("github-icon"));
   expect(getByTestId("website-rights")).toHaveTextContent("© Owen Wong & Leo Wang. All rights reserved");
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><Footer /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});