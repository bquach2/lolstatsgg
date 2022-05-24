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
  async getMatches() {
    console.log("ran")
    let index = 0;
    let tempKills = [];
    let tempDeaths = [];
    let tempAssists = [];
    
    this.state.matchIds.forEach((idVal) => {
      //if match is the 2nd to last, stop
      if(index > 14) return;
      let match1 = idVal;
      let url = "https://americas.api.riotgames.com/lol/match/v5/matches/" + match1 + "?api_key=" + apikey;
      fetch(url)
      .then(response => response.json())
      .then((data) => {
        let playerIndex = 0;
        let forIndex = 0;

        //loop through to find user index for this match
        data.info.participants.forEach((participant) => {
          if(participant.puuid == this.state.puuid) {
            playerIndex = forIndex;
          }
          forIndex++;
        })
        console.log("INDEX: " + playerIndex);
        //add to current tracker of values arrays.
        tempKills.push(data.info.participants[playerIndex].kills);
        console.log(tempKills);
        tempAssists = [...tempAssists, data.info.participants[playerIndex].assists];
        tempDeaths = [...tempDeaths, data.info.participants[playerIndex].deaths];
      })
      index++;
    }) 
    console.log(tempKills);
    await this.setState({
      matchKills: tempKills,
      matchDeaths: tempDeaths,
      matchAssists: tempAssists,
    });
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
        <DisplayStats key={index} ind={index + 1} kills={this.state.matchKills[index]} deaths={this.state.matchDeaths[index]} assists = {this.state.matchAssists[index]} />
      )
    })
    console.log(this.state);

    return (
      <div>
        <div className="App">
          <h1 className="Header"> Lol Stats </h1>
          <h1>Hello World!</h1>
          {this.state.name !== "" ? "Summoner: " + this.state.name: ""}
          <Addform getUsername={this.getUsername}/>
          {AllMatches}
        </div>
      </div>
   
  );
  }
  
}

export default App;
