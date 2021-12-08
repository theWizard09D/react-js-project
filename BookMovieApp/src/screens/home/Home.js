import { Link } from "react-router-dom";
import { Button, CardHeader, Card, CardContent, FormControl, TextField, MenuItem, Checkbox, ImageList, ImageListItem, ImageListItemBar, InputLabel, Input, Select, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import Header from "../../common/header/Header";
import './Home.css';



const useStyles = makeStyles((theme) => ({
    root:{
        paddingBottom:0
    },
    title: {
        fontSize: 14,
        color: theme.palette.primary.light,
    }
}));

export default function Home({ baseUrl }) {

    useEffect(() => {

        fetch(`${baseUrl}movies?page=1&limit=100&status=PUBLISHED`)
            .then(response => response.json())
            .then(data => setUpcomingMovies(data.movies));

        fetch(`${baseUrl}movies?page=1&limit=100&status=RELEASED`)
            .then(response => response.json())
            .then(data => {
                setReleasedMovies(data.movies);
                setOrgReleasedMovies(data.movies);
                const uniqueGeners = setGenersFromMovies(data);
                setGenres(uniqueGeners);
                const uniqueArtists = setArtistsFromMovies(data);
                setArtists(uniqueArtists);

            }
            );

    }, []);

    const classes = useStyles();
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [releasedMovies, setReleasedMovies] = useState([]);
    const [orgReleasedMovies, setOrgReleasedMovies] = useState([]);
    const [genres, setGenres] = useState([{ value: "", label: "" }]);
    const [selGenres, setSelGenres] = useState([]);
    const [selArtists, setSelArtists] = useState([]);
    const [artists, setArtists] = useState([{ value: "", label: "" }]);
    const [movieName, setMovieName] = useState("");
    const [releaseStartDate, setReleaseStartDate] = useState("");
    const [releaseEndDate, setReleaseEndDate] = useState("");

    /*
    * setGenersFromMovies takes input from the fetch method from /v1/movies
    * iterates through movies and collect all the generes and will return genres array
    */
    const setGenersFromMovies = (data) => {
        const genres = [];
        const uniqueGeners = [];
        data.movies.forEach(movie => {
            movie.genres.forEach(genere => {
                if (!genres.includes(genere)) {
                    genres.push(genere);
                    const gener = { value: genere, label: genere };
                    uniqueGeners.push(gener);
                }
            });
        });
        return uniqueGeners;
    }

    /*
    * setArtistsFromMovies takes input from the fetch method from /v1/movies
    * iterates through movies and collect all the artits and will return artits array
    */
    const setArtistsFromMovies = (data) => {
        const artists = [];
        const uniqueArtists = [];
        data.movies.forEach(movie => {
            movie.artists.forEach(artist => {
                if (!artists.includes(artist.id)) {
                    artists.push(artist.id);
                    const artst = { value: artist.id, label: `${artist.first_name} ${artist.last_name}` };
                    uniqueArtists.push(artst);
                }
            });
        });
        return uniqueArtists;
    }

    /*
    * applyFilterButtonHandler is used to filter movies based on the user selection
    */
    const applyFilterButtonHandler = () => {

        const filteredMovies = orgReleasedMovies.reduce(function (filtered, movie) {
            const movies = [];
            if (movie.title === movieName) {
                movies.push(movie.id);
                filtered.push(movie);
            }
            movie.genres.forEach(genre => {
                if (!movies.includes(movie.id) && selGenres.includes(genre)) {
                    movies.push(movie.id);
                    filtered.push(movie);
                }
            })
            movie.artists.forEach(artist => {
                if (!movies.includes(movie.id) && selArtists.includes(artist.first_name + " " + artist.last_name)) {
                    movies.push(movie.id);
                    filtered.push(movie);
                }
            })

            if (!movies.includes(movie.id)
                && Date.parse(movie.release_date) >= Date.parse(releaseStartDate)
                && Date.parse(movie.release_date) <= Date.parse(releaseEndDate ? releaseEndDate : new Date())
            ) {
                movies.push(movie.id);
                filtered.push(movie);
            }

            return filtered;
        }, []);
        setReleasedMovies([...filteredMovies]);
    }

    /*
    * handleGenresOnChange is used to set the state of the genres on change
    */
    const handleGenresOnChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelGenres(
            typeof value === 'string' ? value.split(',') : value
        );

    };

    /*
    * handleArtistsChange is used to set the state of the artists on change
    */
    const handleArtistsChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelArtists(
            typeof value === 'string' ? value.split(',') : value
        );
    }

    return (
        <div>
            <Header baseUrl={baseUrl} />
            <div id="upcomingMovies">Upcoming Movies</div>

            <div className="upcomingMovies" >
                <ImageList rowHeight={250} cols={6} >
                    {upcomingMovies.map(upcomingMovie => (
                        <ImageListItem key={upcomingMovie.id}>
                            <img alt="" src={upcomingMovie.poster_url} height='250' />
                            <ImageListItemBar
                                title={upcomingMovie.title} height='250'
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <div id="releasedMovies">
                <div className="releasedMovies">
                    <ImageList rowHeight={350} cols={4} gap={16} >
                        {releasedMovies.map(releasedMovie => (

                            <ImageListItem key={releasedMovie.id}>

                                <Link to={`/movie/${releasedMovie.id}`}><img alt="" src={releasedMovie.poster_url} /></Link>

                                <ImageListItemBar
                                    title={releasedMovie.title}
                                />

                            </ImageListItem>

                        ))}
                    </ImageList>
                </div>
                <div className="releasedMoviesSearch">
                    <Card >
                        <CardHeader title="FIND MOVIES BY:" classes={{
                            title: classes.title,
                            root: classes.root 
                        }} />
                        
                        <CardContent >

                            <FormControl className="formControl">
                                <InputLabel htmlFor="movieName">
                                    Movie Name
                                </InputLabel>
                                <Input
                                    id="movieName"
                                    value={movieName}
                                    onChange={(e) => setMovieName(e.target.value)}
                                />
                            </FormControl>

                            <FormControl className="formControl mtop10">
                                <InputLabel htmlFor="genres">
                                    Genres
                                </InputLabel>
                                <Select
                                    variant="standard"
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selGenres}
                                    onChange={handleGenresOnChange}
                                    renderValue={(selected) => selected.join(', ')}

                                >
                                    {genres.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            <Checkbox checked={selGenres.indexOf(option.value) > -1} />
                                            <ListItemText primary={option.value} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className="formControl mtop10">
                                <InputLabel htmlFor="artists">
                                    Artists
                                </InputLabel>
                                <Select
                                    variant="standard"

                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selArtists}
                                    onChange={handleArtistsChange}
                                    renderValue={(selected) => selected.join(', ')}

                                >
                                    {artists.map((option) => (
                                        <MenuItem key={option.label} value={option.label}>
                                            <Checkbox checked={selArtists.indexOf(option.label) > -1} />
                                            <ListItemText primary={option.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl className="formControl mtop10">
                                <TextField
                                    variant="standard"
                                    label="Release Date Start"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={releaseStartDate}
                                    onInput={(e) => setReleaseStartDate(e.target.value)}
                                />
                            </FormControl>
                            <FormControl className="formControl mtop10">
                                <TextField
                                    variant="standard"
                                    label="Release Date End"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={releaseEndDate}
                                    onInput={(e) => setReleaseEndDate(e.target.value)}
                                />
                            </FormControl>
                            <div className="alignCenter mtop10">
                                <Button type="submit" variant="contained" color="primary" fullWidth onClick={applyFilterButtonHandler}>APPLY</Button>
                            </div>
                        </CardContent>

                    </Card>
                </div>
            </div>
        </div>
    )
}