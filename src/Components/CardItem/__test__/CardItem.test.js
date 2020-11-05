import React from 'react';
import ReactDOM from 'react-dom';
import CardItem from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Router><CardItem src="/someImage.png" text="sample-text" label="text" to='/sample-link' /></Router>, div);
});

describe('Renders a card item correctly, given the props passed into the component', () => {
   it('Checks if the card item has the image source matching the URL/image link given in the src prop of the component', () => {
      const { getByTestId } = render(<Router><CardItem
         src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
         text='Click for Map'
         label='Map'
         to='/map'
      /></Router>);
      expect(getByTestId('card-item-img')).toHaveAttribute("src", "http://ctt.trains.com/sitefiles/images/no-preview-available.png");
   });
   it('Checks if the text content of the card item is identical to the passed in text prop of the component', () => {
      const { getByTestId } = render(<Router><CardItem
         src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
         text='Click for Map'
         label='Map'
         to='/map'
      /></Router>);
      expect(getByTestId('card-item')).toHaveTextContent("Click for Map");
   });
   it('Checks if the card item has the data-category attribute matching the passed in label prop of the component', () => {
      const { getByTestId } = render(<Router><CardItem
         src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
         text='Click for Map'
         label='Map'
         to='/map'
      /></Router>);
      expect(getByTestId('card-item-label')).toHaveAttribute("data-category", "Map");
   });
   it('Checks if the card item is linked to the correct href to redirect users to', () => {
      const { getByTestId } = render(<Router><CardItem
         src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
         text='Click for Map'
         label='Map'
         to='/map'
      /></Router>);
      expect(getByTestId('card-item')).toHaveAttribute("href", "/map");
   });
});

it('matches snapshot', () => {
   const tree = renderer.create(<Router><CardItem
      src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
      text='Click for Map'
      label='Map'
      to='/map'
   /></Router>).toJSON();
   expect(tree).toMatchSnapshot();
});