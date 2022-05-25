import { faBarsProgress, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Badge, Card as BootstrapCard, CardImg, CardImgOverlay, Progress } from "reactstrap";
import { IStatistics } from "../models/media";

export interface ICardProps {
    imageUrl?: string;
    title: string;
    itemType?: string;
    isAvailable: boolean;
    statistics: IStatistics
    showProgress?: boolean;
    tmdbId?: string;
    tvdbId?: string;
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

    const linkHref = isMovie ? `/movies/${props.tmdbId ?? ""}` : `/tv/${props.title}`;

    return (
        <BootstrapCard color="light" outline className="col bg-light col-6">
            {
                props.imageUrl ?
                    <CardImg alt={props.title} src={props.imageUrl} top width="100%" /> :
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
                {props.showProgress && movieAvailablilityBadge}
                {props.showProgress && seriesAvailabilityBadge}
                {props.showProgress && seriesInProgressBadge}
                {
                    props.showProgress && !isMovie &&
                    props.statistics.percentOfEpisodes < 100 &&
                    <Progress className="col-md-9 bg-dark" style={{ bottom: 10, position: "absolute" }} value={props.statistics.percentOfEpisodes} />
                }
                <Link href={linkHref}>
                    View
                </Link>
            </CardImgOverlay>
        </BootstrapCard>);
};

export default Card;