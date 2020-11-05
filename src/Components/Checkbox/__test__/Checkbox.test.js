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

describe('Renders a checkbox with the correct text content and default checked value', () => {
   it('Checks if the checkbox component has the type attribute of checkbox', () => {
      const { getByTestId } = render(<Checkbox key="Category 0" name="Category 0" checked={false} onChange={() => { }} />);
      expect(getByTestId("checkbox")).toHaveAttribute("type", "checkbox");
   })
   it('Checks if the checkbox component has the text content matching the name prop of the component', () => {
      const { getByTestId } = render(<Checkbox key="Category 0" name="Category 0" checked={false} onChange={() => { }} />);
      expect(getByTestId("checkbox-text")).toHaveTextContent("Category 0");
   });
   it('Checks if the checkbox component has the default checked value matching the boolean checked prop of the component', () => {
      const { getByTestId } = render(<Checkbox key="Category 0" name="Category 0" checked={false} onChange={() => { }} />);
      expect(getByTestId("checkbox")).not.toBeChecked();
   });
});

test('When clicked once, the onChange of the component is only executed once', () => {
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