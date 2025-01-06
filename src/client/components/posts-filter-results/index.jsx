import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { basePath } from "../../../utils/urls";
import urls from "../../../utils/urls";
import axios from "axios";
import Loading from "../loading";
import PostCard from "../posts/PostCard";
import { useSelector } from "react-redux";
import { selectSession } from "../auth/authSlice";

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1.25rem',
    backgroundColor: 'transparent',
    minHeight: '100vh',
    color: '#E4E4E7',
  },
  header: {
    marginBottom: '2.5rem',
    textAlign: 'center',
    borderBottom: '1px solid #27272A',
    paddingBottom: '1.5rem',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#FAFAFA',
    marginBottom: '0.5rem',
  },
  headerSubtitle: {
    fontSize: '2rem',
    color: '#A1A1AA',
    fontWeight: '600',
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    color: '#FCA5A5',
    fontSize: '1.1rem',
    margin: '2rem 0',
    border: '1px solid #B91C1C',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    color: '#A1A1AA',
    fontSize: '1.2rem',
    margin: '2rem 0',
    border: '2px dashed #27272A',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    backgroundColor: 'transparent',
  },
  tryAgainButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#DC2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
};

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
      <div style={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>User Posts</h1>
        <p style={styles.headerSubtitle}>
          {tempPosts.length} {tempPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>

      {fetchError ? (
        <div style={styles.error}>
          <p>{fetchError}</p>
          <button
            onClick={fetchUserPosts}
            style={styles.tryAgainButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#B91C1C')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#DC2626')}
          >
            Try Again
          </button>
        </div>
      ) : tempPosts.length > 0 ? (
        <div style={styles.postsContainer}>
          {tempPosts.reverse().map((eachPost) => (
            <div key={eachPost._id} style={styles.postCardWrapper}>
              <PostCard
                post={eachPost}
                delete={eachPost?.user._id === session?.user}
                postMutate={() => setIsPostChanged(!isPostChanged)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <h3 style={{ color: '#FAFAFA' }}>No Posts Available</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#A1A1AA' }}>
            This user hasn't created any posts yet.
          </p>
        </div>
      )}
    </div>
  );
}
