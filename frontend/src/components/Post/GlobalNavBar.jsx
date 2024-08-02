import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdOutlineRssFeed, MdOutlinePostAdd } from "react-icons/md";
import {
  FaPlus,
  FaRegUser,
  FaUser,
  FaUserCircle,
  FaPlusCircle,
} from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { PiSignOutBold } from "react-icons/pi";
//test
function GlobalNavBar(props) {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="/" className="logo">
            ♠️ AceBook
          </a>
        </div>

        <div className="navbar-right">
          <IconContext.Provider value={{ size: "23px", color: "white" }}>
            <a href="/posts">
              <MdOutlineRssFeed />
            </a>
            <div style={{ paddingRight: "20px" }}></div>
            <a href="/createpost">
              <MdOutlinePostAdd />
            </a>
            <div style={{ paddingRight: "20px" }}></div>
            <a href="/ ">
              <PiSignOutBold />
            </a>
          </IconContext.Provider>
        </div>
      </nav>
    </div>
  );
}

export default GlobalNavBar;
