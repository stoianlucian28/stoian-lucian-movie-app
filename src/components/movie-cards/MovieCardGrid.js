import { Icon } from "@iconify/react";
import moment from "moment/moment";


const MovieCardGrid = ({movie, className, categoryType, onSetFavoriteMovie, onSelectMovie, viewType}) => {
    

    /*
        Communicating to the parent which state should update.
    */
    const onSetMovieCategoryStateKey = () => {

        let stateKey = '';
        switch(categoryType){

            case "popular-movies":
                stateKey = 'popular';
                break;

            case "top-rated-movies":
                stateKey = 'topRated';
                break;

            case "upcoming-movies":
                stateKey = 'upcoming';
                break;

            case "searched-movies":
                stateKey = 'searched';
                break;

            case "favorite-movies":
                stateKey = 'favorite';
                break;

            case "similar-movies":
                stateKey = 'similar';
                break;
        }

        return stateKey;
    }


    //Conditional Rendering of Our View Component
    if(viewType === 0){

        return(

            <div 
                className={`movie-grid-card-wrapper ${className || ''}`}
                style={{
                    background: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path || ''}) 50% / cover no-repeat`
                }}
                onClick = {() => {onSelectMovie(movie, onSetMovieCategoryStateKey())}}
            >
    
                <div className="movie-grid-card-content">
    
                    <p className="text title">{movie.title || ''}</p>
    
                    <p className="text release-text">Release date:</p>
    
                    <p className="text release-date">({moment(movie.releaseDate).format("DD MMM YYYY") || 'n/a'})</p>
    
                    <Icon 
                        className = "favorite-movie-icon"
                        icon = {movie.isFavorite === true ? "carbon:favorite-filled" : "carbon:favorite"}
                        onClick = {() => {onSetFavoriteMovie(movie, onSetMovieCategoryStateKey())}}
                    />
                </div>
                
            </div>   
    
        );
    }
    else{

        return(

            <div 
                className={`movie-list-card-wrapper ${className || ''}`}
                onClick = {() => {onSelectMovie(movie, onSetMovieCategoryStateKey())}}
            >
                <div 
                    className="image"
                    style={{
                        background: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path || ''}) 50% / cover no-repeat`
                    }}>

                </div>

                <div className="info">

                    <p className="text title">{movie.title || ''}</p>
    
                    <p className="text release-text">Release date:</p>

                    <p className="text release-date">({moment(movie.releaseDate).format("DD MMM YYYY") || 'n/a'})</p>
                    
                </div>

                <Icon 
                    className = "favorite-movie-icon"
                    icon = {movie.isFavorite === true ? "carbon:favorite-filled" : "carbon:favorite"}
                    onClick = {() => {onSetFavoriteMovie(movie, onSetMovieCategoryStateKey())}}
                />

            </div>
        )
    }
}

export default MovieCardGrid;