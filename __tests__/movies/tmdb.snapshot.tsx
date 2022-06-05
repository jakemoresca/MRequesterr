import { render } from '@testing-library/react'
import React from 'react';
import { RecoilRoot } from 'recoil';
import { IRadarrMovie, SourceType } from '../../models/radarrMovies';
import Movie from '../../pages/movies/[tmdbId]';
import { MediaStateType } from '../../states/media';
import { ISettings } from '../models/settings'

jest.mock("../../components/authenticate", () => (props) => {
  return (<mock-authenticate data-testid="authenticate">{props.children}</mock-authenticate>);
});

const media: MediaStateType = {
  id: "",
  tmdbId: "",
  overview: "",
  imdbId: "",
  cleanTitle: "",
  sortTitle: "",
  title: "",
  titleSlug: "",
  status: "",
  monitored: false,
  minimumAvailability: "",
  runtime: 0,
  images: [{ coverType: "poster", url: "" }],
  path: "",
  year: 1,
  genres: [],
  isAvailable: false,
  hasFile: false,
  statistics: {
    percentOfEpisodes: 0
  }
}

const radarrLookup: IRadarrMovie = {
  ...media,
  originalTitle: "",
  originalLanguage: { id: 0, name: "" },
  alternateTitles: [{ sourceType: SourceType.Tmdb, movieId: 0, title: "", sourceId: 0, votes: 0, voteCount: 0, language: { id: 0, name: "" } }],
  secondaryYearSourceId: 0,
  sizeOnDisk: 0,
  inCinemas: new Date,
  physicalRelease: new Date,
  digitalRelease: new Date,
  website: "",
  remotePoster: "",
  youTubeTrailerId: "",
  studio: "",
  qualityProfileId: 0,
  folderName: "",
  folder: "",
  certification: "",
  tags: [],
  added: new Date,
  addOptions: { searchForMovie: false },
  rootFolderPath: "",
  apikey: "",
  tmdbId: 0,
  id: 0
}

jest.mock('../../pages/api/movies', () => {
  return {
    getMovies: () => [],
    getQueue: () => [],
    getPopularSeries: () => ({ results: [] }),
    requestMovie: () => { },
    getMovieLookup: () => radarrLookup
  }
})

jest.mock('../../pages/api/tmdb', () => {
  return {
    convertToMedia: () => media,
    getMovie: () => { }
  }
})

jest.mock('next/router', () => ({
  useRouter() {
    return ({
      query: {
        tmdbId: ""
      },
    });
  },
}));

it('renders movie page unchanged', () => {
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

  const { container } = render(<RecoilRoot override={true}><Movie settings={settings} /></RecoilRoot>)
  expect(container).toMatchSnapshot()
});