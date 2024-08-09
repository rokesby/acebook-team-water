const express = require("express");
const router = express.Router();

const FriendsController = require("../controllers/friends");

router.post("/send", FriendsController.sendFriendRequest);
router.post("/accept", FriendsController.acceptFriendRequest);
router.post("/decline", FriendsController.declineFriendRequest);
router.delete("/remove", FriendsController.removeFriend);
router.get("/:id", FriendsController.getFriends);
router.get("/requests/:id", FriendsController.getFriendRequests);

module.exports = router;
