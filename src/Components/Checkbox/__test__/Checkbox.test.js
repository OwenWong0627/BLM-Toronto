import React from 'react';
import ReactDOM from 'react-dom';
import Checkbox from '..';

import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

const mockCheckboxes = [
   { name: "Category 1" },
   { name: "Category 2" },
   { name: "Category 3" },
   { name: "Category 4" },
   { name: "Category 5" }
];

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(mockCheckboxes.map(item => (
      <Checkbox
         key={item.name}
         name={item.name}
         checked={true}
         onChange={() => { }}
      />)), div);
});

//Kinda bad
//I wanted to try fireEvent.change, and change the 'checked' prop to false, but i think react, quoted from another person:
//"internally uses click event for checkboxes (and radio inputs)—although mapping it to the onChange handler passed as prop."
test('if the onChange in the component is responsive', () => {
   const mockFunction = jest.fn();
   const { getByTestId } = render(<Checkbox key="Category 0" name="Category 0" checked={false} onChange={mockFunction} />);
   fireEvent.click(getByTestId("checkbox"));
   expect(mockFunction.mock.calls.length).toBe(1);
});

it('matches snapshot', () => {
   const tree = renderer.create(mockCheckboxes.map(item => (
      <Checkbox
         key={item.name}
         name={item.name}
         checked={true}
         onChange={() => { }}
      />))).toJSON();
   expect(tree).toMatchSnapshot();
});