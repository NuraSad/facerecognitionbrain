import React from "react";

const Entries = ({userName, userEntries}) => {
    return (
        <div>
            <div className="white f3">
                {`${userName}, your current entrie count is ...`}
            </div>
            <div className="white f1">
                {userEntries}
            </div>
        </div>
    );    
}

export default Entries;