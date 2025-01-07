import React, { useState } from "react";
import { useSelector } from "react-redux";
import urls, { basePath, serverPath } from "@utils/urls";
import tempImage from "@client/assets/images/profile.png";
import { useGetter } from "../../hooks/fetcher";
import { selectSession } from "../auth/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import PostCard from "./PostCard";

const ReportedPost = () => {
  const [reportData, updateReportData] = useState(null);
  const [post, setPost] = useState(null);
  const [showPost, setShowPost] = useState(false);

  const { data: reportedPostData, mutate: reportedPostMutate } = useGetter(
    basePath + urls.reportedPost.getAll
  );

  const session = useSelector(selectSession);

  const ignoreHandler = async (report) => {
    try {
      const res = await axios.delete(
        basePath +
        urls.reportedPost.deleteById.replace(":id", report?.post?._id),
        {
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (res?.status === 200) {
        reportedPostMutate();
        toast.success("Ignored Reported Post Successfully");
      } else {
        toast.error("Something went wrong!!");
      }
    } catch (error) {
      console.error("Error ignoring reported post:", error);
      toast.error("An error occurred while ignoring reported post");
    }
  };

  const removeHandler = async (report) => {
    try {
      const res1 = await axios.delete(
        basePath + urls.post.delete.replace(":id", report?.post?._id),
        {
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        }
      );

      const res2 = await axios.delete(
        basePath +
        urls.reportedPost.deleteById.replace(":id", report?.post?._id),
        {
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (res1?.status === 200 && res2?.status === 200) {
        reportedPostMutate();
        toast.success("Removed Post Successfully");
      } else {
        toast.error("Something went wrong!!");
      }
    } catch (error) {
      console.error("Error removing reported post:", error);
      toast.error("An error occurred while removing reported post");
    }
  };

  const uniquePosts = reportedPostData?.data?.reduce((unique, report) => {
    const existing = unique.find((item) => item.post?._id === report.post?._id);
    if (!existing) {
      unique.push(report);
    }
    return unique;
  }, []);

  const showReportingUsers = async (post) => {
    try {
      const res = await axios.get(
        basePath + urls.reportedPost.getByPostId.replace(":post", post),
        {
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (res?.status === 200) {
        updateReportData(res.data);
      } else {
        toast.error("Failed to fetch reporting users");
      }
    } catch (error) {
      console.error("Error fetching reporting users:", error);
      toast.error("An error occurred while fetching reporting users");
    }
  };

  const showReportedPost = async (postId) => {
    console.log(postId);
    try {
      const res = await axios.get(
        basePath + urls.posts.getByPostId.replace(":id", postId),
        {
          headers: {
            authorization: `Bearer ${session.token}`
          }
        }
      );

      if (res?.status === 200) {
        setPost(res.data.data);
        setShowPost(true);
      } else {
        toast.error("Failed to fetch reported post");
      }
    } catch (error) {
      console.error("Error fetching reported post:", error);
      toast.error("An error occurred while fetching reported post");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="hidden lg:block lg:w-1/12"></div>
          <div className="flex-1 p-4 bg-gray-800 rounded-lg">
            <section>
              <div className="mb-4">
                <h1 className="text-gray-300 text-3xl font-bold">Reported Posts</h1>
              </div>
              <section className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-400">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2">SNo.</th>
                        <th className="px-4 py-2">Post ID</th>
                        <th className="px-4 py-2">Reports</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniquePosts?.length > 0 ? (
                        uniquePosts.map((report, id) => (
                          <tr key={id} className="border-b border-gray-700">
                            <td className="px-4 py-2">{id + 1}</td>
                            <td className="px-4 py-2">
                              <button
                                className="text-blue-400 hover:underline"
                                onClick={() => showReportedPost(report?.post?._id)}
                              >
                                {report?.post?._id}
                              </button>
                            </td>
                            <td className="px-4 py-2">
                              <button
                                className="text-blue-400 hover:underline"
                                onClick={() => showReportingUsers(report?.post?._id)}
                              >
                                View Reporters
                              </button>
                            </td>
                            <td className="px-4 py-2 flex space-x-2">
                              <button
                                className="bg-gray-500 text-gray-300 px-3 py-1 rounded hover:bg-gray-600"
                                onClick={() => ignoreHandler(report)}
                              >
                                Ignore
                              </button>
                              <button
                                className="bg-red-600 text-gray-300 px-3 py-1 rounded hover:bg-red-700"
                                onClick={() => removeHandler(report)}
                              >
                                Delete Post
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-2 text-center">
                            <h3 className="text-gray-400">No Reported Posts Found!</h3>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          </div>
        </div>
      </div>

      {/* Modals */}
      {uniquePosts?.map((report, id) => (
        <div
          key={id}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-gray-800 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h5 className="text-gray-300 font-semibold">Reports by Users</h5>
              <button
                className="text-gray-300 hover:text-gray-400"
                onClick={() => updateReportData(null)}
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {reportData &&
                reportData.data?.map((report, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <img
                      src={
                        report?.by?.profilePhoto
                          ? serverPath + report?.by.profilePhoto
                          : tempImage
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-1 bg-gray-700 p-2 rounded-lg text-gray-300">
                      <h5>{report?.by?.name?.first} {report?.by?.name?.last}</h5>
                      <p className="text-sm mt-1">{report?.reason}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h4 className="text-gray-300 font-semibold">Reported Post</h4>
            <button
              className="text-gray-300 hover:text-gray-400"
              onClick={() => {
                setShowPost(false);
                setPost(null);
              }}
            >
              ×
            </button>
          </div>
          <div className="p-4">
            {showPost && <PostCard report={true} post={post} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportedPost;
