import Loading from "@client/components/loading";
import urls, { basePath } from "@utils/urls";
import React from "react";
import { useSelector } from "react-redux";
import { useGetter } from "../../hooks/fetcher";
import { selectSession } from "../auth/authSlice";
import ConnectedUser from "../cards/ConnectedUser";
import RequestedUser from "../cards/RequestedUser";
import SuggestedUser from "../cards/SuggestedUser";
import { ScrollArea } from "@client/components/ui/scroll-area";

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
      <main className="flex flex-col md:flex-row gap-6 p-6 bg-gray-900 text-gray-300 h-full">
        {/* Left Content */}
        <div className="md:w-1/3 bg-gray-800 rounded-lg shadow-md p-6">
          <h5 className="text-lg font-bold mb-4">Your Connections</h5>
          {connectionIsLoading && <Loading style={{ padding: "1rem", height: "none" }} />}
          {!connectionIsLoading &&
            (typeof connectedUser.data !== "string" &&
              connectedUser?.data?.length > 0 ? (
              <div
                className="h-[80vh] overflow-y-auto"
                style={{
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {connectedUser?.data?.map((eachUser) => (
                  <ConnectedUser
                    user={eachUser.users[0]}
                    key={eachUser.users[0]._id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No Connections Yet</p>
            ))}
        </div>

        {/* Center Content */}
        {/* Connection Requests */}
        <div className="md:w-1/3 bg-gray-800 rounded-lg shadow-md p-6">
          <h5 className="text-lg font-bold mb-4">Connection Requests</h5>
          <div
            className="h-[80vh] overflow-y-auto"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {requestIsLoading && <Loading style={{ padding: "1rem", height: "none" }} />}
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
                <p className="text-gray-400">No Requests found!</p>
              ))}
          </div>

        </div>

        {/* Right Content */}
        <div className="md:w-1/3 bg-gray-800 rounded-lg shadow-md p-6">
          <h5 className="text-lg font-bold mb-4">Suggestions for you</h5>
          <div
            className="h-[80vh] overflow-y-auto"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {suggestIsLoading && <Loading style={{ padding: "1rem", height: "none" }} />}
            {!suggestIsLoading &&
              (suggestedUser?.data?.length > 0 ? (
                <div className="">
                  {suggestedUser.data.slice(0, 6).map((eachUser) => (
                    <SuggestedUser user={eachUser} key={eachUser._id} suggestMutate={suggestMutate} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No Suggestions</p>
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default NetworkComponent;
