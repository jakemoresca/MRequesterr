import { faBarsProgress, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Card as BootstrapCard, CardImg, CardImgOverlay } from "reactstrap";
import { IStatistics } from "../models/media";

export interface ICardProps {
    imageUrl?: string;
    title: string;
    itemType?: string;
    isAvailable: boolean;
    statistics: IStatistics
}

const Card = (props: ICardProps) => {
    const isMovie = props.itemType == "movie";

    const movieAvailablilityBadge = isMovie && props.isAvailable ?
        <Badge color="success" style={{ float: "right" }}>
            <FontAwesomeIcon icon={faCheck} />
        </Badge> : <></>;

    const seriesAvailabilityBadge = !isMovie && props.statistics.percentOfEpisodes == 100 ?
        <Badge color="success" style={{ float: "right" }}>
            <FontAwesomeIcon icon={faCheck} />
        </Badge> : <></>;

    const seriesInProgressBadge = !isMovie && props.statistics.percentOfEpisodes < 100 ?
        <Badge color="info" style={{ float: "right" }}>
            <FontAwesomeIcon icon={faBarsProgress} />
        </Badge> : <></>;

    return (<BootstrapCard color="light" outline className="col-md-2 shadow-sm" style={{ height: 231, width: 157 }}>
        {
            props.imageUrl ?
                <CardImg alt={props.title} src={props.imageUrl} top width="100%" /> :
                //<Image src={props.imageUrl} className="card-img-top align-self-center" alt={props.title} height={231} width={157}></Image> :
                (<svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg"
                    role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                    <title>{props.title}</title>
                    <rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">{props.title}</text>
                </svg>)
        }
        <CardImgOverlay>
            <Badge color="primary">
                {props.itemType?.toUpperCase()}
            </Badge>
            {movieAvailablilityBadge}
            {seriesAvailabilityBadge}
            {seriesInProgressBadge}
        </CardImgOverlay>
    </BootstrapCard>);
};

export default Card;