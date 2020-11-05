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

describe('Renders button with the correct text onte, class names, and attributes given the props in the component', () => {
   it('Checks if the button has the text content matching the label prop', () => {
      const { getByTestId } = render(<Router><Button label="CLICK ME PLEASE" type="button" /></Router>);
      expect(getByTestId('button')).toHaveTextContent("CLICK ME PLEASE");
   });
   it('Checks if the button has the button type of what is passed into the type prop of the component', () => {
      const { getByTestId } = render(<Router><Button label="CLICK ME PLEASE" type="button" /></Router>);
      expect(getByTestId('button')).toHaveAttribute("type", "button");
      expect(getByTestId('button')).not.toHaveAttribute("type", "submit");
   });
   it('Checks if the button class names are btn--primary and btn--medium when there are no variables passed into the buttonStyle and buttonSize prop', () => {
      const { getByTestId } = render(<Router><Button label="CLICK ME PLEASE" type="button" /></Router>);
      expect(getByTestId('button')).toHaveClass("btn--primary");
      expect(getByTestId('button')).toHaveClass("btn--medium");
   });
   it('Checks if the button class names are matching the buttonStyle and buttonSize props of the component', () => {
      const { getByTestId } = render(<Router><Button label="CLICK ME PLEASE" buttonStyle="btn--outline" buttonSize="btn--large" type="button" /></Router>);
      expect(getByTestId('button')).toHaveClass("btn--outline");
      expect(getByTestId('button')).toHaveClass("btn--large");
   });
});

it('Checks if the button is linked to the correct href to redirect users to', () => {
   const { getByTestId } = render(<Router><Button label="Find Business" type="button" /></Router>);
   expect(getByTestId('button-link')).toHaveAttribute("href", "/find-business");
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><Button label="CLICK ME PLEASE" buttonStyle="btn--outline" type="button" /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});