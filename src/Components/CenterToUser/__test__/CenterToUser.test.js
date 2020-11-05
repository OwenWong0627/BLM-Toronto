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

test('if the onClick in the component is responsive', () => {
   const mockFunction = jest.fn();
   const { getByTestId } = render(<CenterToUser panTo={mockFunction} center={mockCenter} />);
   fireEvent.click(getByTestId("centerToUser-button"));
   expect(mockFunction.mock.calls[0][0]).toEqual(mockCenter);
});

it('matches snapshot', () => {
   const tree = renderer.create(<CenterToUser />).toJSON();
   expect(tree).toMatchSnapshot();
});