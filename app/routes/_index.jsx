import styles from "~/styles/index.css";
import logo from "~/styles/logo.png";
import { useState, useEffect, useRef } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { CapitalizeEachWord } from "../components/miscFunctions"
import { ErrorMessage, ErrorStatus } from "../components/errorMessages";
// import Variables from "../shh";
import { PreviewMusicPlayer } from "~/components/musicPlayer";
import { Card } from "../components/card";
// import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Artist's Top Ten" },
  ];
};

const CLIENT_ID ="75d85797df8945908ad06a3166a55b3b"
const CLIENT_SECRET ="bf8033d9ad0e4ba9ad23b4e16f623b47"
// const CLIENT_ID = Variables.SPOTIFY_CLIENT_ID;
// const CLIENT_SECRET = Variables.SPOTIFY_CLIENT_SECRET;

export default function App() {
  const [errorOccured, setErrorOccured] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [top10Songs, setTop10Songs] = useState([]);
  const [currentSong, setCurrentSong] = useState({
    songName: "Preview song!",
    songUrl: "",
  });
  const searchInputRef = useRef();








  useEffect(() => {
    console.log("beginnning")
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => {
        if (data.access_token == undefined || data.access_token == null){
          throw new Error("Access token not recieved" + data.status)
        }
        setAccessToken(data.access_token)
      })
      .catch((error => setErrorOccured(true)));
  }, []);





  async function search() {
    const searchInput = CapitalizeEachWord(searchInputRef.current.value);
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    // var artistId = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist", searchParameters)
    // .then(response => response.json())
    // .then(data => {return data.artists.items[0].id })








    var artistId = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => {
        if (response.status != 200) {
          throw new Error('API request failed with status ' + response.status);
        } 
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.artists.items.length == 0){
          throw new Error("first invalid input")
        } else if (data.artists.items.length > 0) {
          for (const i in data.artists.items) {
            if (searchInput === data.artists.items[i].name) {
              setErrorOccured(false)
              return data.artists.items[i].id;
            } 
          }
        } 
      }).catch((error) => {
        setErrorOccured(true)
      });










    var topTen = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistId +
        "/top-tracks?country=US",
      searchParameters
    )
      .then((response) => {
        if (response.status != 200) {
          console.log("error 2")
          throw new Error('API request failed with status ' + response.status);
        } 
        return response.json();
      })
      .then((data) => {
        if (data.tracks.length == 0){
          throw new Error()
        }
        console.log("data 2", data);
        setErrorOccured(false)
        setTop10Songs(data.tracks);
      })
      .catch((error) => {
        console.log("second caught error")
        setErrorOccured(true)
      });
    console.log("search ", searchInput, topTen);
  }












  return (
    <div className="app">
      <div className="header">
        <a href="https://chiabeacode.netlify.app/">
          <img src={logo} alt="logo"></img>
        </a>
        <div>
          <h1>Artist's Top 10 Tracks</h1>
          <p>
            {" "}
            Spotify generator to view and preview an artist's top 10 tracks
          </p>
        </div>
      </div>
      <div className="searchArea">
        <input
          className="form"
          placeholder="Search artist...."
          type="input"
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              search();
            }
          }}
          ref={searchInputRef}
        ></input>
        <button onClick={search} className="searchBtn" type="button">
          <BiSearchAlt />
        </button>
      </div>
      {errorOccured ? (
        ErrorMessage()
      ) : (
        <div className="cardContainer">
          <Card top10Songs={top10Songs} setCurrentSong={setCurrentSong} />
        </div>
      )}
      {/* <div className="cardContainer">
        <Card top10Songs={top10Songs} setCurrentSong={setCurrentSong} />
      </div> */}
      <PreviewMusicPlayer currentSong={currentSong} />
    </div>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
