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

    const clickHandler = async () => {
        if (isLoading) return
        
        setIsLoading(true)
        try {
            const data = new FormData()
            data.append("to", props.user?._id)
            data.append("type", "Mutual")
            
            const res = await axios.post(sendRequestUrl, data, {
                headers: {
                    authorization: `Bearer ${session.token}`,
                    "Content-Type": 'multipart/form-data',
                }
            })
            
            if (res?.status === 200) {
                toast.success("Sent Request Successfully")
                // Execute mutations sequentially to ensure proper order
                if (props.suggestMutate) {
                    await props.suggestMutate()
                }
                if (props.requestMutate) {
                    await props.requestMutate()
                }
            } else {
                toast.error("Something went wrong!!")
            }
        } catch (error) {
            console.error('Connection error:', error)
            toast.error("Failed to send request")
        } finally {
            // Add a slight delay to ensure UI updates are complete
            setTimeout(() => {
                setIsLoading(false)
            }, 300)
        }
    }

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-between w-[14rem]">
            <div className="w-full">
                <Link to={`/profile/${props.user?._id}`} className="block">
                    <div className="flex flex-col items-center">
                        <img
                            src={props?.user?.profilePhoto ? (serverPath + props.user?.profilePhoto) : tempImage}
                            alt="profileImg"
                            className="w-24 h-24 rounded-full object-cover mb-4"
                        />
                        <h3 className="text-lg font-bold text-gray-300 mb-1">{props.user?.name.first} {props.user?.name.last}</h3>
                        <p className="text-gray-400 mb-4">{props.user?.bio}</p>
                    </div>
                </Link>
            </div>
            <button
                className={`bg-blue-500 hover:bg-blue-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type='button'
                onClick={clickHandler}
                disabled={isLoading}
            >
                <i className="fa-solid fa-user-plus mr-2"></i>
                {isLoading ? 'Connecting...' : 'Connect'}
            </button>
        </div>
    )
}

export default SuggestedUserCard