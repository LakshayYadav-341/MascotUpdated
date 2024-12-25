import Loading from "@client/components/loading";
import urls, { basePath } from "@utils/urls";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetter } from "../../hooks/fetcher";
import { selectSession } from "../auth/authSlice";
import ConnectedUser from "../cards/ConnectedUser";
import RequestedUser from "../cards/RequestedUser";
import SuggestedUserCard from "../cards/SuggestedUserCard";
import axios from "axios";

const NetworkComponent = () => {
  const session = useSelector(selectSession);
  const connectionsUrl =
    basePath + urls.connections.getByUser.replace(":user", session?.user);
  const suggestUrl = basePath + urls.user.suggestedUser.get;
  const requestUrl = basePath + urls.request.from;
  const {
    data: connectedUser,
    mutate: connectionMutate,
    isLoading: connectionIsLoading,
  } = useGetter(connectionsUrl);
  const {
    data: connectionRequests,
    mutate: requestMutate,
    isLoading: requestIsLoading,
  } = useGetter(requestUrl);
  const {
    data: suggestedUser,
    mutate: suggestMutate,
    isLoading: suggestIsLoading,
  } = useGetter(suggestUrl);
  return (
    <>
      <main className="networkContainer">
        <div className="leftNetworkContent content">
          <div className="card">
            <h5>Manage my network</h5>
            <Link to="/network" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-solid fa-user-group"></i>
                  <p>Connections</p>
                </div>
                <div>{connectedUser?.data.length}</div>
              </div>
            </Link>
            <Link to="/contacts" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-regular fa-address-book"></i>
                  <p>Contacts</p>
                </div>
                <div>17</div>
              </div>
            </Link>
            <Link to="/following-followers" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-solid fa-user"></i>
                  <p>Following & Followers</p>
                </div>
                <div>72</div>
              </div>
            </Link>
            <Link to="/groups" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-solid fa-users"></i>
                  <p>Groups</p>
                </div>
                <div>12</div>
              </div>
            </Link>
            <Link to="/events" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-regular fa-calendar-days"></i>
                  <p>Events</p>
                </div>
                <div>5</div>
              </div>
            </Link>
            <Link to="/pages" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-solid fa-floppy-disk"></i>
                  <p>Pages</p>
                </div>
                <div>128</div>
              </div>
            </Link>
            <Link to="/newsletters" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-regular fa-newspaper"></i>
                  <p>Newsletters</p>
                </div>
                <div>23</div>
              </div>
            </Link>
            <Link to="/hashtags" className="network-link">
              <div className="networkCommunity">
                <div className="networkSummary">
                  <i className="fa-regular fa-hashtag"></i>
                  <p>Hashtags</p>
                </div>
                <div>55</div>
              </div>
            </Link>
          </div>
        </div>
        <div className="centerNetworkContainer content">
          <div className="card">
            <div className="networkHead">
              <h5>Connection Requests</h5>
            </div>
            {!requestIsLoading &&
              (connectionRequests?.data?.length > 0 ? (
                connectionRequests?.data?.map((cr, i) => (
                  <RequestedUser
                    suggestMutate={suggestMutate}
                    connectionMutate={connectionMutate}
                    requestMutate={requestMutate}
                    user={cr.from}
                    key={i}
                    cr={cr}
                  />
                ))
              ) : (
                <h5 style={{ marginTop: "1%" }}>No Requests found!!</h5>
              ))}
            {requestIsLoading && (
              <Loading style={{ padding: "1rem", height: "none" }} />
            )}
          </div>
          <div className="card">
            <div className="networkHead">
              <h5>Suggestions for you</h5>
            </div>
            <div className="suggestedConnection">
              {suggestIsLoading && (
                <Loading style={{ padding: "1rem", height: "none" }} />
              )}
              {!suggestIsLoading &&
                (suggestedUser?.data?.length > 0 ? (
                  suggestedUser?.data?.map((eachUser) => {
                    return (
                      <SuggestedUserCard
                        user={eachUser}
                        key={eachUser._id}
                        suggestMutate={suggestMutate}
                        requestMutate={requestMutate}
                      />
                    );
                  })
                ) : (
                  <h5>No Suggestions</h5>
                ))}
            </div>
          </div>
        </div>
        <div className="rightNetworkContainer content">
          <div className="card left-group">
            <div className="networkHead">
              <h5>Your connections</h5>
            </div>
            {connectionIsLoading && (
              <Loading style={{ padding: "1rem", height: "none" }} />
            )}
            {!connectionIsLoading &&
              (connectedUser?.data?.length > 0 ? (
                connectedUser?.data?.map((eachUser) => {
                  return (
                    <ConnectedUser
                      user={eachUser.users[0]}
                      key={eachUser.users[0]._id}
                    />
                  );
                })
              ) : (
                <h5>No Connections Yet</h5>
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default NetworkComponent;
