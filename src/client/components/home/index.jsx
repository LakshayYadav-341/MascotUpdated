import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@client/components/ui/card";
import { Button } from "@client/components/ui/button";
import { Alert, AlertDescription } from "@client/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@client/components/ui/avatar";
import { ScrollArea } from "@client/components/ui/scroll-area";

import profile from "@client/assets/images/profile.png";
import urls, { basePath, serverPath } from "@utils/urls";
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
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading user data.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto h-[90vh]">
      <div className="flex flex-col lg:flex-row gap-5 px-5 h-full">
        {/* Left Profile Container */}
        <div className="lg:w-1/4 flex-shrink-0 h-full">
          <div>
            <Card className="mb-3">
              <CardContent className="pt-6">
                <Avatar className="w-24 h-24 mx-auto mb-3">
                  <AvatarImage
                    src={tempUser.data.profilePhoto ? serverPath + tempUser.data.profilePhoto : profile}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {tempUser.data.name?.first?.[0]}
                    {tempUser.data.name?.last?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h5 className="text-center font-semibold text-lg">
                  {tempUser.data.name?.first} {tempUser.data.name?.last}{" "}
                  <span className="capitalize">{tempUser.data?.role || ""}</span>
                </h5>
                <p className="text-center text-gray-600 mt-2">{tempUser.data.bio || ""}</p>
                <div className="flex justify-center items-center gap-2 my-3">
                  <span className="font-bold">
                    {connectedUser?.data ? (typeof connectedUser.data === "string" ? 0 : connectedUser.data.length) : 0}
                  </span>
                  <span className="text-sm">Connections</span>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/profile/${tempUser.data._id}`}>My Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connect with more people</CardTitle>
              </CardHeader>
              <CardContent>
                {suggestIsLoading && <Loading />}
                {Array.isArray(suggestedUser?.data) && suggestedUser.data.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedUser.data.slice(0, 3).map((eachUser) => (
                      <SuggestedUser user={eachUser} key={eachUser._id} suggestMutate={suggestMutate} />
                    ))}
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/network">Show More</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600">No Suggestions</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Middle Container */}
        <div
          className="w-auto lg:w-1/2 h-full overflow-y-auto"
          style={{
            msOverflowStyle: "none", // For Internet Explorer and Edge
            scrollbarWidth: "none", // For Firefox
          }}
        >
          <ScrollArea>
            <PostOptions isPostChanged={isPostChanged} setIsPostChanged={setIsPostChanged} />
            {fetchError ? (
              <Alert variant="destructive">
                <AlertDescription>{fetchError}</AlertDescription>
              </Alert>
            ) : tempPosts?.length > 0 ? (
              <div className="space-y-4">
                {tempPosts.reverse().map((eachPost) => (
                  <PostCard key={eachPost._id} post={eachPost} delete={eachPost?.user._id === session?.user} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-xl mt-5">No Posts Available</p>
            )}
          </ScrollArea>
        </div>
        
        {/* Right Container */}
        <div className="lg:w-1/4 flex-shrink-0 h-full">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Mascot News</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(newsData?.data) && newsData.data.length > 0 ? (
                  <div className="space-y-2">
                    {newsData.data.map((eachNews, index) => (
                      <div key={index} className="bg-secondary p-4 rounded-lg">
                        <h5 className="font-semibold">{eachNews.title}</h5>
                        <p className="text-sm text-gray-400">{eachNews.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No News Added Yet</p>
                )}
              </CardContent>
              <CardFooter>
                <Footer />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>

  );
};

export default HomeComponent;
