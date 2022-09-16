import { HashRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import './components/header/Header.css';
import './components/movie-cards/MovieCard.css';
import './components/buttons/buttons.css';
import './components/more-movies/MoreMovies.css';
import './components/loader/Loader.css';
import './components/modal/Modal.css';
import './modules/home/homepage.css';

import Header from './components/header/Header';
import HomePage from './modules/home/HomePage';
import { useEffect, useState } from 'react';

function App() {

  const [ searchText, setSearchText ] = useState('');
  
  return (
    
    <>

      <Header 
          searchText = {searchText}
          setSearchText = {setSearchText}
      />

      <HashRouter>
                    
        <Routes>

          <Route 
            path="/"
            element = {

              <HomePage 
                searchText = {searchText}
              />
            } 
          />
        </Routes>

      </HashRouter>

    </>
  );
}

export default App;
