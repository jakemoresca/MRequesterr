import { render } from '@testing-library/react'
import Home from '../pages/index'
import { ISettings } from '../models/settings'

jest.mock("../components/authenticate", () => (props) => {
  return (<mock-authenticate data-testid="authenticate">{props.children}</mock-authenticate>);
});

it('renders homepage unchanged', () => {
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

  const { container } = render(<Home settings={settings} movies={[]} series={[]} />)
  expect(container).toMatchSnapshot()
})