import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { basePath } from "../../../utils/urls";
import urls from "../../../utils/urls";
import axios from "axios";
import Loading from "../loading";
import PostCard from "../posts/PostCard";
import { useSelector } from "react-redux";
import { selectSession } from "../auth/authSlice";

export default function PostsFilter() {
  const { title: userId } = useParams();
  const session = useSelector(selectSession);

  const [tempPosts, setTempPosts] = useState([]);
  const [isPostChanged, setIsPostChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchUserPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);

      const res = await axios.get(
        `${basePath + urls.posts.all}?user=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session.token}`,
          },
        }
      );

      const userPosts = res.data.data?.filter(post => post?.user._id === userId) || [];
      setTempPosts(userPosts);
    } catch (error) {
      console.error("Error while fetching user posts:", error);
      setFetchError("Failed to load posts. Please try again later.");
      setTempPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, session.token]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts, isPostChanged]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-300">
      <header className="mb-10 text-center border-b border-gray-700 pb-6">
        <h1 className="text-2xl font-semibold text-gray-100">User Posts</h1>
        <p className="text-lg text-gray-400">
          {tempPosts.length} {tempPosts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      {fetchError ? (
        <div className="text-center p-6 bg-gray-800 border border-red-600 rounded-lg">
          <p className="text-red-400 mb-4">{fetchError}</p>
          <button
            onClick={fetchUserPosts}
            className="px-4 py-2 bg-red-600 text-gray-300 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : tempPosts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {tempPosts.reverse().map((eachPost) => (
            <div key={eachPost._id}>
              <PostCard
                post={eachPost}
                delete={eachPost?.user._id === session?.user}
                postMutate={() => setIsPostChanged(!isPostChanged)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
          <h3 className="text-xl text-gray-100">No Posts Available</h3>
          <p className="mt-2 text-gray-400">
            This user hasn&apos;t created any posts yet.
          </p>
        </div>
      )}
    </div>
  );
}
