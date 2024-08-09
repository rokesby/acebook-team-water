const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

const createToken = (userId) => {
  return JWT.sign(
    {
      user_id: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
};

let token;
let postId;

describe("/posts", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const user = new User({
      email: "post-test@test.com",
      password: "12345678",
    });
    await user.save();
    await Post.deleteMany({});
    token = createToken(user.id);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  // post should be deleted when given an id
  test("deletes a post when given an id and a valid user", async () => {
    // create a post
    const createResponse = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Test post to delete" });

    expect(createResponse.status).toEqual(201);
    console.log("Create response body:", createResponse.body);

    const postResponse = await request(app)
      .get("/posts/all")
      .set("Authorization", `Bearer ${token}`);

    console.log("Post after creation:", postResponse.body);

    const postId = postResponse.body.posts[0]._id;

    console.log("Created post with ID:", postId);

    // delete the post
    const deleteResponse = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Delete response status:", deleteResponse.status);
    console.log("Delete response body:", deleteResponse.body);

    expect(deleteResponse.status).toEqual(204);

    // check that the post is deleted
    const deletedPost = await Post.findById(postId);
    expect(deletedPost).toBeNull();
  });
});
