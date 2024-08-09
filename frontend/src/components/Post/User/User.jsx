import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/esm/Button";
import { acceptFriendRequest, declineFriendRequest } from "../../../services/friends";

const User = (props) => {

    const userName = props.name;
    const profileImage = props.profileImage;
    const isRequest = props.isRequest

    const handleAccept = async () => {
      await acceptFriendRequest(props.userId, props.friendId)
      props.fetchFriends(props.userId);
      props.fetchRequests(props.userId);
    }

    const handleDecline = async () => {
      await declineFriendRequest(props.userId, props.friendId)
      props.fetchFriends(props.userId);
      props.fetchRequests(props.userId);
    }

    return (
        <div className='d-flex justify-content-center' style={{ marginBottom: "30px" }}>
          <Toast style={{ width: "60%" }}>
            <Toast.Header>
              <img 
                  src={profileImage ? profileImage : "holder.js/20x20?text=%20"} 
                  className="rounded me-2 profile-image" 
                  alt="Profile" 
              />
              <strong className='me-auto'>
                {userName ? userName : ""}
              </strong>{" "}
            </Toast.Header>
            {isRequest && (
                          <div>
                            <Button onClick={handleAccept}>Accept Friend Request</Button>
                            <Button onClick={handleDecline}>Decline Friend Request</Button>
                          </div>
                        )}
      
          </Toast>
        
        </div>
    );


};

//line 72 is where comments added to post starts using Accordian as a bootstrap dropdown
export default User;
