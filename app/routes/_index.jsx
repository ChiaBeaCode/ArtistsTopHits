import styles from "~/styles/index.css";
import { Header } from "../components/header";
import { SearchBar } from "../components/searchBar";
import defaultImg from "~/styles/defaultImg.jpg";
import { useState, useEffect } from "react";
import { ErrorMessage } from "../components/errorMessages";
import { PreviewMusicPlayer } from "../components/musicPlayer";
import { Card } from "../components/card";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [{ title: "Artist's Top Ten" }];
};

export async function loader() {
  return json({
    ENV: {
      CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    },
  });
}

export default function App() {
  const [accessToken, setAccessToken] = useState("");
  const [errorOccured, setErrorOccured] = useState(null);
  const [top10Songs, setTop10Songs] = useState([]);
  const [currentSong, setCurrentSong] = useState({
    songName: "Preview song!",
    songUrl: "",
  });

  const SECRETS = useLoaderData();
  const CLIENT_ID = SECRETS.ENV.CLIENT_ID;
  const CLIENT_SECRET = SECRETS.ENV.CLIENT_SECRET;

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => {
        if (data.access_token === undefined || data.access_token === null) {
          throw new Error(`Status: ${data.status} Access Denied`);
        }
        setAccessToken(data.access_token);
      })
      .catch((error) => setErrorOccured(error.message));
  }, [CLIENT_ID, CLIENT_SECRET]);

  return (
    <div className="app">
      <Header />
      <SearchBar
        accessToken={accessToken}
        setTop10Songs={setTop10Songs}
        setErrorOccured={setErrorOccured}
      />
      {errorOccured ? (
        <ErrorMessage message={errorOccured} />
      ) : top10Songs.length > 0 ? (
        <>
          <div className="cardContainer">
            <Card top10Songs={top10Songs} setCurrentSong={setCurrentSong} />
          </div>
          <PreviewMusicPlayer currentSong={currentSong} />
        </>
      ) : (
        <img
          className="defaultImg"
          src={defaultImg}
          alt="default background"
        ></img>
      )}
    </div>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
