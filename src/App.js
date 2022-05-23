import './App.css';
import React from 'react';
import apikey from './apikey';
import Addform from './Addform';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     name: "",
     puuid: "",
     matches: [],
    }
    this.getUsername = this.getUsername.bind(this);
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
    })
  }
   
  //get last 20 matches by passing in puuid that is gotten after obtaining username from input. 
  getMatchIds(puuid) {
    let matches = [];
    console.log(puuid);
    //combine riots url with puuid and apikey to form fetch api url.
    let url = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=20&api_key=" + apikey;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      this.setState(prevState => {
        return {
          name: prevState.name,
          puuid: prevState.puuid,
          matches: data,
        }
      })
    });
  }

  render() {
    return (
      <div>
        <header className="Header"> Lol Stats </header>
        <div className="App">
          <h1>Hello World!</h1>
          {this.state.name !== "" ? "Summoner: " + this.state.name: ""}
          <br />
          <Addform getUsername={this.getUsername}/>
        
          <button onClick={() => this.getMatchIds(this.state.puuid)}> X </button>
          {this.state.matches[0]}
        </div>
      </div>
   
  );
  }
  
}

export default App;
