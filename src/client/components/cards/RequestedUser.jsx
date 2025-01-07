import urls, { basePath, serverPath } from '@utils/urls'
import axios from 'axios'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectSession } from '../auth/authSlice'
import tempImage from "@client/assets/images/profile.png"
import { toast } from 'react-toastify'

const RequestedUser = (props) => {
    const acceptRequestUrl = basePath + urls.request.acceptMutual.replace(':request', props.cr?._id)
    const ignoreRequestUrl = basePath + urls.request.ignore.replace(':request', props.cr?._id)
    const session = useSelector(selectSession)

    const clickHandler = async () => {
        const res = await axios.put(acceptRequestUrl, {}, {
            headers: { authorization: `Bearer ${session.token}` }
        })
        if(res?.status === 200) {
            toast.success("Request accepted Successfully")
            props.connectionMutate()
            props.requestMutate()
        } else {
            toast.error("Something went wrong!!")
        }
    }

    const ignoreHandler = async () => {
        try {
            const res = await axios.delete(ignoreRequestUrl, {
                headers: { authorization: `Bearer ${session.token}` }
            });
            if(res?.status === 200) {
                toast.error("Ignored Request Successfully")
                props.requestMutate();
                props.suggestMutate();
            } else {
                toast.error("Something went wrong!!")
            }
        } catch (error) {
            console.error("Error deleting connection request:", error);
        }
    };
    
    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link to={`/profile/${props.user?._id}`}>
                <div className="flex items-center space-x-4">
                    <img
                        src={props?.user?.profilePhoto ? serverPath + props.user?.profilePhoto : tempImage}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                        <h5 className="text-gray-100 font-medium truncate">
                            {props.user?.name.first} {props.user?.name.last}
                        </h5>
                        <p className="text-gray-400 text-sm truncate">{props.user?.bio}</p>
                    </div>
                </div>
            </Link>
            <div className="flex justify-end space-x-3 mt-4">
                <button 
                    onClick={ignoreHandler}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                    type="button"
                >
                    Ignore
                </button>
                <button 
                    onClick={clickHandler}
                    className="px-4 py-2 bg-blue-600 text-gray-300 rounded hover:bg-blue-500 transition-colors"
                    type="button"
                >
                    Accept
                </button>
            </div>
        </div>
    )
}

export default RequestedUser