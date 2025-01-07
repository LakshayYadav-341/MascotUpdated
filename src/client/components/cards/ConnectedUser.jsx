import React from 'react'
import { Link } from 'react-router-dom'
import { basePath, serverPath } from '@utils/urls'
import tempImage from "@client/assets/images/profile.png"

const ConnectedUser = (props) => {
    return (
        <Link to={`/profile/${props.user?._id}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-700 transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <img 
                        src={props.user?.profilePhoto ? serverPath + props.user?.profilePhoto : tempImage} 
                        alt="Profile" 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <strong className="text-sm sm:text-base text-gray-100 font-medium block truncate">
                            {props.user?.name.first} {props.user?.name.last}
                        </strong>
                        <small className="text-xs sm:text-sm text-gray-400 block truncate">
                            {props.user?.bio}
                        </small>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ConnectedUser