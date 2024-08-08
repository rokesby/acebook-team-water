const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const { post } = require("../app");

const getAllPosts = async (req, res) => {

  const posts = await Post.find()
  .populate("user_id", "name email profileImage")
  .populate("comments.user_id", "name email")
  .populate("likes", "name profileImage");

  const postsWithLikes = posts.map(post => ({
    ...post._doc, // spread operator to copy the post object - in mongoose the object is stored in _doc
    numberOfLikes: post.likes.length,
    isLikedByUser: post.likes.includes(req.user_id) // check if the user_id is in the likes array - will return true or false
  }));

  const token = generateToken(req.user_id);
  res.status(200).json({ posts: postsWithLikes, token: token });
};

const createPost = async (req, res) => {
  const post = new Post({
    ...req.body, // spread operator works as like a copy and paste to copy the req.body and add in the user_id below
    user_id: req.user_id, // must be same as what its in post
  });
  await post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token: newToken });
};

const getUserPosts = async (req, res) => {
  try {


    const posts = await Post.find({ user_id: req.user_id })
    .populate("user_id", "name email profileImage")
    .populate("comments.user_id", "name")
    .populate("likes", "name profileImage");

    const postsWithLikes = posts.map(post => ({
      ...post._doc,
      numberOfLikes: post.likes.length,
      isLikedByUser: post.likes.includes(req.user_id)
    }));
    res.status(200).json({posts: postsWithLikes});


  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching the user's posts" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params; // id is the id of the post to delete that comes from the request sent
  try {
    const postToDelete = await Post.findById(id);
    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (postToDelete.user_id.toString() !== req.user_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Post.deleteOne({ _id: id }); // delete method changed to deleteOne and postToDelete changed from instance to model itself
    return res.status(204).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params; // id is the id of the post to update that comes from the request sent
  try {
    const postToUpdate = await Post.findById(id);
    if (!postToUpdate) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (postToUpdate.user_id.toString() !== req.user_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const filter = { _id: id };
    const update = { message: req.body.message, imageUrl: req.body.imageUrl };
    const post = await Post.findOneAndUpdate(filter, update, { new: true });
    return res.status(200).json({ message: "Post updated", post: post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const likePost = async (req,res) => {
  const { id } = req.params;
  const userId = req.user_id;

  try {
    const postToLike = await Post.findById(id);
    if (!postToLike) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = postToLike.likes.indexOf(userId);
    if (likeIndex > -1) {
      // user already liked the post so this is an unlike
      postToLike.likes.splice(likeIndex, 1);
    } else {
      // user has not liked the post so this is a like. it also stops duplicate likes from the same user
      if (!postToLike.likes.includes(userId)) {
        postToLike.likes.push(userId);
      }
    }

    await postToLike.save();
    res.status(200).json({ 
      message: "Post liked", 
      numberOfLikes: postToLike.likes.length, 
      likes: postToLike.likes,
      isLikedByUser: postToLike.likes.includes(userId)
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getUserPosts: getUserPosts,
  deletePost: deletePost,

  updatePost: updatePost,

  likePost: likePost

};

module.exports = PostsController;

// curl command example to delete a post

// curl -x DELETE -H "Authorization Bearer (token)" http://localhost:3000/posts/(id)

// curl -X DELETE -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjZiMGRhZTVlNzY2ODcxZTkxZDY4NzMzIiwiaWF0IjoxNzIyOTM3MjAyLCJleHAiOjE3MjI5Mzc4MDJ9.8VX79p4vUk3Iq0LZCHoCuYTvXmUS6JQ-fU3WkLtSf2Y" http://localhost:3000/posts/66b1ef77158ea7b19674057f
