import React from "react";

function DisplayStats(props) {
    return (
    <div>
        <h2>Game {props.ind}:</h2>
        <h3>Champ: {props.champs}</h3> 
        <h3>Kills: {props.kills}</h3>
        <h3>Deaths: {props.deaths}</h3>
        <h3>Assists: {props.assists}</h3>
        <h3>KD Ratio: {((props.kills + props.assists) / props.deaths).toFixed(2)}</h3>
        <h3>Level: {props.levels}</h3> 
        <h3>Minions Farmed: {props.minions}</h3>
        <hr />
    </div>
    )
}

export default DisplayStats