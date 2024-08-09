const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const User = require("../models/user");

const createComment = async (req, res) => {
  const post = await Post.findById(req.body.post_id);

  const user = await User.findById(req.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

  const comment = { comment: req.body.comment, user_id: req.user_id, profileImage: user.profileImage };

  console.log(post);
  post.comments.push(comment);

  await post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "comment created", token: newToken });
};



const CommentController = {
  createComment: createComment,

};

module.exports = CommentController;
