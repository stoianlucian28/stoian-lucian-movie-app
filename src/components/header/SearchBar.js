import { Icon } from "@iconify/react";
import { useEffect } from "react";

/*
    text => current searchbar state
    setText => set searchbar state function

*/
const SearchBar = ({text, setText}) => {

    return(

        <div className="search-wrapper">
            
            <Icon 
                className = "search-bar-icon"
                icon = "fe:search"
            />

            <input 
                className="search-bar" 
                type="text"
                placeholder="Search"
                value={text}
                onChange = {(ev) => {setText(ev.target.value)}}
            />

            <Icon 
                className = "clear-search-icon"
                icon = "bxs:eraser"
                onClick = {() => {setText('')}}
            />

        </div>
    );
}

export default SearchBar;