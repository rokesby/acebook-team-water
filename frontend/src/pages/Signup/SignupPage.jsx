import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlobalNavBar from "../../components/Post/GlobalNavBar";
import { signup } from "../../services/authentication";
import "./SignupPage.css";
import defaultProfileImage from "../../assets/defaultProfileImage.svg.png";

export const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

    const handleSubmit = async (event) => {
      event.preventDefault();
      setErrorMessage("") // clears error message at the start of operations so that no old error messages are shown - doesn't change anything for now but may be useful if more error messages are coming in from the backend

      if (!isValidEmail(email)) {
        setErrorMessage("Invalid email address format");
        return;
      } else if (password != confirmPassword) {
        setErrorMessage("Passwords do not match")
      } else {
        try {
          const imageForProfile = profileImage || defaultProfileImage // logical OR operator to set default profile image if no image is provided
          await signup(name, email, password, imageForProfile); // passing in imageForProfile
          console.log("redirecting...:");
          navigate("/login");
        } catch (err) {
          console.error(err);
          // navigate("/signup");
          setErrorMessage(err.message)
        }
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleProfileImageChange = (event) => {
    setProfileImage(event.target.value);
  };

  return (
    <div className="page-container">
      <GlobalNavBar />
      <div className="signup-container">
        <div className="signup-form">
          <h2>Signup</h2>
          <div id="instructions">Enter your details to sign up:</div>
          <form onSubmit={handleSubmit}>
            <div className="label-input-container">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="label-input-container">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="label-input-container">
              <label htmlFor="password">Password:</label>
              <input
                placeholder="Password"
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="label-input-container">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                placeholder="Confirm Password"
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            <div className="label-input-container">
              <label htmlFor="profile-image">Profile Image URL (not required):</label>
              <input
                id="profile-image"
                type="text"
                value={profileImage}
                onChange={handleProfileImageChange}
                placeholder="Insert URL here"
              />
            </div>
            <input role="submit-button" id="submit" type="submit" value="Submit" />
            <Link to="/login" id="link">Already have an account? Login here</Link>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};
