import { useState } from "react";
import { Link } from "react-router-dom";
import urls, { basePath } from "../../../utils/urls";
import { usePoster } from "../../hooks/fetcher";
import { toast } from "react-toastify";
import { Newspaper } from "lucide-react";
``
const ReportPostButton = ({ post }) => {
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const reportUrl = basePath + urls.reportedPost.create;
  const { trigger: reportPost } = usePoster(reportUrl);

  const clickHandler = async () => {
    try {
      const res = await reportPost({
        post: post,
        reason: reason,
      });

      if (res?.status === "success") {
        toast.success("Reported Post Successfully");
        setIsOpen(false);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error while reporting post:", error);
      toast.error("Failed to report post. Please try again later.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-gray-300 hover:text-gray-300 transition-colors"
      >
        <Newspaper className="w-4 h-4" />
        <span>Report</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-md">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-gray-300">
                    Report Content
                  </h3>
                  <p className="text-sm text-gray-400">
                    Reason of Report
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4">
                <textarea
                  className="w-full h-32 px-3 py-2 text-gray-300 bg-gray-800 rounded-lg 
                           border border-gray-700 focus:border-blue-500 focus:ring-1 
                           focus:ring-blue-500 outline-none transition-colors"
                  placeholder="Please describe your reason for reporting..."
                  onChange={(e) => setReason(e.target.value)}
                  value={reason}
                />

                <button
                  onClick={clickHandler}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-gray-300 font-medium 
                           py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportPostButton;