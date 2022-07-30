import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, ButtonGroup, Grid, Typography, Link as MUILink } from "@mui/material";
import Link from "next/link";
import { NextPage } from "next/types";
import React from "react";
import { IMedia } from "../models/media";
import Card from "./card";

export interface ICarouselProps {
    items: IMedia[];
    getItemTypeAndUrl: (media: IMedia) => { itemType: string, url: string };
    handleNext?: (page: number) => void;
    handlePrev?: (page: number) => void;
    showProgress?: boolean;
    title?: string;
    maxPage?: number;
    currentPage?: number;
    serverSide?: boolean;
    isLoading?: boolean;
}

export interface ICarouselState {
    currentPage: number;
}

const LazyCarousel: NextPage<ICarouselProps> = (props) => {

    const [state, setState] = React.useState<ICarouselState>({ currentPage: props.currentPage ?? 0 });

    const itemsPerPage = 24;
    const maxPage = props.maxPage ?? Math.ceil(props.items.length > 0 ? props.items.length / itemsPerPage : 0);

    const currentItems = props.serverSide ? props.items : props.items.filter((item, index) => {
        if (index >= state.currentPage * itemsPerPage && index < (state.currentPage + 1) * itemsPerPage)
            return item;
        else
            return null;
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
        const nextPage = state.currentPage - 1;

        if (nextPage < 0)
            setState({ currentPage: 0 });
        else
            setState({ currentPage: nextPage });

        props.handlePrev && props.handlePrev(nextPage);
    }

    const cards = currentItems.map((x, index) => {
        const { url, itemType } = props.getItemTypeAndUrl(x);
        const isMovie = itemType == "movie";
        const linkHref = isMovie ? `/movies/${x.tmdbId ?? ""}` : `/tv/${x.title}`;

        return (<Grid item xs={6} md={2} key={`card_${index}`}>
            <Link href={linkHref} passHref>
                <MUILink sx={{textDecoration: "none"}}>
                    <Card key={index} {...x} imageUrl={url} itemType={itemType} showProgress={props.showProgress} />
                </MUILink></Link></Grid>
        );
    });

    if (cards.length == 0)
        return (<></>)

    return (<Box>
        <Grid container spacing={2}>
            <Grid item xs={6} lg={10}>
                <Typography gutterBottom variant="h3" component="div">
                    {props.title}
                </Typography>
            </Grid>
            <Grid item xs={6} lg={2}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ alignItems: 'flex-end' }}>
                    <Button onClick={handlePrev} disabled={state.currentPage == 0}>
                        <FontAwesomeIcon icon={faAngleLeft} /> Prev
                    </Button>
                    <Button onClick={handleNext} disabled={state.currentPage == maxPage - 1}>
                        Next <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>

        <Grid container spacing={1}>
            {cards}
        </Grid>
    </Box>);
}

export default LazyCarousel;