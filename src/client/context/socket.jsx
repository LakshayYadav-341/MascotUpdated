import { createContext, useEffect, useState, useContext } from "react"
import { useSelector } from "react-redux"
import socket from "socket.io-client"
import { selectSession } from "@client/components/auth/authSlice"
const getSocket = (token) => {
    return socket("https://mascotbackend.onrender.com", {
        withCredentials: true,
        auth: { token }
    })
}

const socketContext = createContext({
    socket: null
})

export const useSocket = () => useContext(socketContext);

export default function SocketProvider({ children }) {
    const session = useSelector(selectSession)
    const [socketIO, setSocketIO] = useState(null)

    useEffect(() => {
        if(session && session.token) {
            setSocketIO(getSocket(session.token))
        }
    }, [])

    return (
        <socketContext.Provider value={{ socket: socketIO }}>
            {children}
        </socketContext.Provider>
    )
}