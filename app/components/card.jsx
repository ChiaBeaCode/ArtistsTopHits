import "~/styles/index.css";
import { CapitalizeFirstLetter } from "../components/miscFunctions"

export function Card(props) {
  const songs = props.top10Songs;
  const setCurrentSong = props.setCurrentSong;

  const grabUrl = (song) => {
    if (song.preview_url === null) {
      return null;
    }
    const chosenSong = { songName: song.name, songUrl: song.preview_url };
    setCurrentSong(chosenSong);
  };


  return (
    <div className="cardContainer">
      {songs.map((song, i) => {
        return (
          <div className="card" key={i}>
            <p className="cardTitle" title={song.name}>
              {song.name}
            </p>
            <img
              className="cardImage"
              src={song.album.images[1].url}
              alt="album cover"
            ></img>
            <div className="cardBody">
              <p>{CapitalizeFirstLetter(song.album.album_type)}: </p>
              <p className="cardAlbum" title={song.album.name}>
                {CapitalizeFirstLetter(song.album.name)}
              </p>
            </div>
            {song.preview_url ? (
              <button
                className="previewBtn"
                onClick={() => {
                  grabUrl(song);
                }}
              >
                Preview
              </button>
            ) : (
              <div>No preview</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
