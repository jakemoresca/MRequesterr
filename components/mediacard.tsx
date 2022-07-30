import { MediaStateType } from "../states/media";
// import { Badge, Button, Card as BootstrapCard, Card, CardBody, CardImg, CardSubtitle, CardTitle } from 'reactstrap';
import { CardMedia, CardContent, Typography, CardActions, Button, Card, Chip } from "@mui/material";

export interface IMediaCardProps {
    media: MediaStateType
    handleRequest?: () => void;
    isDirty?: boolean;
}

const MediaCard = (props: IMediaCardProps) => {

    const media = props.media;

    return (<Card sx={{display: 'flex', flexDirection: 'row'}}>
        <CardMedia
            component="img"
            image={media?.images[0].url}
            alt={media?.title}
            sx={{width: 250, height: 368}}
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {media?.title}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
                {media?.year}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1}}>
                {media?.overview}
            </Typography>
            {(!media?.isAvailable || props.isDirty) && props.handleRequest &&
                <Button color="primary" variant="contained" onClick={props.handleRequest}>
                    Request
                </Button>
            }
            { media?.hasFile && <Chip label="Downloaded" color="success" /> }
        </CardContent>
    </Card>)

    // return (<BootstrapCard color="dark" outline inverse className="bg-dark col-12">
    //     <div className="row g-0">
    //         <div className="col-md-2">
    //             <CardImg alt={media?.title} src={media?.images[0].url} top height={368} width={250} className="rounded-start w-auto" />
    //         </div>
    //         <div className="col-md-10">
    //             <CardBody>
    //                 <CardTitle tag="h2">
    //                     {media?.title}
    //                 </CardTitle>
    //                 <CardSubtitle className="mb-2 text-muted" tag="h6">
    //                     {media?.year}
    //                 </CardSubtitle>
    //                 <CardSubtitle className="mb-2 text-muted" tag="h6">
    //                     {media?.overview}
    //                 </CardSubtitle>
    //                 {(!media?.isAvailable || props.isDirty) && props.handleRequest &&
    //                     <Button color="primary" onClick={props.handleRequest}>
    //                         Request
    //                     </Button>
    //                 }
    //                 {media?.hasFile &&
    //                     <Badge color="success">Downloaded</Badge>
    //                 }
    //             </CardBody>
    //         </div>
    //     </div>
    // </BootstrapCard>);
}

export default MediaCard;