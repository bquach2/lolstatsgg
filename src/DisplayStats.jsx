import React from "react";

function DisplayStats(props) {
    return (
    <div>
        <h2>Game {props.ind}:</h2>
        <h3>Kills: {props.kills}</h3>
        <h3>Deaths: {props.deaths}</h3>
        <h3>Assists: {props.assists}</h3> 
    </div>
    )
}

export default DisplayStats