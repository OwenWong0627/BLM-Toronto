import React from 'react';
import ReactDOM from 'react-dom';
import Button from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Router><Button label="haha" type="button" /></Router>, div);
});

it('Renders button correctly', () => {
   const { getByTestId } = render(<Router><Button label="Click to Find Business" buttonStyle="btn--primary" type="button" /></Router>);
   expect(getByTestId('button')).toHaveTextContent("Click to Find Business");
   expect(getByTestId('button')).toHaveClass("btn--primary");
   expect(getByTestId('button')).toHaveAttribute("type", "button");
});

it('Renders button correctly', () => {
   const { getByTestId } = render(<Router><Button label="CLICK ME PLEASE" buttonStyle="btn--outline" buttonSize="btn--medium" type="button" /></Router>);
   expect(getByTestId('button')).toHaveTextContent("CLICK ME PLEASE");
   expect(getByTestId('button')).toHaveClass("btn--outline");
   expect(getByTestId('button')).toHaveClass("btn--medium");
   expect(getByTestId('button')).not.toHaveAttribute("type", "submit");
});

it('Renders button with correct href', () => {
   const { getByTestId } = render(<Router><Button label="Find Business" buttonStyle="btn--outline" type="button" /></Router>);
   expect(getByTestId('button-link')).toHaveAttribute("href", "/find-business");
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><Button label="CLICK ME PLEASE" buttonStyle="btn--outline" type="button" /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});