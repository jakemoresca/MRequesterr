import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { Button, Card as BootstrapCard, CardBody, CardImg, CardSubtitle, CardTitle } from 'reactstrap';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { mediaState, MediaStateType } from '../../states/movie';
import { convertToMedia, getSeries } from '../api/tmdb';

const TV: NextPage = () => {
    const [media, setMediaState] = useRecoilState(mediaState);
    const router = useRouter();
    const { title } = router.query;

    useEffect(() => {
        fetchData(title as string, setMediaState);
    }, [])

    return (
        <BootstrapCard color="dark" outline inverse className="bg-dark col-12">
            <div className="row g-0">
                <div className="col-md-2">
                    <CardImg alt={media?.title} src={media?.images[0].url} top height={368} width={250} className="rounded-start w-auto" />
                </div>
                <div className="col-md-10">
                    <CardBody>
                        <CardTitle tag="h2">
                            {media?.title}
                        </CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            {media?.overview}
                        </CardSubtitle>
                        <Button color="primary">
                            Request
                        </Button>
                    </CardBody>
                </div>
            </div>
        </BootstrapCard>
    );
}

async function fetchData(title: string, setMediaState: SetterOrUpdater<MediaStateType>) {
    const series = await getSeries(title);
    const movieMedia = convertToMedia(series);

    setMediaState(movieMedia);
}


export default TV;