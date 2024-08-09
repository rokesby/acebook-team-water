import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MdOutlineRssFeed,
  MdOutlinePostAdd,
  MdPerson,
  MdPeopleAlt,
} from "react-icons/md";
import { IconContext } from "react-icons/lib";
import { PiSignOutBold } from "react-icons/pi";

export const clearLocalStorage = () => {
  localStorage.clear();
  console.log("test run");
  window.location.href = "/";
};

function GlobalNavBar(props) {
  const isLoggedin = localStorage.getItem("token") !== null; // returns true if token is not null

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="/" className="logo" data-testid="logo-link">
            ♠️ AceBook
          </a>
        </div>

        {/* conditional rendering - if isLoggedin is a truthy and the second part is also truthy then the second part after && gets returned. if isLoggedin isnt truthy then the second part (the buttons) is not shown */}
        {isLoggedin && (
          <div className="navbar-right">
            <IconContext.Provider value={{ size: "23px", color: "white" }}>
              <a href="/posts" data-testid="posts-link">
                <MdOutlineRssFeed />
              </a>

              <div style={{ paddingRight: "20px" }}></div>
              <a href="/profile" data-testid="profile-link">
                <MdPerson />
              </a>

              <div style={{ paddingRight: "20px" }}></div>
              <a href="/createpost" data-testid="create-post-link">
                <MdOutlinePostAdd />
              </a>

              <div style={{ paddingRight: "20px" }}></div>
              <a href="/friends" data-testid="friends-link">
                <MdPeopleAlt />
              </a>

              <div style={{ paddingRight: "20px" }}></div>
            </IconContext.Provider>
            <a
              href="/"
              onClick={clearLocalStorage}
              className="logout-button"
              data-testid="logout-link"
            >
              <PiSignOutBold />
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}

export default GlobalNavBar;
