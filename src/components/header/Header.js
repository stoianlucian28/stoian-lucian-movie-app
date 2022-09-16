import { Icon } from "@iconify/react";
import SearchBar from "./SearchBar";


const Header = ({ searchText, setSearchText }) => {

    return(

        <div className="header-wrapper">

            <SearchBar 
                text = {searchText}
                setText = { setSearchText }
            />

        </div>
    )
}

export default Header;