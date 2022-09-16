import { Icon } from "@iconify/react";


const Modal = ({children, visible, setVisibile}) => {

    /*
        closing modal on outside click (alternative: using useRef hook).
    */
    const onCloseModalOutsideClick = (ev) => {

        if( ev.target.id === 'modal' ){

            setVisibile(false);  
        }
    }

    if(visible){

        return(

            <div 
                id = "modal"
                className="modal-container"
                onClick = {(ev) => {onCloseModalOutsideClick(ev)}}
            >
    
                <div className="modal-card">
                    
                    <div className="header">
    
                        <Icon 
                            className="close-modal-btn"
                            icon={"ci:close-small"}
                            onClick = {() => {setVisibile(false)}}
                        />
                        
                    </div>
    
                    {children}
    
                </div>
    
            </div>
        );
    }
}

export default Modal;