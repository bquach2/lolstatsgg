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
  getMatches() {
    console.log("ran")
    this.state.matchIds.forEach((idVal) => {
      let match1 = idVal;
      let url = "https://americas.api.riotgames.com/lol/match/v5/matches/" + match1 + "?api_key=" + apikey;
      fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.setState(prevState => ({
          matchKills: [...prevState.matchKills, data.info.participants[0].kills],
          matchAssists: [...prevState.matchAssists, data.info.participants[0].assists],
          matchDeaths: [...prevState.matchDeaths, data.info.participants[0].deaths],
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
        <DisplayStats key={index} ind={index} kills={this.state.matchKills[index]} deaths={this.state.matchDeaths[index]} assists = {this.state.matchAssists[index]} />
      )
    })

    return (
      <div>
        <div className="App">
          <h1 className="Header"> Lol Stats </h1>
          <h1>Hello World!</h1>
          {this.state.name !== "" ? "Summoner: " + this.state.name: ""}
          <br />
          <Addform getUsername={this.getUsername}/>
          {this.state.name !== "" ? <button onClick={() => this.getMatchIds(this.state.puuid)}> Get match history </button>: ""}
          <button onClick={this.getMatches}> Get Matches </button>
          {this.state.puuid}
          {this.state.matchIds}
          {AllMatches}
        </div>
      </div>
   
  );
  }
  
}

export default App;
