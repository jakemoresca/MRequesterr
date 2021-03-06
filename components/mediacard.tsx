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
            sx={{flexGrow: 1, width: { md: 250, xs: '100%' }, height: 368, }}
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
}

export default MediaCard;