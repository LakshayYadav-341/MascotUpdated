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
            headers: {
                authorization: `Bearer ${session.token}`,
            }
        })
        if(res?.status === 200){
            toast.success("Request accepted Successfully")
        }
        else{
            toast.error("Something went wrong!!")
        }
        props.connectionMutate()
        props.requestMutate()
    }
    const ignoreHandler = async () => {
        try {
            const res = await axios.delete(ignoreRequestUrl, {
                headers: {
                    authorization: `Bearer ${session.token}`,
                }
            });
            if(res?.status === 200){
                toast.error("Ignored Request Successfully")
            }
            else{
                toast.error("Something went wrong!!")
            }
            props.requestMutate();
            props.suggestMutate();
        } catch (error) {
            console.error("Error deleting connection request:", error);
        }
    };
    
    return (
        <>
            <div className="invitation">
                <Link to={`/profile/${props.user?._id}`}>
                    <div className="userProfile networkUserProfile">
                        <div className="profileImgPost">
                            <img
                                src={props?.user?.profilePhoto ? serverPath + props.user?.profilePhoto : tempImage}
                                alt="profileImg"
                            />
                        </div>
                        <div className="userInfo">
                            <h5>{props.user?.name.first} {props.user?.name.last}</h5>
                            <p>{props.user?.bio}</p>
                        </div>
                    </div>
                </Link>
                <div className="networkOption">
                    <button className="noborderButton" type='button' onClick={ignoreHandler}>Ignore</button>
                    <button className="text-button" type='button' onClick={clickHandler}>Accept</button>
                </div>
            </div>
        </>
    )
}

export default RequestedUser