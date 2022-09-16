import { Icon } from "@iconify/react";


const ViewButtons = ({view, setView}) => {

    const onSetButtonState = (viewIdx) => {
        
        return view === viewIdx ? "change-view-button selected" : "change-view-button";
    }
    
    return(

        <div className="buttons-wrapper">

            <Icon 
                className={onSetButtonState(0)}
                icon = "bi:grid-fill"
                onClick={() => {setView(0)}}
            />

             <Icon 
                className={onSetButtonState(1)}
                icon = "ci:list-checklist"
                onClick={() => {setView(1)}}
            />

        </div>
    )
}

export default ViewButtons;