import React from "react";

const FaceRecognition = ({ImageUrl}) => {
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img alt='' src={ImageUrl} width="500px" height="auto"/>
            </div>
        </div>
    );
}

export default FaceRecognition;