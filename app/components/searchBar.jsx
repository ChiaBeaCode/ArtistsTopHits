import { useRef } from "react";
import { CapitalizeEachWord } from "./miscFunctions";
import { BiSearchAlt } from "react-icons/bi";

export function SearchBar(props) {
  const accessToken = props.accessToken;
  const setTop10Songs = props.setTop10Songs;
  const setErrorOccured = props.setErrorOccured;

  const searchInputRef = useRef();

  async function search() {
    const searchInput = CapitalizeEachWord(searchInputRef.current.value); //Users input, formatted

    //Search parameters for grabbing artist id and their top ten songs
    const searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    setErrorOccured(null);

    //Fetch call to grab an artist id
    const artistId = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      searchParams
    )
      .then((response) => {
        console.log("entered artistId");
        if (response.status !== 200) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        if (data.artists.items.length === 0) {
          throw new Error("No Artist Found");
        } else if (data.artists.items.length > 0) {
          //Checking for an exact match to users input
          for (const i in data.artists.items) {
            if (searchInput === data.artists.items[i].name) {
              return data.artists.items[i].id;
            } else {
              throw new Error("No Artist Found");
            }
          }
        }
      })
      .catch((error) => {
        if (error.message !== "") {
          setErrorOccured(error.message); //Grab error message to display to user
        }
      });

    const topTen = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
      searchParams
    )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        if (data.tracks.length === 0) {
          throw new Error("No Tracks Found");
        }
        setTop10Songs(data.tracks);
      })
      .catch((error) => {
        if (error.message !== "") {
          setErrorOccured(error.message); //Grab error message to display to user
        }
      });
  }

  return (
    <div className="searchArea">
      <input
        className="form"
        placeholder="Enter Artist Name...."
        type="input"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            search();
          }
        }}
        ref={searchInputRef}
      ></input>
      <button onClick={search} className="searchBtn" type="button">
        <BiSearchAlt />
      </button>
    </div>
  );
}
