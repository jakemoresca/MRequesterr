import { Badge, Card as MUICard, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { IStatistics } from "../models/media";
import CheckboxIcon from '@mui/material/Checkbox';
import DownloadingIcon from '@mui/icons-material/Downloading';

export interface ICardProps {
    imageUrl?: string;
    title: string;
    itemType?: string;
    isAvailable: boolean;
    statistics: IStatistics
    showProgress?: boolean;
    tmdbId?: string;
    tvdbId?: string;
    hasFile: boolean;
}

const Card = (props: ICardProps) => {
    const isMovie = props.itemType == "movie";

    const movieAvailablilityBadge = isMovie && props.hasFile ?
        <Badge color="success" style={{ float: "right"}}>
            <CheckboxIcon color="success" />
        </Badge> : <></>
    // <Badge color="success" style={{ float: "right" }}>
    //     <FontAwesomeIcon icon={faCheck} />
    // </Badge> : <></>;

    const seriesAvailabilityBadge = !isMovie && props.statistics.percentOfEpisodes == 100 ?
        <Badge color="success" style={{ float: "right"}}>
            <CheckboxIcon color="success" />
        </Badge> : <></>

    const seriesInProgressBadge = !isMovie && props.statistics.percentOfEpisodes < 100 ?
        <Badge color="success" style={{ float: "right"}} >
            <DownloadingIcon color="primary" />
        </Badge> : <></>
    // <Badge color="info" style={{ float: "right" }}>
    //     <FontAwesomeIcon icon={faBarsProgress} />
    // </Badge> : <></>;

    return (<MUICard variant="outlined" sx={{ maxWidth: 345 }}>
        <CardActionArea>
        <CardMedia
          component="img"
          height="225"
          image={props.imageUrl}
          alt={props.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{textDecoration: "none"}}>
            {props.title}
          </Typography>
        </CardContent>
        </CardActionArea>
      </MUICard>)
};

export default Card;