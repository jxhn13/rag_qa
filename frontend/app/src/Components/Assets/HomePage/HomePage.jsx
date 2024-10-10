import React from "react";
import { useLocation } from "react-router-dom";
import MultiplePDFUpload from "../Pdf-Uploads/pdf-upload";
import './HomePage.css'

function HomePage()
{

    const location = useLocation()
    const {username} = location.state || {}
    return(

        <div className="chat-bot">

            <div className="userName">
                <h1> Welcome {username} </h1>
            </div>

            
            <div className="side-bar">
                <h1>Upload your files here</h1>
                <MultiplePDFUpload/>  
            </div>
            <div className="bottom-bar">
                <input type="text"  placeholder="Type.."/>
                <button>SEND</button>
            </div>
            
              
        </div>

    )
}

export default HomePage