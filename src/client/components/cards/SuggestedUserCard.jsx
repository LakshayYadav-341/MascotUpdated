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
        <>
            <div className="card profileCard suggestedCard" key={props.user?._id}>
                <div className="cover"></div>
                <Link to={`/profile/${props.user?._id}`} style={{ zIndex: "2" }}>
                    <div className="profileInfo">
                        <img
                            src={props?.user?.profilePhoto ? (serverPath + props.user?.profilePhoto) : tempImage}
                            alt="profileImg"
                            className="profileImg"
                        />
                        <strong className="userName">{props.user?.name.first} {props.user?.name.last}</strong>
                        <small className="userProfession">{props.user?.bio}</small>
                    </div>
                </Link>
                <div>
                    <button 
                        className={`text-button ${isLoading ? 'disabled' : ''}`}
                        type='button' 
                        onClick={clickHandler}
                        disabled={isLoading}
                    >
                        <i className="fa-solid fa-user-plus"></i>
                        {isLoading ? ' Connecting...' : ' Connect'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default SuggestedUserCard