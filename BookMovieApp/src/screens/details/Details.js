import { Typography, ImageList, ImageListItem, ImageListItemBar} from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Rating from "@material-ui/lab/Rating";
import React from 'react';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import Header from '../../common/header/Header';
import './Details.css';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",

    "& > * + *": {
      marginTop: theme.spacing(1)
    }
  },
  emptyStar: {
    color: "black"
  },
  iconHover:{
      color: "red"
  }
}));

export default function Details(props) {
    
    useEffect(() =>{
        fetch(`${props.baseUrl}/movies/${props.match.params.id}`)
        .then(response => response.json())
        .then(data => setMovieDetail(data));
    },[]);
    const classes = useStyles();
    const [movieDetail, setMovieDetail] = useState({
        "id": "",
        "title": "",
        "storyline": "",
        "genres": [
        ],
        "duration": 0,
        "poster_url": "",
        "trailer_url": "",
        "wiki_url": "",
        "release_date": "",
        "censor_board_rating": "",
        "rating": 0,
        "status": "",
        "artists": [
        ]
      });

      
    
    return (
        <div>
            <Header baseUrl={props.baseUrl} />
            <div className="back"> <Link to="/"><Typography >{"<"} Back to Home </Typography></Link></div>
            <div id="details">
                <div className="left"><img alt={movieDetail.title} src={movieDetail.poster_url}/></div>
                <div className="middle">
                    <Typography variant="h2" >{movieDetail.title}</Typography>
                    
                    <Typography><strong>Genre :</strong>&nbsp; {movieDetail.genres.join(", ")}</Typography> 
                    <Typography><strong>Duration :</strong>&nbsp; {movieDetail.duration}</Typography> 
                    <Typography><strong>Release Date :</strong>&nbsp; {new Date(movieDetail.release_date).toDateString()}</Typography> 
                    <Typography><strong>Rating :</strong>&nbsp; {movieDetail.rating}</Typography> 
                    <Typography className="mtop16"><strong>Plot :</strong>&nbsp; (<a href={movieDetail.wiki_url} target="_blank" >Wiki Link</a>) {movieDetail.storyline}</Typography>
                    <Typography className="mtop16"><strong>Trailer :</strong></Typography><br/>
                    <YouTube videoId={movieDetail.trailer_url.split('v=')[1]} opts={{width:"100%"}}></YouTube>
                    
                </div>
                <div className="right">
                    <Typography variant="h6">Rate this movie:</Typography>
                    <br />
                    <Rating
                        name="half-rating-read"
                        defaultValue={0}
                        precision={1}
                        
                        emptyIcon={
                        <StarBorderIcon fontSize="inherit" className={classes.emptyStar}  />
                        }
                        
                       
                    />
                    
                    
                    <div className="mtopbot16">
                        <Typography variant="h6" >Artists:</Typography>
                    </div>
                    <ImageList  cols={2}  >
                        {movieDetail.artists.map(artist => (

                            <ImageListItem key={artist.first_name +" "+artist.last_name}>

                                <img alt={artist.first_name +" "+artist.last_name} src={artist.profile_url} />

                                <ImageListItemBar
                                    title={artist.first_name +" "+artist.last_name}
                                />

                            </ImageListItem>

                        ))}
                    </ImageList>
                </div>
            </div>
        </div>
    )
}