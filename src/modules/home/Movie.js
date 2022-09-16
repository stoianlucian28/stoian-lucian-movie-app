import { Icon } from "@iconify/react";
import moment from "moment";
import MovieCardGrid from "../../components/movie-cards/MovieCardGrid";


const Movie = ({selectedMovie, movies, onSaveFavoriteMovieFromModal, onSelectMovie}) => {

    console.log("ayaya", movies);

    return(

        <div className="selected-movie-wrapper">

            <div className="movie-title-wrapper">

                <p className="text movie-title">{selectedMovie.movieData?.title}</p>
                
                <Icon 
                    className = "favorite-movie-icon"
                    icon = {selectedMovie.movieData?.isFavorite === true ? "carbon:favorite-filled" : "carbon:favorite"}
                    onClick = {onSaveFavoriteMovieFromModal}
                />

            </div>

            <iframe
                className="movie-video"
                src={`https://www.youtube.com/embed/${selectedMovie.videos?.results[0]?.key}`}
            >
            </iframe>

            {/* {
                selectedMovie.movieData?.genres.map( (genre, index) => {

                    return
                })
            } */}

            <div className="movie-info-wrapper">

                <div className="general-info">

                <div className="header">
                        <p className="text general-info-tx">{moment(selectedMovie.movieData?.release_date).format("YYYY")}</p>
                        <p className="text general-info-tx">{selectedMovie.movieData?.runtime} minutes</p>
                        <p className="text general-info-tx">Rating: {parseFloat(selectedMovie.movieData?.vote_average).toFixed(2)} </p>
                </div>

                <div className="overview">

                    <p className="text tagline">{selectedMovie.movieData?.tagline}</p>

                    <p className="text overview-tx">{selectedMovie.movieData?.overview}</p>

                </div>
                
                </div>

                <div className="additional-info">

                    <div className="cast">

                        <p className="text label">Cast: &nbsp;</p>
                        {
                            selectedMovie.credits?.cast.map( (actor, index) => {

                                return(

                                    <p  
                                        key = {`actor-${index}`}
                                        className="text"
                                    >
                                        {actor.name} {selectedMovie.credits?.cast.length - 1 > index ? ', ' : ''} 
                                    </p>
                                );
                            })
                        }

                    </div>

                    <div className="genres">

                        <p className="text label">Genres: &nbsp;</p>
                        {
                            selectedMovie.movieData?.genres.map( (actor, index) => {

                                return(

                                    <p  
                                        key = {`actor-${index}`}
                                        className="text"
                                    >
                                        {actor.name} {selectedMovie.movieData?.genres.length - 1 > index ? ', ' : ''} 
                                    </p>
                                );
                            })
                        }

                    </div>

                </div>

            </div>

            <div className="similar-movies-wrapper">

                <p className="text title">Similar movies</p>

                <div className="movie-grid-view-wrapper">
                {
                    movies.similar?.results.slice(0, 20).map( (movie, index) => {

                        return(
                        
                            <MovieCardGrid 
                                key = {`similar-movie-${movie.title}-${index}`}
                                onSetFavoriteMovie = {onSaveFavoriteMovieFromModal}
                                movie = {movie}
                                categoryType = {"similar-movies"}
                                onSelectMovie = {onSelectMovie}
                                viewType = {0}
                            />
                        );
                    }) 
                }
                    
                </div>
                
            </div>

        </div>
    )
}

export default Movie;