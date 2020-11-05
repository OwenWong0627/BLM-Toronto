import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Router><Navbar /></Router>, div);
});

it('Renders navbar logo correctly and it links to the home page', () => {
   const { getByTestId } = render(<Router><Navbar /></Router>);
   expect(getByTestId('navbar-logo')).toHaveTextContent("BLM-Toronto");
   expect(getByTestId('navbar-logo')).toHaveAttribute("href", "/");
});

const links = [
   { text: 'Home', location: "/" },
   { text: 'Virtual Businesses Near Me', location: "/list-business/" }
];

test.each(links)(
   "Check if Nav Bar has %s link.",
   (link) => {
      render(<Router><Navbar /></Router>);
      const linkDom = screen.getByText(link.text);
      expect(linkDom).toHaveAttribute("href", link.location);
   }
);

test('the button triggers the handleClick and closeMobileMenu function as intended', () => {
   const { getByTestId } = render(<Router><Navbar /></Router>);
   expect(getByTestId('mobile-menu-icon')).toHaveClass('fas fa-bars');
   fireEvent.click(getByTestId('mobile-menu-icon'));
   expect(getByTestId('mobile-menu-icon')).toHaveClass('fas fa-times');
   fireEvent.click(getByTestId('navbar-logo'));
   expect(getByTestId('mobile-menu-icon')).toHaveClass('fas fa-bars');
});

it('Renders the mobile navbar button correctly and it links to the correct page', () => {
   const { getByTestId } = render(<Router><Navbar /></Router>);
   expect(getByTestId('mobile-button')).toHaveTextContent("Find a Business");
   expect(getByTestId('mobile-button')).toHaveAttribute("href", "/find-business");
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><Navbar /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});