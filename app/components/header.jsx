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
        <p>Are you curious about an artist's best hits? Search their name and let's find out!</p>
      </div>
    </div>
  );
}
