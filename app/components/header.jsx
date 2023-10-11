import logo from "~/styles/logo.png";
import "~/styles/index.css";

export function Header() {
  return (
    <div className="header">
      <a href="https://chiabeacode.netlify.app/">
        <img src={logo} alt="logo"></img>
      </a>
      <div>
        <h1>Artist's Top 10 Tracks</h1>
        <p> Spotify generator to view and preview an artist's top 10 tracks</p>
      </div>
    </div>
  );
}
