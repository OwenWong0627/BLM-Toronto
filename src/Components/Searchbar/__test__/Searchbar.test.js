import React from 'react';
import ReactDOM from 'react-dom';
import Searchbar from '..';

import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

const mockCenter = { lat: 43.1, lng: -79.6 };

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render((<Searchbar />), div);
});

// test('if the onChange in the component is responsive', () => {
//    const mockFunction = jest.fn();
//    const { getByTestId } = render(<Searchbar panTo={mockFunction} center={mockCenter} className="class" />);
//    fireEvent.change(getByTestId("input"), { target: { value: 'Toronto' } });
//    fireEvent.click(screen.getByText("Toronto, ON, Canada"));
//    console.log(mockFunction.mock.calls[0][0]);
//    expect(mockFunction.mock.calls[0][0]).toEqual(mockCenter);
// });

it('matches snapshot', () => {
   const tree = renderer.create(<Searchbar />).toJSON();
   expect(tree).toMatchSnapshot();
});