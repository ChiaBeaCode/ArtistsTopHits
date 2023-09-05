import styles from "~/styles/index.css";
import logo from "~/styles/logo.png";
import { useState, useEffect, useRef } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { CapitalizeEachWord } from "../components/miscFunctions";
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

const CLIENT_ID = process.env.NETLIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NETLIFY_CLIENT_SECRET;

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
      .then((data) => setAccessToken(data.access_token))
      .catch((error => ErrorMessage(error.status)));
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
          console.log("error 1")
          throw new Error('API request failed with status ' + response.status);
          // ErrorStatus(response.status);
        } else {
          console.log("response 2");
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        if (data.artists.items.length > 0) {
          for (const i in data.artists.items) {
            if (searchInput === data.artists.items[i].name) {
              return data.artists.items[i].id;
            } else if (undefined) {
              console.log("undefinded? first")
              setErrorOccured(!errorOccured);
            }
          }
        } else {
          console.log("why come through?")
          setErrorOccured(!errorOccured);
        }
      }).catch((error) => {
        console.error("caught it first?", error)
        ErrorStatus(error)
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
          // ErrorStatus(response.status);
        } else {
          console.log("response 2", response.status)
          return response.json();
        }
      })
      .then((data) => {
        console.log("data 2", data);
        setTop10Songs(data.tracks);
      })
      .catch((error) => {
        console.error("caught it second?", error)
        ErrorStatus(error)
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
