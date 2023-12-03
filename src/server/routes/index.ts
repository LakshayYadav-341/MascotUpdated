import { Router } from "express"

import authRouter from "./auth"
import profileRouter from "./profile"
import userRouter from "./user"
import skillRouter from "./skill"
import skillsRouter from "./skills"
import postRouter from "./post"
import postsRouter from "./posts"

const app = Router()

app.use("/auth", authRouter)
app.use("/profile", profileRouter)
app.use("/user", userRouter)
app.use("/skill", skillRouter)
app.use("/skills", skillsRouter)
app.use("/post", postRouter)
app.use("/posts", postsRouter)

app.get("/test", (req, res) => {
    return res.send(req.headers.authorization)
})

export default app