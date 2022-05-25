import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next/types";
import React from "react";
import { Button, Container } from "reactstrap";
import { IMedia } from "../models/media";
import Card from "./card";

export interface ICarouselProps {
    items: IMedia[];
    getItemTypeAndUrl: (media: IMedia) => { itemType: string, url: string };
    handleNext?: (page: number) => void;
    handlePrev?: (page: number) => void;
    showProgress?: boolean;
    title?: string;
}

export interface ICarouselState {
    currentPage: number;
}

const LazyCarousel: NextPage<ICarouselProps> = (props) => {

    const [state, setState] = React.useState<ICarouselState>({ currentPage: 0 });

    const itemsPerPage = 6;
    const maxPage = props.items.length > 0 ? props.items.length / itemsPerPage : 0;

    const currentItems = props.items.filter((item, index) => {
        if (index < state.currentPage * itemsPerPage || index > (state.currentPage * itemsPerPage) + itemsPerPage - 1)
            return null;
        else
            return item;
    });

    const handleNext = () => {
        const nextPage = state.currentPage + 1;

        if (nextPage > maxPage)
            setState({ currentPage: 0 });
        else
            setState({ currentPage: nextPage });

        props.handleNext && props.handleNext(nextPage);
    }

    const handlePrev = () => {
        const nextPage = state.currentPage + 1;

        if (nextPage > maxPage)
            setState({ currentPage: 0 });
        else
            setState({ currentPage: state.currentPage + 1 });
    }

    const cards = currentItems.map((x, index) => {
        const { url, itemType } = props.getItemTypeAndUrl(x);
        return (<Card key={index} {...x} imageUrl={url} itemType={itemType} showProgress={props.showProgress} />);
    });

    if (cards.length == 0)
        return (<></>)

    return (<div className="carousel slide d-flex flex-column">
        <Container className="py-3" fluid>
            <h3 className="float-start">{props.title}</h3>
            <Button onClick={handlePrev} className="float-end">
                Next <FontAwesomeIcon icon={faAngleRight} />
            </Button>
            <Button onClick={handleNext} className="float-end">
                <FontAwesomeIcon icon={faAngleLeft} /> Prev
            </Button>
        </Container>
        <div className="carousel-inner">
            <div className="carousel-item active d-flex row row-cols-sm-2 row-cols-md-6">
                {cards}
            </div>
        </div>
    </div>);
}

export default LazyCarousel;