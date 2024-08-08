import { useState, useEffect } from "react";
import GlobalNavBar from "../../components/Post/GlobalNavBar";

import { getFriendRequests, getFriends }  from "../../services/friends";
import User from "../../components/Post/User/User";

export const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const user = localStorage.getItem("user");
  let user_name = ""; // Added check to ensure 'user' is not 'null', as throws error
  let userId = "";

  if (user) {
    try {
      const userObj = JSON.parse(user);
      user_name = userObj.name;
      userId = userObj.id
    } catch (error) {
      console.error("Error parsing user data", error);
    }
  }
  const fetchFriends = async (userId) => {
    const data = await getFriends(userId)
    setFriends(data.friends)
  }

  const fetchRequests = async (userId) => {
    const data = await getFriendRequests(userId)
    setFriendRequests(data.friendRequestsReceived)
  }

  useEffect(() => {
    fetchFriends(userId);
    fetchRequests(userId);
  }, [userId])
  console.log(friendRequests)
  return (
    <div>
      <GlobalNavBar user_name={user_name} />
    <div>
        <h4>Friends</h4>
        {friends.map((friend) => (
            <User key={friend._id} name={friend.name} profileImage={friend.profileImage}/>
        ))}
    </div>
    <div>
        <h4>Friend Requests</h4>
        {friendRequests.map((friend) => (
            <User key={friend._id} name={friend.name} profileImage={friend.profileImage} isRequest={true} userId={userId} friendId={friend._id} fetchFriends={fetchFriends} fetchRequests={fetchRequests} />
        ))}
    </div>
      <br></br>
    </div>
  );
};
