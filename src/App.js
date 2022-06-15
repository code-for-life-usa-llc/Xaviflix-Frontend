import React from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';
import YouTube from 'react-youtube';
import LoginSignup from './Componets/LoginSignup';

const NODE_URL = 'http://127.0.0.1:3001'
const posterSite = "https://image.tmdb.org/t/p/w500"
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      user: null,
      nowPlaying: null,
    }
  }
  componentDidMount = async () => {
    this.fetchAllMovies();
  };
  fetchAllMovies = async () => {
    const response = await fetch(`${NODE_URL}/movies`);
    const movies = await response.json();
    // console.log(tracks);
    this.setState({ movies });
  }
  playMovie = (trailer) => {
    this.setState({nowPlaying: trailer})  
  }
  stopPlaying = (player) => {
    this.setState({nowPlaying: null})
    player.destroy();
  }
  _onReady = (event) => {
    const player = event.target;
    const iframe = document.querySelector('#player');
    player.playVideo();//won't work on mobile
    let requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    if (requestFullScreen) {
      requestFullScreen.bind(iframe)();
    }
    document.addEventListener("fullscreenchange", function() {
      if (!document.fullscreenElement)
        this.stopPlaying(player);
    }.bind(this), false);
    document.addEventListener("msfullscreenchange", function() {
      if (!document.msFullscreenElement) {
        this.stopPlaying(player);
      }
    }.bind(this), false);
    document.addEventListener("mozfullscreenchange", function() {
      if (!document.mozFullScreen) {
        this.stopPlaying(player);
      }
    }.bind(this), false);
      document.addEventListener("webkitfullscreenchange", function() {
      if (!document.webkitIsFullScreen) {
        this.stopPlaying(player);
      }
    }.bind(this), false);
  }
  showYoutube() {
    let opts = {
      height: 300,
      width: 300
    }
      return this.state.nowPlaying && (
        <YouTube
          id="player"
          videoId={this.state.nowPlaying ? this.state.nowPlaying : ''}
          opts={opts}
          onReady={this._onReady}
          onStateChange={this._onStateChange}
        />
      )
  }

  userSignup = async (credentials) => {
    const response = await fetch(`${NODE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const user = await response.json();

    if (response.ok) this.setState({ user });
  };

  userLogin = async (credentials) => {
    const response = await fetch(`${NODE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const user = await response.json();

      // window.localStorage.setItem('user', user)
      this.setState({ user });
    }
  };

  render() {
    return !this.state.user ? <LoginSignup userSignup = {this.userSignup} userLogin = {this.userLogin}/> : (
      <div style={{ backgroundColor: "#1A1A1A", position: "absolute", height: "100%" }}>
                {this.showYoutube()}
        <header>
          <h1 style={{ color: "red" }}>Xaviflix</h1>
        </header>
        <main style={{ color: 'white', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <h1>New Releases</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {this.state.movies.map(movie => {
              return (
                <div style={{ margin: "0.5rem" }}>
                <button style={{
                  padding: 0,
                  border: 'none',
                  background: 'none'
                }} onClick={()=> this.playMovie(movie.trailer)}> <img style={{ width: 100, }} src={`${posterSite}${movie.poster_path}`} /> </button>
                </div>
              )
            })
            }
          </div>
        </main>
      </div>
    )
  }
}



export default App