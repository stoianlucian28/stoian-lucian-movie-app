import { Icon } from "@iconify/react";
import moment from "moment";
import React from "react";
import CategoryButtons from "../../components/buttons/CategoryButtons";
import ViewButtons from "../../components/buttons/ViewButtons";
import Modal from "../../components/modal/Modal";
import MoreMovies from "../../components/more-movies/MoreMovies";
import MovieCardGrid from "../../components/movie-cards/MovieCardGrid";
import Spinner from "../../components/loader/Spinner";
import Controller from "../../providers/Controller";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import Movie from "./Movie";

export default class HomePage extends React.Component{

    constructor(props){

        super(props);
        this.state = {

            movies: {

                popular: {},
                topRated: {},
                upcoming: {},
                searched: {},
                similar: {},
                favorite: {
                    results: []
                }
            },
            selectedMovie: {},
            page: 2,
            isLoading: true,
            error:{

                isError: false,
                message: ''
            },
            showSearchedList: false,
            viewType: 0, // 0 - grid view, 1 - list view
            categoryType: 0, // 0 - all categories, 1 - favorites
            showMovieModal: false, 
        }
    }

    Controller = new Controller();

    componentDidMount(){

        setTimeout( () => {

            this.onSetMovies();
        }, 1000)
    }

    /*
        Calling the Search API + debouncing the function so it
        gets called only when the user finishes typing
    */
    componentDidUpdate(prevProps, _){

        if(prevProps.searchText !== this.props.searchText){

            if(this.props.searchText.length > 0){

                let duration = 500;
                clearTimeout(this.debouncerTimer);
                
                    this.debouncerTimer = setTimeout( () =>{
                        
                        this.setState({

                            isLoading: true
                        },
                            () => {

                                setTimeout( async () => {

                                    await this.onSetSearchedMovies()
                                }, 1000)
                            }
                        );

                }, duration);
            }
            else{

                this.setState({

                    isLoading: true,
                    showSearchedList: false
                }, 
                    () => {

                        setTimeout( async () => {

                            await this.onSetSearchedMovies()
                        }, 1000)
                    }
                );
            }
        }
    }

    /*
        Setting movies list into state
    */
    onSetMovies = async () => {

        const _popularMoviesListRes = this.Controller.onGetPopularMoviesList(1); /* Gets as parameter the page number, if the parameter is not passed, it will display page 1 by default */
        const _topRatedMoviesRes = this.Controller.onGetTopRatedMoviesList(1);
        const _upcomingMoviesRes = this.Controller.onGetUpcomingMoviesList(1);

        const [ popularMoviesRes, topRatedMoviesRes, upComingMoviesRes ] = 
                                        await Promise.all( [_popularMoviesListRes, _topRatedMoviesRes, _upcomingMoviesRes] );

                                        console.log("popula moviers => ", popularMoviesRes.data);
        
        const moviesResObject = {

            popular: popularMoviesRes.success,
            topRated: topRatedMoviesRes.success,
            upcoming: upComingMoviesRes.success
        } 

        const moviesRes = {

            success: Object.values(moviesResObject).every( res => res === true)
        };

        const stateObject = {

            movies: {

                popular: popularMoviesRes.data,
                topRated: topRatedMoviesRes.data,
                upcoming: upComingMoviesRes.data,
                favorite: {

                    ...this.onGetFavoriteMovies()
                }
            }
        };
        
        this.onSetMovieState(stateObject, moviesRes, 'There was an error getting the movies list.');
    }

    onGetFavoriteMovies = () => {

        const favMoviesFromLsJson = JSON.parse(localStorage.getItem("favoriteMovies"));
        let favoriteMovies = {

            results: []
        };

        if(favMoviesFromLsJson && favMoviesFromLsJson !== null){

            favoriteMovies = favMoviesFromLsJson;
        }

        return favoriteMovies;
    }

    /*
        When the user searches for a movie we fetch the searched mvoies and 
        display them using this function
    */

    onSetSearchedMovies = async () => {
        
        const searchedMoviesRes = await this.Controller.onGetSearchedMovies(1, this.props.searchText);

        const stateObject = {

            movies: {
                ...this.state.movies,
                searched: searchedMoviesRes.data
            },
            showSearchedList: true

        };
        
        this.onSetMovieState(stateObject, searchedMoviesRes, 'There was an error getting the movies you searched.');
        
    }

    /*
        To avoid code repetition, I created a set movie state.
    */

    onSetMovieState = (stateObject, result, errorMsg) => {

        if(result.success){

            this.setState({

                ...stateObject

            }, () => {
    
                this.onSetLoadingState(false);
            });
        }
        else{

            this.setState({

                error: {
                    isError: true,
                    message: errorMsg
                }

            }, () => {
    
                // this.onSetLoadingState(false);
            });
            
        }
    }

    /*
        Setting if we show the loading animation or not (true or false),
        if the parameter is omitted it will be false by default
    */
   onSetLoadingState = (state) => {
    
        let isLoadingState = state && state !== null ? state : false;

        this.setState({

            isLoading: isLoadingState
        });
   }

   /*
        Set the view type of displayed movies (grid or list).
   */
   onSetView = (viewIdx) => {

        /*
            To prevent a rerender every time the user
            presses on the current type button we check if the pressed
            list type button is different from the current button type
            (if we are in grid view and he presses on the change grid button, 
            then we don't update the state.    
            )
        */
        if(viewIdx !== this.state.viewType){

            this.setState({

                viewType: viewIdx && viewIdx !== null ? viewIdx : 0
            });
        }
   }

   onSetCategory = (categoryIdx) => {

        /*
            To prevent a rerender every time the user
            presses on the current type button we check if the pressed
            list type button is different from the current button type
            (if we are in all movies view and he presses on the call movies button, 
            then we don't update the state.    
            )
        */
        if(categoryIdx !== this.state.categoryType){

            this.setState({

                isLoading: true,
                categoryType: categoryIdx && categoryIdx !== null ? categoryIdx : 0,
                showSearchedList: false
            }, 
                () => {

                    this.setState({

                        isLoading: false,
                    });
                }
            );
        }
    }

    /*
        Load more movies on scroll using this function.
        Note that it has to be passed to the MoreMovies component.
    */
    onLoadMoreMovies = async (categoryType) => {

        let moreMoviesListRes = {};
        let stateKey = '';
        let page = this.state.page + 1;

        switch(categoryType){

            case "popular-movies":
                moreMoviesListRes = await this.Controller.onGetPopularMoviesList(page);
                stateKey = 'popular';
                break;

            case "top-rated-movies":
                moreMoviesListRes = await this.Controller.onGetTopRatedMoviesList(page);
                stateKey = 'topRated';
                break;

            case "upcoming-movies":
                moreMoviesListRes = await this.Controller.onGetUpcomingMoviesList(page);
                stateKey = 'upcoming';
                break;

            case "searched-movies":
                moreMoviesListRes = await this.Controller.onGetSearchedMovies(page, this.props.searchText);
                stateKey = 'searched';
                break;
    
            default:
                moreMoviesListRes = await this.Controller.onGetPopularMoviesList(page);
                stateKey = 'popular';
        }

        if(moreMoviesListRes.success){

            let moreMoviesNew = this.state.movies[stateKey];
            moreMoviesNew.results = [...moreMoviesNew.results, ...moreMoviesListRes.data.results];

            const stateObject = {

                movies: {
                    
                    ...this.state.movies,
                    [stateKey]: moreMoviesNew
                },
                
            };

            this.setState({

                page: page
            }, 
            
                () => {

                    this.onSetMovieState(stateObject, moreMoviesListRes, 'There was an error loading more movies.');
                }
            );
        }
    }

    /*
        Adding or deleting movies from favorite based on their existence in localstorage.
    */
    onSaveMovieToFavoritesList = (movie, category) => {

        /* Getting favorites from LS*/
        const moviesFromLsRaw =  JSON.parse(localStorage.getItem("favoriteMovies"));
        let moviesFromLs = {

            results: []
        };

        let moviesListFromState = this.state.movies[category];
        
        const movieFromStateIdx = moviesListFromState['results'].findIndex( (movieFromState) => movieFromState.id === movie.id);

        if(moviesFromLsRaw && moviesFromLsRaw !== null){

            moviesFromLs.results = moviesFromLsRaw.results;
            const isFavorite = moviesFromLs.results.findIndex( (lsMovie) => lsMovie.id === movie.id) > -1;

            /* if favorites exist then we delete it from local storage and uncheck it from our movie list. */
            if(isFavorite){

                moviesFromLs.results = moviesFromLs.results.filter( (lsMovie) => lsMovie.id !== movie.id);
                moviesListFromState['results'][movieFromStateIdx]['isFavorite'] = false; 
            }
            else{ /* else we add it to localstorage and we "mark" it in our list. */

                moviesFromLs.results.push(movie);
                moviesListFromState['results'][movieFromStateIdx]['isFavorite'] = true; 
            }
            
        }
        else{

            moviesFromLs.results.push(movie);
            moviesListFromState['results'][movieFromStateIdx]['isFavorite'] = true; 
        }

        localStorage.setItem( "favoriteMovies", JSON.stringify(moviesFromLs));

        this.setState({

            isLoading: true,
            movies: {
                ...this.state.movies,
                [category]: moviesListFromState,
                favorite: moviesFromLs
            },

        }, () => {

            this.setState({

                isLoading: false
            });
        });
    }

    onSelectMovie = async (movie, category) => {

        const _movieDetailsRes = this.Controller.onGetMovieDetails(movie.id);
        const _movieVideosRes = this.Controller.onGetMovieVideos(movie.id);
        const _movieCastRes = this.Controller.onGetMovieCast(movie.id);
        const _similarMoviesRes = this.Controller.onGetSimilarMovies(movie.id);

        const [ movieDetailsRes,  movieVideosRes, 
                    movieCastRes, similarMoviesRes ] = await Promise.all( [_movieDetailsRes, _movieVideosRes, _movieCastRes, _similarMoviesRes] );

        if(movieDetailsRes.success && movieVideosRes.success && movieCastRes.success && similarMoviesRes.success){

            this.setState({

                selectedMovie: {

                    movieData: {
                        ...movieDetailsRes.data,
                        isFavorite: movie.isFavorite,
                        category: category,
                    },
                    videos: movieVideosRes.data,
                    credits: movieCastRes.data,
                    
                },

                movies: {

                    ...this.state.movies,
                    similar: similarMoviesRes.data 
                }   
    
            }, () => {
    
                this.setState({
    
                    showMovieModal: true,
                });
            });
        }
        else{

            this.setState({

                error: {
                    isError: true,
                    message: 'An error occured while selecting this movie data.'
                }

            });
        }
    }
    
    /*
        To update the favorite icon in popup,
        we also have to update the selected movie isFavorite flag.
    */
    onSaveFavoriteMovieFromModal = () => {

        let selectedMovieObj = this.state.selectedMovie;
        selectedMovieObj.movieData.isFavorite = !selectedMovieObj.movieData.isFavorite;

        /*
            If the movie is from simialr category then we add it to the similar array.
        */

        let similarMoviesObj = this.state.movies.similar;
        similarMoviesObj['results'].push(this.state.selectedMovie.movieData);
        
        this.setState({

            selectedMovie: selectedMovieObj,
            movies: {

                ...this.state.movies,
                similar: similarMoviesObj
            }

        }, () => {

            this.onSaveMovieToFavoritesList(this.state.selectedMovie.movieData, this.state.selectedMovie.movieData?.category);
        });
    }

    render(){

        if(this.state.isLoading){

            return(
                <>
                    <Modal
                        visible = {this.state.error.isError}
                        setVisibile = {() => {

                            this.setState({
                                error: {

                                    ...this.state.error,
                                    isError: !this.state.error.isError
                                }
                            })
                        }}
                    >
                        <p className="text error-title">
                            Ooooh... an error occured!
                        </p>

                        <p className="text error-tx">
                           {this.state.error.message}
                        </p>

                        <p className="text error-tx">
                            Please try to refresh the page.
                            <br />
                            Note that you might experience connection issues or the Movie API isn't working at the moment.
                            <br />
                            <br />
                            Sorry of any inconvenience and thank you for your understanding!
                        </p>
                    </Modal>

                    <div className="homepage-wrapper">
                        <SkeletonLoader />
                    </div>
                </>
            );
                
                
        }

        // if(this.state.error.isError){

        //     return(

        //         <div></div>
        //     );
        // }

        return(

            <div className="homepage-wrapper">

                <Modal
                    visible = {this.state.showMovieModal}
                    setVisibile = {() => {

                        this.setState({showMovieModal: !this.state.showMovieModal})
                    }}
                >

                   <Movie 
                        selectedMovie = {this.state.selectedMovie}
                        movies = {this.state.movies}
                        onSelectMovie = {this.onSelectMovie}
                        onSaveFavoriteMovieFromModal = {this.onSaveFavoriteMovieFromModal}
                   />

                </Modal>

                <div className="homepage-buttons-wrapper">

                    <CategoryButtons 
                        category = {this.state.categoryType}
                        setCategory={this.onSetCategory}
                    />

                    <ViewButtons 
                        setView = {this.onSetView}
                        view = {this.state.viewType}
                    />

                </div>
                

                {
                    !this.state.showSearchedList ? (

                        this.state.categoryType === 0 ? (

                            <>

                                <MoreMovies
                                    categoryType = {"popular-movies"}
                                    title = {"Popular now"}
                                    viewType = {this.state.viewType}
                                    movies = {this.state.movies.popular.results}
                                    onLoadMoreMovies = {this.onLoadMoreMovies}
                                    onSaveFavoriteMovie = {this.onSaveMovieToFavoritesList}
                                    onSelectMovie = {this.onSelectMovie}
                                />

                                <MoreMovies
                                    categoryType = {"top-rated-movies"}
                                    title = {"Top rated"}
                                    viewType = {this.state.viewType}
                                    movies = {this.state.movies.topRated.results}
                                    onLoadMoreMovies = {this.onLoadMoreMovies}
                                    onSaveFavoriteMovie = {this.onSaveMovieToFavoritesList}
                                    onSelectMovie = {this.onSelectMovie}
                                />

                                <MoreMovies
                                    categoryType = {"upcoming-movies"}
                                    title = {"Upcoming movies"}
                                    viewType = {this.state.viewType}
                                    movies = {this.state.movies.upcoming.results}
                                    onLoadMoreMovies = {this.onLoadMoreMovies}
                                    onSaveFavoriteMovie = {this.onSaveMovieToFavoritesList}
                                    onSelectMovie = {this.onSelectMovie}
                                />

                            </>

                        ) : (
                            this.state.movies.favorite.results.length > 0 ? (

                            <div className={this.state.viewType === 0 ? "movie-grid-view-wrapper" : "movie-list-view-wrapper"}>
                            {
                                this.state.movies.favorite.results.map( (movie, index) => {

                                    return(
                                    
                                        <MovieCardGrid 
                                            key = {`movie-no-${movie.title}-${index}`}
                                            onSetFavoriteMovie = {this.onSaveMovieToFavoritesList}
                                            movie = {movie}
                                            categoryType = {"favorite-movies"}
                                            onSelectMovie = {this.onSelectMovie}
                                            viewType = {this.state.viewType}
                                        />
                                    );
                                }) 
                            }
                                
                            </div>

                            ) : (

                                <p className="text missing-tx">There are no favorite movies added to your list.</p>
                            )
                        )

                    ) : (

                        this.state.movies.searched.results.length > 0 ? (

                            <MoreMovies
                                categoryType = {"searched-movies"}
                                title = {"Searched results"}
                                viewType = {this.state.viewType}
                                movies = {this.state.movies.searched?.results}
                                onLoadMoreMovies = {this.onLoadMoreMovies}
                                onSelectMovie = {this.onSelectMovie}
                                onSaveFavoriteMovie = {this.onSaveMovieToFavoritesList}
                            />
                        ) : (

                            <p className="text missing-tx">There were no movies found.</p>
                        )
                    )
                }

            </div>
        );
    }
}