import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { ChangeEventHandler, KeyboardEventHandler, useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { convertSearchResultToMedia, searchTmdb } from '../api/tmdb';
import { ISettings } from '../../models/settings';
import { getSettings } from '../api/settings';
import { Container, Input } from 'reactstrap';
import { searchResultState } from '../../states/search';
import { ITmdbSearchResult, MediaType } from '../../models/tmdbSearch';

export interface ITVProps {
    settings: ISettings;
}

const TV: NextPage<ITVProps> = (props) => {
    const router = useRouter();
    const { search } = router.query;
    const [searchResults, setSearchResult] = useRecoilState(searchResultState);
    const [searchText, setSearchText] = useState<string>(search as string);

    useEffect(() => {
        fetchData(searchText, setSearchResult, props.settings);
    }, [])

    const handleSearch: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === 'Enter') {
            fetchData(searchText, setSearchResult, props.settings);
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.currentTarget.value);
    }

    return (<Container fluid>
        <Input type="search" placeholder="Search" onKeyUp={handleSearch} onChange={handleChange} value={searchText} />

        { searchResults?.map((searchResult, index) => {
            return (<MediaCard key={index} media={convertSearchResultToMedia(searchResult)} />)
        })
        }

        { searchResults?.length == 0 && 
            <h5 className='align-center'>It's easy to add a new request, just start typing the name of the movie / series you want to add</h5>
        }
    </Container>);
}

async function fetchData(query: string, setSearchResult: SetterOrUpdater<ITmdbSearchResult[]>, settings: ISettings) {

    if (query.trim().length > 0) {
        const searchResult = searchTmdb(query);
        const medias = (await searchResult).filter(x => x.media_type != MediaType.Person);

        setSearchResult(medias);
    }
    else {
        setSearchResult([]);
    }
}

export async function getServerSideProps() {
    const settings = await getSettings();
    return { props: { settings } }
}


export default TV;