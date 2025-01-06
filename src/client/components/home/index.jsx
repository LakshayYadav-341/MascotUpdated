import React, { useEffect, useState, useCallback } from "react";
import profile from "@client/assets/images/profile.png";
import urls, { basePath } from "@utils/urls";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { serverPath } from "../../../utils/urls";
import { selectSession } from "../auth/authSlice";
import Footer from "../footer";
import Loading from "../loading";
import PostCard from "../posts/PostCard";
import PostOptions from "../posts/PostOptions";
import { useGetter } from "../../hooks/fetcher";
import SuggestedUser from "../cards/SuggestedUser";

const HomeComponent = () => {
  const session = useSelector(selectSession);
  const suggestUrl = basePath + urls.user.suggestedUser.get;
  const newsGetUrl = basePath + urls.news.find;
  const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", session?.user);
  const profileUrl = basePath + urls.user.profile.get.replace(":id", session?.user);

  const [tempPosts, setTempPosts] = useState([]);
  const [isPostChanged, setIsPostChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const { data: tempUser, isLoading: tempUserLoading } = useGetter(profileUrl);
  const { data: newsData, isLoading: newsLoading } = useGetter(newsGetUrl);
  const { data: connectedUser, isLoading: connectionIsLoading } = useGetter(connectionsUrl);
  const { data: suggestedUser, isLoading: suggestIsLoading, mutate: suggestMutate } = useGetter(suggestUrl);

  const NAVBAR_HEIGHT = '64px';

  const scrollableStyle = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    overflowY: 'auto'
  };

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const res = await axios.get(basePath + urls.posts.all, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${session.token}`,
        },
      });
      setTempPosts(res.data.data || []);
    } catch (error) {
      console.error("Error while fetching posts:", error);
      setFetchError("Failed to load posts");
      setTempPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, isPostChanged]);

  if (isLoading || tempUserLoading || connectionIsLoading || newsLoading || suggestIsLoading) {
    return <Loading />;
  }

  if (!tempUser?.data) {
    return <div className="alert alert-danger">Error loading user data.</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row mt-5 mx-5" style={{ minHeight: '90vh' }}>
        {/* Left Profile Container */}
        <div className="col-3" style={{position: 'fixed', 
          left: 30, 
          top: NAVBAR_HEIGHT, 
          bottom: 0, 
          overflowY: 'auto', 
          paddingTop: '20px'  }}>
          <div className="card mb-3">
            <div className="card-body">
              <img
                src={tempUser.data.profilePhoto ? serverPath + tempUser.data.profilePhoto : profile}
                alt="Profile"
                className="rounded-circle mx-auto d-block mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h5 className="card-title text-center">
                {tempUser.data.name?.first} {tempUser.data.name?.last}{" "}
                <span className="text-capitalize">
                  {tempUser.data && Object.keys(tempUser.data).includes("admin") ? "Admin" : tempUser.data.role || ""}
                </span>
              </h5>
              <p className="card-text text-center">{tempUser.data.bio || ""}</p>
              <div className="text-center mb-3 d-flex justify-content-center align-items-center">
                <strong>{connectedUser?.data ? (typeof connectedUser.data === "string" ? 0 : connectedUser.data.length) : 0}</strong>
                <small className="d-block ms-2">Connections</small>
              </div>
              <Link to={`/profile/${tempUser.data._id}`} className="btn btn-primary w-100">My Profile</Link>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Connect with more people</h5>
              {suggestIsLoading && <Loading />}
              {Array.isArray(suggestedUser?.data) && suggestedUser.data.length > 0 ? (
                <>
                  {suggestedUser.data.slice(0, 3).map((eachUser) => (
                    <SuggestedUser user={eachUser} key={eachUser._id} suggestMutate={suggestMutate} />
                  ))}
                  <Link to="/network" className="btn btn-outline-primary w-100 mt-3">Show More</Link>
                </>
              ) : (
                <p className="card-text">No Suggestions</p>
              )}
            </div>
          </div>
        </div>

        {/* Middle Container */}
        <div className="col-6 offset-3" style={{
          ...scrollableStyle,
          height: `calc(100vh - ${NAVBAR_HEIGHT})`,
          paddingTop: '20px'
        }}>
          <PostOptions isPostChanged={isPostChanged} setIsPostChanged={setIsPostChanged} />
          {fetchError ? (
            <div className="alert alert-danger">{fetchError}</div>
          ) : tempPosts?.length > 0 ? (
            tempPosts.reverse().map((eachPost) => (
              <PostCard key={eachPost._id} post={eachPost} delete={eachPost?.user._id == session?.user} />
            ))
          ) : (
            <h3 className="text-center text-muted mt-5">No Posts Available</h3>
          )}
        </div>

        {/* Right Container */}
        <div className="col-3" style={{
          position: 'fixed',
          right: 30,
          top: NAVBAR_HEIGHT,
          bottom: 0,
          overflowY: 'auto',
          paddingTop: '20px'
        }}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Mascot News</h5>
              {Array.isArray(newsData?.data) && newsData.data.length > 0 ? (
                <ul className="list-group">
                  {newsData.data.map((eachNews, index) => (
                    <li key={index} className="list-group-item bg-dark text-white mt-2">
                      <h5>{eachNews.title}</h5>
                      <small className="text-muted">{eachNews.description}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="card-text text-white">No News Added Yet</p>
              )}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;