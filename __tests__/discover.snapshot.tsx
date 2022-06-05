import { render } from '@testing-library/react'
import React from 'react';
import { RecoilRoot } from 'recoil';
import { ISettings } from '../models/settings'
import Discover from '../pages/discover';

jest.mock("../components/authenticate", () => (props) => {
  return (<mock-authenticate data-testid="authenticate">{props.children}</mock-authenticate>);
});

jest.mock("../components/carousel", () => () => {
  return (<mock-carousel data-testid="carousel"></mock-carousel>);
});

jest.mock('../pages/api/tmdb', () => {
  return {
    convertToMedia: () => [],
    getPopularMovies: () => ({ results: [] }),
    getPopularSeries: () => ({ results: [] })
  }
})

it('renders discover unchanged', () => {
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

  const { container } = render(<RecoilRoot override={true}><Discover settings={settings} /></RecoilRoot>)
  expect(container).toMatchSnapshot()
})