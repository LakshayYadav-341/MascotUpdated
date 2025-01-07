import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import urls, { basePath, serverPath } from '@utils/urls'
import { useSelector } from 'react-redux'
import { selectSession } from '../auth/authSlice'
import axios from 'axios'
import tempImage from "@client/assets/images/profile.png"
import { toast } from 'react-toastify'

const SuggestedUserCard = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const sendRequestUrl = basePath + urls.request.create
    const session = useSelector(selectSession)

    const truncateBio = (text, maxLength = 35) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    }

    const clickHandler = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const data = new FormData();
            data.append("to", props.user?._id);
            data.append("type", "Mutual");

            const res = await axios.post(sendRequestUrl, data, {
                headers: {
                    authorization: `Bearer ${session.token}`,
                    "Content-Type": 'multipart/form-data',
                }
            });

            if (res?.status === 200) {
                toast.success("Sent Request Successfully");
                await Promise.all([
                    props.suggestMutate?.(),
                    props.requestMutate?.()
                ]).catch(() => toast.error("Changes may take a moment to reflect"));
            } else {
                toast.error("Something went wrong!!");
            }
        } catch (error) {
            console.error('Connection error:', error);
            toast.error("Failed to send request");
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 my-2 flex justify-between items-center gap-3 hover:bg-gray-700 transition-colors duration-200">
            <Link to={`/profile/${props.user?._id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    <img 
                        src={props?.user?.profilePhoto ? serverPath + props.user?.profilePhoto : tempImage} 
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
                    />
                    <div className="min-w-0">
                        <h6 className="text-gray-100 font-medium text-sm truncate">
                            {props.user?.name.first} {props.user?.name.last}
                        </h6>
                        <small className="text-gray-400 text-xs block truncate">
                            {truncateBio(props.user?.bio)}
                        </small>
                    </div>
                </div>
            </Link>
            <button
                onClick={clickHandler}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-gray-300 text-sm rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <i className="fa-solid fa-user-plus text-sm"></i>
                <span>{isLoading ? 'Connecting...' : 'Connect'}</span>
            </button>
        </div>
    )
}

export default SuggestedUserCard