import React from 'react';
import ReactDOM from 'react-dom';
import CenterToUser from '..';

import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

const mockCenter = { lat: 43.1, lng: -79.6 };

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<CenterToUser />, div);
});

describe('Renders the CenterToUser component with the correct HTML elements and attributes', () => {
   it('Checks if the component has an HTML element of button', () => {
      const { getByTestId } = render(<CenterToUser />);
      expect(getByTestId("centerToUser-button")).toContainHTML("button");
   });
   it('Checks if the component has a button element with a class name of centerToUser', () => {
      const { getByTestId } = render(<CenterToUser />);
      expect(getByTestId("centerToUser-button")).toHaveClass("centerToUser");
   });
   it('Checks if the component has a button element with a type of button', () => {
      const { getByTestId } = render(<CenterToUser />);
      expect(getByTestId("centerToUser-button")).toHaveAttribute("type", "button");
   });
});

test('When clicked, the component executes the panTo function with the center argument', () => {
   const mockFunction = jest.fn();
   const { getByTestId } = render(<CenterToUser panTo={mockFunction} center={mockCenter} />);
   fireEvent.click(getByTestId("centerToUser-button"));
   expect(mockFunction.mock.calls[0][0]).toEqual(mockCenter);
});

it('matches snapshot', () => {
   const tree = renderer.create(<CenterToUser />).toJSON();
   expect(tree).toMatchSnapshot();
});