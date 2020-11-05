import React from 'react';
import FindBusiness, { getUserLocation } from '..';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(cleanup);
describe('Renders FindBusiness Map page without crashing', () => {
   it('shows a loading text', () => {
      const { getByText } = render(<Router><FindBusiness /></Router>);

      expect(getByText(/Loading.../i)).toBeInTheDocument();
   });
});

test('User location is able to be retrieved', async () => {

   const data = await getUserLocation(`https://ipinfo.io/8.8.8.8/json`);
   expect(data).toEqual({ "lat": 37.4056, "lng": -122.0775 });
});