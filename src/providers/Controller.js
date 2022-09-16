

export default class Controller {

    /*
        Api Credentials
    */

    API_KEY = '98e8d6116b51e2542a468a00fa0d1cf9';
    API_URL_POPULAR = `https://api.themoviedb.org/3/movie/popular?api_key=${this.API_KEY}&language=en-US&page=`;
    API_URL_TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.API_KEY}&language=en-US&page=`;
    API_URL_UPCOMING = `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.API_KEY}&language=en-US&page=`;

     /*
        To avoid boiler plate code, I used a function that fetches the data from API,
        based on the URL parameter.
    */
    onFetchMoviesList = async (fetchUrl, page, type) => {

        const moviesListPage = page && page !== null && !isNaN(page) ? page : 1;

        if(fetchUrl && fetchUrl !== null){

            const fetchUrlString = type === "moviesArr" ? fetchUrl + moviesListPage : fetchUrl;
            let moviesRes = fetch(fetchUrlString) 
            .then( (moviesRes) => moviesRes.json())
            .then( (moviesData) => {

                const moviesFromLs = JSON.parse(localStorage.getItem("favoriteMovies"));
    
                switch(type){

                    case "moviesArr":

                        return {
    
                            success: moviesData?.success === false ? moviesData?.success : true,
                            data: {
        
                                ...moviesData,
                                results: moviesData.results.map( (movie) => {
        
                                    let isFavorite = false;
                                    if(moviesFromLs && moviesFromLs !== null){
        
                                        isFavorite = moviesFromLs.results.findIndex( (lsMovie) => lsMovie.id === movie.id) > -1;
                                    }
        
                                    return {
        
                                        ...movie,
                                        isFavorite: isFavorite
                                    }
                                })
                            }, 
                            message: moviesData?.success === false ? moviesData?.status_message : 'Success!'
                        };
                    
                    case "movieObj":
                        return {
    
                            success: moviesData?.success === false ? moviesData?.success : true,
                            data: moviesData,
                            message: moviesData?.success === false ? moviesData?.status_message : 'Success!'
                        };
                }
            })
            .catch( (error) => {
    
                return {
    
                    success: false,
                    data: null,
                    message: error
                };
            });
    
            return moviesRes;
        }
    }

    /*
        Fetching Popular Movies
    */
    onGetPopularMoviesList = async (page) => {

        let popularMoviesRes = await this.onFetchMoviesList(this.API_URL_POPULAR, page, "moviesArr");

        return popularMoviesRes;
    }

    onGetTopRatedMoviesList = async (page) => {

        let latestMoviesRes = await this.onFetchMoviesList(this.API_URL_TOP_RATED, page, "moviesArr");

        return latestMoviesRes;
    }

    onGetUpcomingMoviesList = async (page) => {

        let upcomingMoviesRes = await this.onFetchMoviesList(this.API_URL_UPCOMING, page, "moviesArr");

        return upcomingMoviesRes;
    }

    onGetSearchedMovies = async (page, query) => {

        const queryRes = query && query !== null ? query : '';

        let searchedMoviesRes = await this.onFetchMoviesList(
            `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&language=en-US&query=${queryRes}&page=`,

        page, "moviesArr");

        return searchedMoviesRes;
    }

    onGetMovieDetails = async (movieId) => {

        let movieDetailsRes = await this.onFetchMoviesList(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.API_KEY}&language=en-US`,

        1, "movieObj");

        return movieDetailsRes;
    }

    onGetMovieVideos = async (movieId) => {


        let movieVideosRes = await this.onFetchMoviesList(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${this.API_KEY}&language=en-US`,

        1, "movieObj");

        return movieVideosRes;
    }

    onGetMovieCast= async (movieId) => {

        let movieCastRes = await this.onFetchMoviesList(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${this.API_KEY}&language=en-US`,

        1, "movieObj");

        return movieCastRes;
    }

    onGetSimilarMovies = async (movieId) => {

        let similarMoviesRes = await this.onFetchMoviesList(
            `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${this.API_KEY}&language=en-US&page=1`,

        1, "moviesArr");

        return similarMoviesRes;
    }

}