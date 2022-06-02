import { render } from '@testing-library/react'
import React from 'react';
import { RecoilRoot } from 'recoil';
import Card from '../../components/card';

it('renders card unchanged', () => {
  const statistics = {
    percentOfEpisodes: 100
  }

  const { container } = render(<RecoilRoot><Card title="title" isAvailable={true} statistics={statistics} hasFile={true} imageUrl="test" /></RecoilRoot>)
  expect(container).toMatchSnapshot()
})