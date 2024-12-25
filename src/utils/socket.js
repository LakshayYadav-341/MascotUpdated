import { io } from "socket.io-client"

const SOCKET_SERVER = "https://mascotbackend.onrender.com"

const socket = io(SOCKET_SERVER, {
    autoConnect: false
})

export default socket