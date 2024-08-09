import Toast from "react-bootstrap/Toast";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { likePost } from "../../services/posts";
import { deletePost } from "../../services/posts";
import Accordion from "react-bootstrap/Accordion";
import "./Post.css";

const Post = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [liked, setLiked] = useState(props.post.isLikedByUser);
    const [numberOfLikes, setNumberOfLikes] = useState(props.post.numberOfLikes);

    const handleAddComment = () => {
        localStorage.setItem("post_id", props.post._id);
        navigate("/addcomment");
    };

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await likePost(token, props.post._id);
            setLiked(data.isLikedByUser);
            setNumberOfLikes(data.numberOfLikes);
        } catch (error) {
            console.log(error);
        }
    };
  
    const handleEditPost = () => {
      localStorage.setItem("post_id", props.post._id)
      localStorage.setItem("message", props.post.message)
      localStorage.setItem("imageUrl", props.post.imageUrl)
      navigate(`/updatepost`)
    };

    const handleDeletePost = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return; // exit if the user says no

      try {
        const token = localStorage.getItem("token");
        await deletePost(token, props.post._id);
        console.log("Post successfully deleted");
        navigate("/profile"); // navigate to profile
        window.location.reload();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    };
  
    const userName = props.post.user_id.name;
    const formattedDate = moment(props.post.createdAt).fromNow();
    const image = props.post.imageUrl;
    const comments = props.post.comments;
    const profileImage = props.post.user_id.profileImage
    const likedByUsers = props.post.likes;

    return (
        <div className='d-flex justify-content-center' style={{ marginBottom: "30px" }} data-testid="post">
          <Toast style={{ width: "60%", border: "1px solid black" }}>

            <Toast.Header>
              <img 
                  src={profileImage ? profileImage : "holder.js/20x20?text=%20"} 
                  className="rounded me-2 profile-image" 
                  alt="Profile" 
              />
              <strong className='me-auto'>
                {userName ? userName : ""}
              </strong>{" "}
              {/* Added user details in posts controller in backend to be used here */}
              <Button variant='link' onClick={handleLike} data-testid="like-button">
                {liked ? <FaHeart color='red' data-testid="filled-heart-icon" /> : <FaRegHeart />}
                <span data-testid="like-count">{numberOfLikes}</span>
              </Button>
                <small>Posted {formattedDate}</small>
            </Toast.Header>

            <Toast.Body style={{ paddingBottom: image ? "0px" : "0px" }}>
              <article 
              style={{ textAlign: "left", paddingLeft: "55px", paddingRight: "55px"}} 
              key={props.post._id}>{props.post.message}</article>
              <br></br>
              
                {image && (
                  <img
                      src={image}
                      style={{ width: "80%" }}
                      alt="Post"
                  />
              )}
              
            </Toast.Body>
              <br></br>
              <Button className="my-button" onClick={handleAddComment}>Add a comment</Button>
              {location.pathname === "/profile" && (
                <>
                  <Button className="my-button" onClick={handleEditPost}>Edit Post</Button>
                  <Button className="my-button-red" variant="danger" onClick={handleDeletePost}>Delete Post</Button>
                </>        
              )}
              <br />
              <br /> 
      
          <Accordion>
          <Accordion.Item eventKey="0">
            
            <Accordion.Header>
              <span style={{ fontSize: "0.9rem" }}>Comments:</span>
            </Accordion.Header>
            
            <Accordion.Body>
              {comments.length > 0 ? (

              comments.map((comment) => (
              <div key={comment._id} className="comment" style={commentStyle}>
                <img 
                  src={comment.user_id.profileImage ? comment.user_id.profileImage : "holder.js/20x20?text=%20"} 
                  className="rounded me-2 liker-profile-image" 
                  alt="Profile" 
                  />
              
                <strong>{comment.user_id.name}</strong>: {comment.comment}
              
                <hr style={separatorStyle} />
              </div>
              ))
              ) : (
              <p>No comments yet. Be the first to comment!</p>
              )}
            </Accordion.Body>

          </Accordion.Item>

          <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <span style={{ fontSize: "0.9rem" }}>Likes: {numberOfLikes}</span>
                </Accordion.Header>
                <Accordion.Body>
                  {likedByUsers && likedByUsers.length > 0 ? (
                    likedByUsers.map((user) => (
                      <div key={user._id} className="likes-info-container">
                        <img 
                          src={user.profileImage ? user.profileImage : "holder.js/20x20?text=%20"} 
                          className="rounded me-2 liker-profile-image" 
                          alt="Profile" 
                        />
                        <p className="liker-name"><strong>{user.name}</strong></p>
                      </div>
                    ))
                  ) : (
                    <p>No likes yet. Be the first to like!</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>

          </Accordion>

          

          </Toast>
        
        </div>
    );


};

const commentStyle = {
  textAlign: "left",
  padding: "10px 0",
};

const separatorStyle = {
  border: "1px solid #e0e0e0",
  margin: "10px 0",
};
//line 72 is where comments added to post starts using Accordian as a bootstrap dropdown
export default Post;
