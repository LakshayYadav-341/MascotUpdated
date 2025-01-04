import profile from "@client/assets/images/profile.png";
import urls, { basePath } from "@utils/urls";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { serverPath } from "../../../utils/urls";
import { selectSession } from "../auth/authSlice";
import Footer from "../footer";
import Loading from "../loading";
import PostCard from "../posts/PostCard";
import PostOptions from "../posts/PostOptions";
import "./styles.scss";
import { useGetter } from "../../hooks/fetcher";
import SuggestedUser from "../cards/SuggestedUser";

const HomeComponent = ({ role, user, connection, users, posts }) => {
  const session = useSelector(selectSession);
  const suggestUrl = basePath + urls.user.suggestedUser.get;
  const newsGetUrl = basePath + urls.news.find;
  const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", session?.user);

  const [tempPosts, setTempPosts] = useState([]);
  const [isPostChanged, setIsPostChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const profileUrl = basePath + urls.user.profile.get.replace(":id", session?.user);
  const { data: tempUser, isLoading: tempUserLoading } = useGetter(profileUrl);
  const { data: newsData, isLoading: newsLoading } = useGetter(newsGetUrl);
  const { data: connectedUser, isLoading: connectionIsLoading } = useGetter(connectionsUrl);
  const { data: suggestedUser, isLoading: suggestIsLoading } = useGetter(suggestUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(basePath + urls.posts.all, {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${session.token}`,
          },
        });
        setTempPosts(res.data.data || []);
      } catch (error) {
        console.error("Error while fetching posts:", error);
        setTempPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isPostChanged, session.token]);

  if (isLoading || tempUserLoading || connectionIsLoading || newsLoading || suggestIsLoading) {
    return <Loading />;
  }

  if (!tempUser?.data) {
    return <div>Error loading user data.</div>;
  }

  return (
    <main className="mainContainer">
      {/* Left Profile Container */}
      <div className="left-content content">
        <div className="card profileCard">
          <div className="cover"></div>
          <div className="profileInfo">
            <img
              src={tempUser.data.profilePhoto ? serverPath + tempUser.data.profilePhoto : profile}
              alt="profileImg"
              className="profileImg"
            />
            <strong className="userName">
              {tempUser.data.name?.first} {tempUser.data.name?.last}{" "}
              <span style={{ textTransform: "capitalize" }}>
                {tempUser.data && Object.keys(tempUser.data).includes("admin") ? "Admin" : tempUser.data.role || ""}
              </span>
            </strong>
            <small className="userProfession">{tempUser.data.bio || ""}</small>
          </div>
          <div className="connection">
            <strong>{connectedUser?.data ? (typeof connectedUser.data === "string" ? 0 : connectedUser.data.length) : 0}</strong>
            <small>Connections</small>
          </div>
          <div className="specialLink">
            <Link to={`/profile/${tempUser.data._id}`}>My Profile</Link>
          </div>
        </div>

        {/* Left Connect Container */}
        <div className="card left-group">
          <h5>Connect with more people.....</h5>
          {suggestIsLoading && <Loading style={{ padding: "1rem", height: "none" }} />}
          {Array.isArray(suggestedUser?.data) && suggestedUser.data.length > 0 ? (
            <>
              {suggestedUser.data.map((eachUser) => (
                <SuggestedUser user={eachUser} key={eachUser._id} />
              ))}
              <div className="specialLink">
                <Link to="/network">Show More</Link>
              </div>
            </>
          ) : (
            <h5>No Suggestions</h5>
          )}
        </div>
      </div>

      {/* Middle Container */}
      <div className="center-content content">
        <PostOptions isPostChanged={isPostChanged} setIsPostChanged={setIsPostChanged} />
        {tempPosts?.length > 0 ? (
          tempPosts.reverse().map((eachPost) => <PostCard key={eachPost._id} post={eachPost} />)
        ) : (
          <h5>No Posts Available</h5>
        )}
      </div>

      {/* Right Container */}
      <div className="right-content content">
        <div className="card">
          <h5>Mascot News</h5>
          <ul className="newsSection list-group">
            {Array.isArray(newsData?.data) && newsData.data.length > 0 ? (
              newsData.data.map((eachNews, index) => (
                <li
                  className="list-group-item mt-2"
                  style={{ backgroundColor: "#1b2730", borderTopWidth: "1px" }}
                  key={index}
                >
                  <div style={{ fontSize: "1.1rem", cursor: "pointer" }}>
                    <h5 style={{ color: "white" }}>{eachNews.title}</h5>
                    <span style={{ color: "gray", fontSize: "0.9rem" }}>{eachNews.description}</span>
                  </div>
                </li>
              ))
            ) : (
              <h3 style={{ color: "white", padding: "0.5rem 0" }}>No News Added Yet</h3>
            )}
          </ul>
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default HomeComponent;
