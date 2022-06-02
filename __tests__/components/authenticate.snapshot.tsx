import { render } from '@testing-library/react'
import React from 'react';
import { RecoilRoot } from 'recoil';
import Authenticate from '../../components/authenticate';
import { ISettings } from '../../models/settings';

it('renders authenticate unchanged', () => {
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

  const { container } = render(<RecoilRoot><Authenticate settings={settings} /></RecoilRoot>)
  expect(container).toMatchSnapshot()
})