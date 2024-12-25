import Loading from "@client/components/loading";
import urls, { basePath } from "@utils/urls";
import React from "react";
import { useSelector } from "react-redux";
import { useGetter } from "../../hooks/fetcher";
import { selectSession } from "../auth/authSlice";
import ConnectedUser from "../cards/ConnectedUser";
import RequestedUser from "../cards/RequestedUser";
import SuggestedUserCard from "../cards/SuggestedUserCard";

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
        {/* Left Content */}
        <div className="leftNetworkContent content">
          <div className="card">
            <h5>Welcome to Your Network!</h5>
            <p>Discover people you may know, manage connection requests, and expand your network.</p>
            <ul>
              <li>💡 Check out connection suggestions to grow your professional circle.</li>
              <li>📬 Respond to connection requests to build meaningful relationships.</li>
              <li>🔍 Use the search feature to find specific users in your network.</li>
            </ul>
            <p>Start building your network today!</p>
          </div>
        </div>

        {/* Center Content */}
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

        {/* Right Content */}
        <div className="rightNetworkContainer content">
          <div className="card left-group">
            <div className="networkHead">
              <h5>Your connections</h5>
            </div>
            {connectionIsLoading && (
              <Loading style={{ padding: "1rem", height: "none" }} />
            )}
            {!connectionIsLoading &&
              (typeof connectedUser.data !== "string" &&
              connectedUser?.data?.length > 0 ? (
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
