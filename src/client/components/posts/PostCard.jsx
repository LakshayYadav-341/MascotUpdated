import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import urls, { basePath, serverPath } from "@utils/urls";
import PostCarousel from "./carousel";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  selectSession,
  selectLoggedInUser,
} from "@client/components/auth/authSlice";
import axios from "axios";
import tempImage from "@client/assets/images/profile.png";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportPostButton from "./report";

const PostCard = (props) => {
  const location = useLocation();
  const isDashboardAdmin = location.pathname === "/dashboard/admin";

  const [likeInteract, setLikeInteract] = useState([]);
  const [commentInteract, setCommentInteract] = useState([]);
  const [comment, setComment] = useState("");
  const [isLikeChanged, setIsLikeChanged] = useState(false);
  const [isCommentChanged, setIsCommentChanged] = useState(false);

  const session = useSelector(selectSession);
  const loggedInUser = useSelector(selectLoggedInUser);

  // API endpoints
  const likeInteractionsUrl = basePath + urls.post.interactions
    .replace(":post", props.post._id)
    .replace(":type", "like");
  const likeInteractUrl = basePath + urls.post.interact
    .replace(":post", props.post._id)
    .replace(":type", "like");
  const commentInteractionsUrl = basePath + urls.post.interactions
    .replace(":post", props.post._id)
    .replace(":type", "comment");
  const commentInteractUrl = basePath + urls.post.interact
    .replace(":post", props.post._id)
    .replace(":type", "comment");

  // Fetch Likes
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(likeInteractionsUrl, {
          headers: { authorization: `Bearer ${session.token}` },
        });
        setLikeInteract(res.data);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
  }, [isLikeChanged, likeInteractionsUrl, session.token]);

  // Fetch Comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(commentInteractionsUrl, {
          headers: { authorization: `Bearer ${session.token}` },
        });
        setCommentInteract(res.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [isCommentChanged, commentInteractionsUrl, session.token]);

  // Like Post
  const likeHandler = async () => {
    try {
      await axios.put(
        likeInteractUrl,
        {},
        {
          headers: { authorization: `Bearer ${session.token}` },
        }
      );
      setIsLikeChanged(!isLikeChanged);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  // Comment on Post
  const commentHandler = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    try {
      const res = await axios.put(
        commentInteractUrl,
        { comment },
        {
          headers: { authorization: `Bearer ${session.token}` },
        }
      );
      if (res.status === 200) {
        toast.success("Commented Successfully");
        setComment("");
        setIsCommentChanged(!isCommentChanged);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
  };

  // Delete Post
  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        basePath + urls.post.delete.replace(":id", props.post._id),
        { headers: { authorization: `Bearer ${session.token}` } }
      );
      if (res.status === 200) {
        toast.success("Post Deleted Successfully");
        if (props.postMutate) props.postMutate();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  // Styles
  const cardStyle = {
    backgroundColor: '#1B2730',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: isDashboardAdmin ? '1rem auto' : '1rem 0',
    width: isDashboardAdmin && window.innerWidth > 1000 ? "768px" : "auto",
    border: '1px solid #27272A',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const userProfileStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0.5rem',
    borderBottom: '1px solid #27272A',
  };

  const profileImageStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '1rem',
    border: '2px solid #3B82F6',
  };

  const userInfoStyle = {
    flex: 1,
  };

  const userNameStyle = {
    color: '#E4E4E7',
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
  };

  const userBioStyle = {
    color: '#A1A1AA',
    fontSize: '0.9rem',
    margin: '0.25rem 0 0 0',
  };

  const captionStyle = {
    color: '#E4E4E7',
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: '1rem 0',
    padding: '0 0.5rem',
    wordBreak: 'break-word',
  };

  const actionBarStyle = {
    borderTop: '1px solid #27272A',
    marginTop: '1rem',
    padding: '1rem 0.5rem',
  };

  const actionButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#A1A1AA',
    fontSize: '0.95rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
  };

  const modalStyle = {
    backgroundColor: '#18181B',
    color: '#E4E4E7',
  };

  const modalHeaderStyle = {
    borderBottom: '1px solid #27272A',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const modalBodyStyle = {
    padding: '1rem',
  };

  const commentFormStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  };

  const commentInputStyle = {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #27272A',
    backgroundColor: '#27272A',
    color: '#E4E4E7',
    fontSize: '0.95rem',
    outline: 'none',
  };

  const commentButtonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#3B82F6',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const commentListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const commentItemStyle = {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#27272A',
  };

  return (
    <div style={cardStyle}>
      {/* User Profile Section */}
      <div style={userProfileStyle}>
        <img
          style={profileImageStyle}
          src={
            props.post.user?.profilePhoto
              ? serverPath + props.post.user.profilePhoto
              : tempImage
          }
          alt="Profile"
        />
        <div style={userInfoStyle}>
          <h5 style={userNameStyle}>
            {`${props.post.user?.name?.first} ${props.post.user?.name?.last}`}
          </h5>
          <p style={userBioStyle}>{props.post.user?.bio}</p>
        </div>
        {props.delete && (
          <IconButton 
            onClick={deleteHandler}
            style={{ padding: '8px' }}
          >
            <DeleteIcon sx={{ color: "#E74C3C", fontSize: "2rem" }} />
          </IconButton>
        )}
        {!isDashboardAdmin && !props.delete && (
          <ReportPostButton post={props.post._id} />
        )}
      </div>

      {/* Post Content */}
      <div style={captionStyle}>
        <p style={{ margin: 0 }}>{props.post.content?.text}</p>
      </div>
      {props.post.content.media.length > 0 && (
        <PostCarousel images={props.post.content.media} />
      )}

      {/* Like & Comment Actions */}
      {!isDashboardAdmin && (
        <div style={actionBarStyle}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              style={actionButtonStyle} 
              onClick={likeHandler}
              onMouseOver={(e) => e.currentTarget.style.color = '#3B82F6'}
              onMouseOut={(e) => e.currentTarget.style.color = '#A1A1AA'}
            >
              <i
                className={`fa-${
                  likeInteract.some((like) => like.user._id === session.user)
                    ? "solid"
                    : "regular"
                } fa-thumbs-up`}
                style={{ fontSize: '1.2rem' }}
              ></i>
              Like ({likeInteract.length})
            </button>
            <Link
              to="#"
              style={actionButtonStyle}
              data-bs-toggle="modal"
              data-bs-target={`#commentModal${props.post._id}`}
              onMouseOver={(e) => e.currentTarget.style.color = '#3B82F6'}
              onMouseOut={(e) => e.currentTarget.style.color = '#A1A1AA'}
            >
              <i className="fa-regular fa-comment" style={{ fontSize: '1.2rem' }}></i>
              Comment ({commentInteract.length})
            </Link>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      <div
        className="modal fade"
        id={`commentModal${props.post._id}`}
        tabIndex={-1}
        aria-hidden="true"
        style={{marginTop:"3rem"}}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content" style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h5 style={{ margin: 0 }}>Comments ({commentInteract.length})</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ filter: 'invert(1)' }}
              ></button>
            </div>
            <div style={modalBodyStyle}>
              <form onSubmit={commentHandler} style={commentFormStyle}>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                  style={commentInputStyle}
                />
                <button 
                  type="submit" 
                  style={commentButtonStyle}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                >
                  Post
                </button>
              </form>
              <div style={commentListStyle}>
                {commentInteract.map((comment, index) => (
                  <div key={index} style={commentItemStyle}>
                    <h6 style={{ color: '#E4E4E7', marginBottom: '0.5rem', fontWeight: '600' }}>
                      {`${comment.user?.name?.first} ${comment.user?.name?.last}`}
                    </h6>
                    <p style={{ color: '#A1A1AA', margin: 0 }}>{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;