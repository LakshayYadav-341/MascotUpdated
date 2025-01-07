import { basePath, serverPath } from '@utils/urls'
import axios from 'axios'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectSession } from '../auth/authSlice'
import tempImage from "@client/assets/images/profile.png"
import { toast } from 'react-toastify'

const ReportedUserCard = (props) => {
  const session = useSelector(selectSession)

  const ignoreHandler = async () => {
    const res = await axios.delete(basePath + urls.report.deleteById.replace(":id", props?.report?.user?._id), {
      headers: { authorization: `Bearer ${session.token}` }
    })
    if (res?.status === 200) {
      props.mutate()
      toast.success("Ignored Reported User Successfully")
    } else {
      toast.error("Something went wrong!!")
    }
  }

  const clickHandler = async () => {
    const res1 = await axios.delete(basePath + urls.user.delete.replace(":id", props?.report?.user?._id), {
      headers: { authorization: `Bearer ${session.token}` }
    })
    const res2 = await axios.delete(basePath + urls.report.deleteById.replace(":id", props?.report?.user?._id), {
      headers: { authorization: `Bearer ${session.token}` }
    })
    if (res1?.status === 200 && res2?.status === 200) {
      props.mutate()
      toast.success("Removed User Successfully")
    } else {
      toast.error("Something went wrong!!")
    }
  }

  return (
    <div>
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <Link to={`/profile/${props?.report?.user?._id}`}>
          <div className="flex items-start space-x-4">
            <img
              src={props?.report.user?.profilePhoto ? serverPath + props?.report.user?.profilePhoto : tempImage}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-gray-100 font-medium truncate">
                {props?.report?.user?.name?.first} {props?.report?.user?.name?.last}
              </h5>
              <p className="text-gray-400 text-sm">{props?.report?.user?.bio}</p>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-end space-x-4 mt-4">
          <button 
            className="text-blue-400 hover:text-blue-300 text-base"
            data-bs-toggle="modal"
            data-bs-target={`#commentModal${props.report?._id}`}
          >
            <i className="fa-solid fa-eye mr-2"></i>View Reporters
          </button>
          <button 
            onClick={ignoreHandler}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Ignore
          </button>
          <button 
            onClick={clickHandler}
            className="px-4 py-2 bg-red-600 text-gray-300 rounded hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div
        className="modal fade mt-5"
        id={`commentModal${props.report?._id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="bg-gray-800 rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-700">
              <h5 className="text-lg font-medium text-gray-100">Reporters</h5>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {props?.report?.by.map((rep, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <img
                      src={rep?.user?.profilePhoto ? serverPath + rep?.user.profilePhoto : tempImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 bg-gray-700 rounded-lg p-3">
                      <h6 className="text-gray-300 font-medium">
                        {rep?.user.name.first} {rep?.user.name.last}
                      </h6>
                      <p className="text-gray-400 text-sm">{rep?.user.bio}</p>
                      <p className="text-gray-300 mt-2 text-sm">{rep?.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-700">
              <button
                type="button"
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportedUserCard