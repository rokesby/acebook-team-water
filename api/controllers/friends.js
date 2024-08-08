const User = require("../models/user");

const sendFriendRequest = async (req, res) => {
  const senderId = req.body.senderId;
  const recipientId = req.body.recipientId;
  console.log(senderId);
  console.log(recipientId);

  try {
    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friendRequestsSent: recipientId },
    });

    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { friendRequestsReceived: senderId },
    });

    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong with sending a friend request" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const userId = req.body.userId;
  const friendId = req.body.friendId;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequestsReceived: friendId },
      $addToSet: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: userId },
      $pull: { friendRequestsSent: userId },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong with accepting a friend request",
    });
  }
};

const declineFriendRequest = async (req, res) => {
  const userId = req.body.userId;
  const friendId = req.body.friendId;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequestsReceived: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friendRequestsSent: userId },
    });

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong with declining a friend request",
    });
  }
};

const removeFriend = async (req, res) => {
  const userId = req.body.userId;
  const friendId = req.body.friendId;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong with removing a friend",
    });
  }
};

const getFriends = async (req, res) => {
  const userId = req.params.id;

  try {
    const userIsFound = await User.findById(userId);

    if (!userIsFound) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.findById(userId).populate(
      "friends",
      "name profileImage"
    );

    res.status(200).json({ friends: user.friends });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong with retrieving the friends list",
    });
  }
};

const getFriendRequests = async (req, res) => {
  const userId = req.params.id;

  try {
    const userIsFound = await User.findById(userId);

    if (!userIsFound) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.findById(userId).populate(
      "friendRequestsReceived",
      "name profileImage"
    );

    res
      .status(200)
      .json({ friendRequestsReceived: user.friendRequestsReceived });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong with retrieving the friend request list",
    });
  }
};

const FriendsController = {
  sendFriendRequest: sendFriendRequest,
  acceptFriendRequest: acceptFriendRequest,
  declineFriendRequest: declineFriendRequest,
  removeFriend: removeFriend,
  getFriends: getFriends,
  getFriendRequests: getFriendRequests,
};

module.exports = FriendsController;
