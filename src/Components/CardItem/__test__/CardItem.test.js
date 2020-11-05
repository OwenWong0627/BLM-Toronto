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

it('Renders a card item correctly', () => {
   const { getByTestId } = render(<Router><CardItem
      src='http://ctt.trains.com/sitefiles/images/no-preview-available.png'
      text='Click for Map'
      label='Map'
      to='/map'
   /></Router>);
   expect(getByTestId('card-item')).toHaveTextContent("Click for Map");
   expect(getByTestId('card-item')).toHaveAttribute("href", "/map");
   expect(getByTestId('card-item-label')).toHaveAttribute("data-category", "Map");
   expect(getByTestId('card-item-img')).toHaveAttribute("src", "http://ctt.trains.com/sitefiles/images/no-preview-available.png");
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