import { NextPage } from "next/types";
import React from "react";
import { IMedia } from "../models/media";
import Card from "./card";

export interface ICarouselProps {
    items: IMedia[];
    imageBaseUrl: string;
    baseUrl: string;
    apiKey: string;
}

export interface ICarouselState {
    currentPage: number;
}

const LazyCarousel: NextPage<ICarouselProps> = (props) => {

    const [state, setState] = React.useState<ICarouselState>({ currentPage: 0 });

    const itemsPerPage = 6;
    const maxPage = props.items.length / itemsPerPage;

    const currentItems = props.items.filter((item, index) => {
        if (index < state.currentPage * itemsPerPage || index > (state.currentPage * itemsPerPage) + itemsPerPage - 1)
            return null;
        else
            return item;
    })

    const handleNext = () => {
        const nextPage = state.currentPage + 1;

        if (nextPage > maxPage)
            setState({ currentPage: 0 });
        else
            setState({ currentPage: state.currentPage + 1 });
    }

    const handlePrev = () => {
        const nextPage = state.currentPage + 1;

        if (nextPage > maxPage)
            setState({ currentPage: 0 });
        else
            setState({ currentPage: state.currentPage + 1 });
    }

    const cards = currentItems.map((x, index) => {
        const imageUrl = x.images.find(image => image.coverType == "poster");
        const url = props.imageBaseUrl + imageUrl?.url?.replace(props.baseUrl, "") + `&apikey=${props.apiKey}`;
        const itemType = url.includes("radarr") ? "movie" : "series";

        return (<Card key={index} {...x} imageUrl={url} itemType={itemType} />);
    });

    return (<div id="carouselExampleControls" className="carousel slide carousel-dark">
        <div className="carousel-inner">
            <div className="carousel-item active" style={{ display: "flex" }}>
                {cards}
            </div>
        </div>

        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" onClick={handleNext} style={{
            left: 'unset',
            right: 100,
            top: -50,
            bottom: 'unset',
            width: 50
        }}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleControls" role="button" onClick={handlePrev} style={{
            left: 'unset',
            right: 50,
            top: -50,
            bottom: 'unset',
            width: 50
        }}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
        </a>
    </div>);
}

export default LazyCarousel;