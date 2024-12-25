import React, { useState, useEffect } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import urls, { basePath } from '../../../utils/urls';
import { useGetter } from '../../hooks/fetcher';
import { selectSession } from '../auth/authSlice';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';

const ConnectionType = (props) => {
    const session = useSelector(selectSession)
    const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", session?.user)
    const suggestUrl = basePath + urls.user.suggestedUser.get
    const requestUrl = basePath + urls.request.from
    const { data: connectedUser, mutate: connectionMutate, isLoading: connectionIsLoading } = useGetter(connectionsUrl)
    const { data: connectionRequests, mutate: requestMutate, isLoading: requestIsLoading } = useGetter(requestUrl)
    const { data: suggestedUser, mutate: suggestMutate, isLoading: suggestIsLoading } = useGetter(suggestUrl)

    const [isFriend, setIsFriend] = useState(false);
    const [isSuggestion, setIsSuggestion] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const [request, setRequest] = useState({});
    useEffect(() => {
        let flag1 = false;
        if (connectedUser && connectedUser.data.status !== "error") {
            connectedUser?.data?.forEach(eachUser => {
                if (eachUser?.users[0]._id === props.userId) {
                    flag1 = true;
                }
            })
        }
        setIsFriend(flag1)
        let flag2 = false;
        suggestedUser?.data.forEach(eachUser => {
            if (eachUser?._id === props.userId) {
                flag2 = true;
            }
        })
        setIsSuggestion(flag2)
        let req = {};
        let flag3 = false;
        connectionRequests?.data.forEach(cr => {
            if (cr?.from._id === props.userId) {
                req = cr
                flag3 = true
            }
        })
        setHasRequested(flag3)
        setRequest(req)
    }, [connectedUser, suggestedUser, connectionRequests])
    const acceptRequestUrl = basePath + urls.request.acceptMutual.replace(':request', request?._id)
    const requestAcceptHadler = async () => {
        const res = await axios.put(acceptRequestUrl, {}, {
            headers: {
                authorization: `Bearer ${session.token}`,
            }
        })
        if (res?.status === 200) {
            toast.success("Request accepted Successfully")
        }
        else {
            toast.error("Something went wrong!!")
        }
        connectionMutate()
        requestMutate()
    }
    const sendRequestUrl = basePath + urls.request.create
    const clickHandler = async () => {
        const data = new FormData()
        data.append("to", props.userId)
        data.append("type", "Mutual")
        const res = await axios.post(sendRequestUrl, data, {
            headers: {
                authorization: `Bearer ${session.token}`,
                "Content-Type": 'multipart/form-data',
            }
        })
        if (res?.status === 200) {
            toast.success("Sent Request Successfully")
        }
        else {
            toast.error("Something went wrong!!")
        }
        suggestMutate()
    }
    return (
        <>
            {isSuggestion && !isFriend && !hasRequested && <Button variant="contained" endIcon={<PersonAddIcon />} onClick={clickHandler} >
                Connect
            </Button>}
            {isFriend && !isSuggestion && !hasRequested && <Button variant="contained" endIcon={<CheckIcon />}>
                Connection
            </Button>}
            {hasRequested && !isSuggestion && !isFriend && <Button variant="contained" endIcon={<PersonAddIcon />} onClick={requestAcceptHadler}>
                Accept
            </Button>}
            {!isSuggestion && !isFriend && !hasRequested && <Button variant="contained" endIcon={<CheckIcon />}>
                Connection Sent
            </Button>}
        </>
    )
}

export default ConnectionType