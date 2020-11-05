import React from 'react';
import ReactDOM from 'react-dom';
import Business from '..';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';

const sampleBusinesses = [{
   "id": "83",
   "name": "SHANSHAR",
   "type": "Hair, Barbers & Beauty",
   "city": "Brampton, ON",
   "website": "https://www.shanshar.com/",
   "description": "Our main goal is to WOW you by providing you with high-quality products & services. We offer kids' clothes, décor, beauty & hair care products. They are all fabulous for less.",
   "contactInfo": "https://www.facebook.com/shansharcanada/\r\nhttps://twitter.com/ShanSharbeauty\r\nhttps://www.instagram.com/shansharbeauty/\r\nhttps://studio.youtube.com/channel/UCsG0NBp9-1mtKBdkUe99l0g/videos/upload?filter=%5B%5D&sort=%7B%22columnType%22%3A%22date%22%2C%22sortOrder%22%3A%22DESCENDING%22%7D\r\nINFO@SHANSHAR.CA \r\n"
},
{
   "id": "84",
   "name": "REAL NATURELLE",
   "type": "Hair, Barbers & Beauty",
   "city": "Brampton, ON",
   "website": "https://realnaturelle.com/",
   "description": "Our mission is to provide our clients with natural, healthy and affordable hair & skin products that improve the overall look, feel and health of all skin and hair types.",
   "contactInfo": "1-844-REAL-323 (1-844-732-5323)\r\ninfo@realnaturelle.com\r\nhttps://www.facebook.com/realnaturelle\r\nhttps://instagram.com/realnaturelle_\r\nhttps://twitter.com/realnaturelle"
},
{
   "id": "86",
   "name": "PASSION HAIR EXTENSIONS",
   "type": "Hair, Barbers & Beauty",
   "city": "Brampton, ON",
   "website": "https://passionhair10.wixsite.com/passionhairsales",
   "description": "We are a trendsetting Online Hair Extensions Store, offering our first-rate products to shoppers from the comfort of their own homes.",
   "contactInfo": "passionhair10@gmail.com\r\n"
}
];

afterEach(cleanup);
it('Renders without crashing', () => {
   const div = document.createElement("div");
   ReactDOM.render(<Business businesses={sampleBusinesses} />, div);
});

describe('Renders a single business item, and check if the text content stemming in the component matches what is given in the businesses prop', () => {
   it('Checks if the business list has the class name of BusinessList', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('business-list')).toHaveClass("BusinessList", { exact: true });
   });
   it('Checks if the business list has a li element wrapped around the single business', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('single-business-list')).toContainHTML("li");
   });
   it('Checks if the business has the class name of Business', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('single-business-list')).toHaveClass("Business", { exact: true });
   })
   it('Checks if the business name is displayed as text content', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('single-business-list')).toHaveTextContent(sampleBusinesses.slice(0, 1)[0].name);
   });
   it('Checks if the business city is displayed as text content', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('single-business-list')).toHaveTextContent(sampleBusinesses.slice(0, 1)[0].city);
   });
   it('Checks if the business type is displayed as text content', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('single-business-list')).toHaveTextContent(sampleBusinesses.slice(0, 1)[0].type);
   });
   it('Checks if the business description is displayed as text content', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('single-business-list')).toHaveTextContent(sampleBusinesses.slice(0, 1)[0].description);
   });
   it('Checks if the business website is in the href attribute of the anchor tag', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('business-link')).toHaveAttribute("href", sampleBusinesses.slice(0, 1)[0].website);
   });
   it('Checks if the business website, excluding the https:// or http://, is displayed as text content', () => {
      const { getByTestId } = render(<Business businesses={sampleBusinesses.slice(0, 1)} />);
      expect(getByTestId('business-link')).toHaveTextContent(sampleBusinesses.slice(0, 1)[0].website.split("://")[1]);
   })
});

it('matches snapshot', () => {
   const tree = renderer.create(<Business businesses={sampleBusinesses} />).toJSON();
   expect(tree).toMatchSnapshot();
});