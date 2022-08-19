import './App.css';
import React from 'react';
import apikey from './apikey';
import Addform from './Addform';
import DisplayStats from './DisplayStats';
import { wait } from '@testing-library/user-event/dist/utils';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     name: "",
     puuid: "",
     matchIds: [],
     matchKills: [],
     matchAssists: [],
     matchDeaths: [],
     matchChamps: [],
     matchMinions: [],
     matchLevels: [],
     matchDuration: [],
     render: true,
    }
    this.getUsername = this.getUsername.bind(this);
    this.getMatchIds = this.getMatchIds.bind(this);
    this.changeRender = this.changeRender.bind(this);
    this.getMatches = this.getMatches.bind(this);

  }

  componentDidMount() {
    //alert("Enter username for match history and stats");
  }

  //Upon User submission from form, take in name.value and set state.name to this value. From here, make api call to get puuid
  // that will later be used to find match history.
  getUsername(event) {
    event.preventDefault();
    if(!event.target.name.value) {
      alert("Input must not be empty");
      return;
    }
    let name = event.target.name.value;
    let url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + apikey;
    //console.log(url);
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      //console.log(data)
      this.setState({
        name: data.name,
        puuid: data.puuid,
      });
      this.getMatchIds(data.puuid);
    })
  }
   
  //get last 20 matches by passing in puuid that is gotten after obtaining username from input. 
  getMatchIds(puuid) {
    //console.log(puuid);
    //combine riots url with puuid and apikey to form fetch api url.
    let url = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=20&api_key=" + apikey;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      this.setState({
        matchIds: data,
      }, () => {
        //get match info for the last 20 games
        console.log(this.state.matchIds);
        this.getMatches();
      })
    })
  }

  //Use 20 matchids from state to get match results.
  //have to make 3 separate arrays for kills, assists, deaths for every 20 games
  getMatches() {

    let indexLoop = 0;
    let playerIndex = 0;
    this.state.matchIds.forEach((idVal) => {
      if(indexLoop > 14) return;
      indexLoop++;
      let forIndex = 0

      let match1 = idVal;
      let url = "https://americas.api.riotgames.com/lol/match/v5/matches/" + match1 + "?api_key=" + apikey;
      fetch(url)
      .then(response => response.json())
      .then((data) => {
        data.info.participants.forEach((participant) => {
          if(participant.puuid == this.state.puuid) {
            playerIndex = forIndex;
          }
          forIndex++;
        })
        this.setState(prevState => ({
          matchKills: [...prevState.matchKills, data.info.participants[playerIndex].kills],
          matchAssists: [...prevState.matchAssists, data.info.participants[playerIndex].assists],
          matchDeaths: [...prevState.matchDeaths, data.info.participants[playerIndex].deaths],
          matchChamps: [...prevState.matchChamps, data.info.participants[playerIndex].championName],
          matchMinions: [...prevState.matchMinions, data.info.participants[playerIndex].totalMinionsKilled],
          matchLevels: [...prevState.matchLevels, data.info.participants[playerIndex].champLevel],
          matchDuration: [...prevState.matchDuration, data.info.participants[playerIndex].gameDuration],

        }))
      })
    }) 
  }

  //display stats for individual player function


  changeRender() {
    this.setState(prevState => {
      return ({
        render: !prevState.render
      })
    })
  }

  render() {
    
    let AllMatches = this.state.matchKills.map((kills, index) => {
      return (
        <DisplayStats key={index} ind={index + 1} 
          kills={this.state.matchKills[index]} 
          deaths={this.state.matchDeaths[index]}
          assists = {this.state.matchAssists[index]}
          champs = {this.state.matchChamps[index]}
          levels= {this.state.matchLevels[index]}
          minions = {this.state.matchMinions[index]}
          duration = {this.state.matchDuration[index]}
         />
      )
    })

    return (
      <div>
        <div className="App">
          <h1 className="Header"> Lol Stats </h1>
          {this.state.name !== "" ? "Summoner: " + this.state.name: ""}
          <br />
          <Addform getUsername={this.getUsername}/>
          {AllMatches}
        </div>
      </div>
   
  );
  }
  
}

export default App;