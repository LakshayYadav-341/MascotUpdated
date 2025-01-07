import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectSession } from "@client/components/auth/authSlice";
import axios from "axios";
import tempImage from "@client/assets/images/profile.png";
import { toast } from "react-toastify";
import { Trash2, ThumbsUp, MessageSquare } from "lucide-react";
import ReportPostButton from "./report";
import PostCarousel from "./carousel";
import urls, { basePath, serverPath } from "@utils/urls";

const PostCard = (props) => {
  const location = useLocation();
  const isDashboardAdmin = location.pathname === "/dashboard/admin";
  const [likeInteract, setLikeInteract] = useState([]);
  const [commentInteract, setCommentInteract] = useState([]);
  const [comment, setComment] = useState("");
  const [isLikeChanged, setIsLikeChanged] = useState(false);
  const [isCommentChanged, setIsCommentChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const session = useSelector(selectSession);

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

  const likeHandler = async () => {
    try {
      await axios.put(
        likeInteractUrl,
        {},
        { headers: { authorization: `Bearer ${session.token}` } }
      );
      setIsLikeChanged(!isLikeChanged);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

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
        { headers: { authorization: `Bearer ${session.token}` } }
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

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 my-6">
      {/* User Profile Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={props.post.user?.profilePhoto ? serverPath + props.post.user.profilePhoto : tempImage}
            alt="Profile"
          />
          <div>
            <h5 className="text-gray-300 font-semibold">
              {`${props.post.user?.name?.first} ${props.post.user?.name?.last}`}
            </h5>
            <p className="text-gray-400 text-sm">{props.post.user?.bio}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {props.delete && (
            <button
              onClick={deleteHandler}
              className="p-2 text-red-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
          {!isDashboardAdmin && !props.delete && (
            <ReportPostButton post={props.post._id} />
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-300">{props.post.content?.text}</p>
      </div>
      {props.post.content.media.length > 0 && (
        <div className="mb-4">
          <PostCarousel images={props.post.content.media} />
        </div>
      )}

      {/* Like & Comment Actions */}
      {!isDashboardAdmin && (
        <div className="flex gap-4">
          <button
            onClick={likeHandler}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <ThumbsUp
              className={`w-5 h-5 ${
                likeInteract.some((like) => like.user._id === session.user)
                  ? "fill-current"
                  : ""
              }`}
            />
            <span>Like ({likeInteract.length})</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Comment ({commentInteract.length})</span>
          </button>
        </div>
      )}

      {/* Comment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h5 className="text-gray-300 font-semibold">
                Comments ({commentInteract.length})
              </h5>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <form onSubmit={commentHandler} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment"
                    className="flex-1 bg-gray-800 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-gray-300 px-4 py-2 rounded-lg transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>
              <div className="space-y-4">
                {commentInteract.map((comment, index) => (
                  <div key={index} className="border-b border-gray-800 pb-4">
                    <h6 className="text-gray-300 font-semibold mb-1">
                      {`${comment.user?.name?.first} ${comment.user?.name?.last}`}
                    </h6>
                    <p className="text-gray-400">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;