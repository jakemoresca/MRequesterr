import { MediaStateType } from "../states/movie";
import { Button, Card as BootstrapCard, CardBody, CardImg, CardSubtitle, CardTitle } from 'reactstrap';

export interface IMediaCardProps {
    media: MediaStateType
}

const MediaCard = (props: IMediaCardProps) => {

    const media = props.media;

    return (<BootstrapCard color="dark" outline inverse className="bg-dark col-12">
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
                        {media?.year}
                    </CardSubtitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                        {media?.overview}
                    </CardSubtitle>
                    {!media?.isAvailable &&
                        <Button color="primary">
                            Request
                        </Button>
                    }
                </CardBody>
            </div>
        </div>
    </BootstrapCard>);
}

export default MediaCard;