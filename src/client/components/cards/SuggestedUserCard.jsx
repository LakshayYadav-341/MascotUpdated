import React from 'react'
import { Link } from 'react-router-dom'
import urls,{ basePath, serverPath } from '@utils/urls'
import { useSelector } from 'react-redux'
import { selectSession } from '../auth/authSlice'
import axios from 'axios'
import tempImage from "@client/assets/images/profile.png"
import { toast } from 'react-toastify'

const SuggestedUserCard = (props) => {
    const sendRequestUrl = basePath + urls.request.create
    const session = useSelector(selectSession)
    const clickHandler = async()=>{
        const data = new FormData()
        data.append("to", props.user?._id)
        data.append("type", "Mutual")
        const res = await axios.post(sendRequestUrl, data, {
            headers:{
                authorization: `Bearer ${session.token}`,
                "Content-Type": 'multipart/form-data',
            }
        })
        if(res?.status === 200){
            toast.success("Sent Request Successfully")
        }
        else{
            toast.error("Something went wrong!!")
        }
        props.suggestMutate()
        props.requestMutate()
    }

    return (
        <>
                <div className="card profileCard suggestedCard" key={props.user?._id}>
                    <div className="cover"></div>
                    <Link to={`/profile/${props.user?._id}`} style={{zIndex : "2"}}>
                        <div className="profileInfo">
                            <img
                                src={props?.user?.profilePhoto?(serverPath + props.user?.profilePhoto):tempImage}
                                alt="profileImg"
                                className="profileImg"
                            />
                            <strong className="userName">{props.user?.name.first} {props.user?.name.last}</strong>
                            <small className="userProfession">{props.user?.bio}</small>
                            {/* <span>{props.institute}</span> */}
                        </div>
                    </Link>
                    <div>
                        <button className="text-button" type='button' onClick={clickHandler}>
                            <i className="fa-solid fa-user-plus"></i> Connect
                        </button>
                    </div>
                </div>
        </>
    )
}

export default SuggestedUserCard