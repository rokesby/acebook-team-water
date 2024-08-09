import { Link } from "react-router-dom";
import GlobalNavBar from "../../components/Post/GlobalNavBar";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <>
      <GlobalNavBar></GlobalNavBar>
      <br></br>
      <div className="home">
        <h1>Welcome to Acebook!</h1>
        <br />
        <br />
        <br />

        <Link to="/signup" id= "button" className="btn btn-primary">Sign Up</Link>
        <br />
        <Link to="/login" id= "button" className="btn btn-primary">Log In</Link>
      </div>
    </>
  );
};
