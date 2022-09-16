import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import MovieCardGrid from "../movie-cards/MovieCardGrid";
import Spinner from "../loader/Spinner";


const MoreMovies = ({movies, title, viewType, categoryType, onLoadMoreMovies, onSaveFavoriteMovie, onSelectMovie}) => {

    const [showAll, setShowAll] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    /* 
        Based on our showAll state, we show the entire list
        or show only a few elements. 
    */
    const onRenderChildrenList = () => {

        if(movies && movies !== null){

            if(movies.length > 0){

                if(showAll){

                    return movies;
                }
                else{
                    
                    let movieList = [...movies];
    
                    return movieList.slice(0, 6);
                }
            }
        }
        else{

            return [];
        }
    }

    /* 
        Fetching new movies if the user presses on load more button
    */
    const onLoadMoreMoviesOnClick = () => {

        onLoadMoreMovies(categoryType);
    }

    return(

        <div className="more-movies-wrapper">

            <div className="more-movies-title-wrapper">

                <p className="more-movies-title text">{title || ""}</p>

                <p 
                    className="more-movies-action text"
                    onClick = {() => {

                        setShowAll( (prevShow) => !prevShow)
                    }}
                >
                    {showAll ? 'Hide list' : 'Show list'}
                </p>
            
            </div>

            <div className={viewType === 0 ? "movie-grid-view-wrapper" : "movie-list-view-wrapper"}>
            {
                onRenderChildrenList().map( (movie, index) => {

                    return(

                        <MovieCardGrid 
                            key = {`movie-no-${movie.title}-${index}`}
                            className = {categoryType}
                            onSetFavoriteMovie = {onSaveFavoriteMovie}
                            movie = {movie}
                            categoryType = {categoryType}
                            onSelectMovie = {onSelectMovie}
                            viewType = {viewType}
                        />
                    );
                })
            }
            </div>

            {
                showAll ? (

                    <div className="load-more-btn-wrapper">

                        <Icon 
                            className = "load-more-btn"
                            icon = {"ep:arrow-down-bold"}
                            onClick = {onLoadMoreMoviesOnClick}
                        />

                    </div>
                ) : null
            }


        </div>
    );
}

export default MoreMovies;