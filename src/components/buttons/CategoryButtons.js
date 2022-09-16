

const CategoryButtons = ({setCategory, category}) => {

    const onSetButtonState = (categoryIdx) => {
        
        return category === categoryIdx ? "change-category-button selected" : "change-category-button";
    }

    return(

        <div className="buttons-wrapper">

            <button 
                className={onSetButtonState(0)}
                type="button"
                onClick={() => {setCategory(0)}}
            >
                All Movies
            </button>

            <button 
                className={onSetButtonState(1)}
                type="button"
                onClick={() => {setCategory(1)}}
            >
                Favorites
            </button>

        </div>

    );
}

export default CategoryButtons;