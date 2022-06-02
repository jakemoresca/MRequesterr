import { render } from '@testing-library/react'
import React from 'react';
import { ISettings } from '../models/settings'
import Requests from '../pages/requests';

jest.mock("../components/authenticate", () => (props) => {
  return (<mock-authenticate data-testid="authenticate">{props.children}</mock-authenticate>);
});

it('renders requests unchanged', () => {
  const settings: ISettings = {
    "integrationSettings": {
      "movies": {
        "baseUrl": "/radarr",
        "apiKey": "",
        "host": "test.web.com",
        "port": 443,
        "useSsl": true
      },
      "series": {
        "baseUrl": "/sonarr",
        "apiKey": "",
        "host": "test.web.com",
        "port": 443,
        "useSsl": true
      },
      "auth": {
        "baseUrl": "/jellyfin",
        "apiKey": "",
        "host": "test.web.com",
        "port": 443,
        "useSsl": true
      }
    }
  }

  const { container } = render(<Requests settings={settings} movies={[]} series={[]} />)
  expect(container).toMatchSnapshot()
})