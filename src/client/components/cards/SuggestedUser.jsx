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
                // Wait for both mutations to complete before setting loading to false
                await Promise.all([
                    props.suggestMutate && props.suggestMutate(),
                    props.requestMutate && props.requestMutate()
                ]).catch(error => {
                    console.error('Mutation error:', error)
                    toast.error("Changes may take a moment to reflect")
                })
            } else {
                toast.error("Something went wrong!!")
            }
        } catch (error) {
            console.error('Connection error:', error)
            toast.error("Failed to send request")
        } finally {
            // Add a small delay before setting loading to false to ensure UI updates are complete
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }

    return (
        <>
            <div className="connectSuggestion">
                <Link to={`/profile/${props.user?._id}`}>
                    <div className="connectProfile">
                        <img src={props?.user?.profilePhoto ? serverPath + props.user?.profilePhoto : tempImage} alt="personImg" />
                        <div className="connectInfo">
                            <h6>{props.user?.name.first} {props.user?.name.last}</h6>
                            <small>{truncateBio(props.user?.bio)}</small>
                        </div>
                    </div>
                </Link>
                <div>
                    <button type='button' onClick={clickHandler}
                        disabled={isLoading}
                        style={{display:"flex", alignItems:"center", fontSize:"15px", margin:"0 3px"}}
                    >
                        <i className="fa-solid fa-user-plus" style={{marginRight:"6px"}}></i>
                        {isLoading ? ' Connecting...' : ' Connect'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default SuggestedUserCard