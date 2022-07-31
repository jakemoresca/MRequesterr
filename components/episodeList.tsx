import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import { Card, CardContent, Chip, Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { SonarrEpisode } from "../models/media";
import { ISettings } from "../models/settings";
import { useSeriesEpisodes } from "../services/series";

export interface IEpisodeListProps {
    settings: ISettings;
    seriesId: string;
    seasonMap: number[];
}

function EpisodeList(props: IEpisodeListProps) {
    const { seriesEpisodes, isSeriesEpisodesLoading } = useSeriesEpisodes(props.seriesId, props.settings);

    if (isSeriesEpisodesLoading)
        return (<></>);

    return (<Card variant="outlined">
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                Series Episodes Information
            </Typography>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader">
                {
                    seriesEpisodes && props.seasonMap.map(x => {
                        return (<SeasonEpisodes key={`SeasonList_${x}`} seriesEpisodes={seriesEpisodes} seasonNumber={x}></SeasonEpisodes>)
                    })
                }
            </List>
        </CardContent>
    </Card>)
}

export interface ISeasonEpisodesProps {
    seriesEpisodes: SonarrEpisode[];
    seasonNumber: number;
}

function SeasonEpisodes(props: ISeasonEpisodesProps) {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const seasonEpisodeMap = props.seriesEpisodes.filter(episode => episode.seasonNumber == props.seasonNumber);
    const downloaded = seasonEpisodeMap.filter(x => x.hasFile);

    return (
        <React.Fragment>
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={props.seasonNumber == 0 ? 'Special' : `Season ${props.seasonNumber}`} />{open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        seasonEpisodeMap.map(x => {
                            return (<ListItemButton key={`ListItem_${x.seasonNumber}_${x.episodeNumber}`} sx={{ pl: 4 }}>
                                <ListItemText primary={`${x.episodeNumber} - ${x.title}`} />
                                { x.hasFile && <Chip label="Downloaded" color="success" /> }
                            </ListItemButton>);
                        })
                    }
                </List>
            </Collapse>
        </React.Fragment>
    )
}

export default EpisodeList;