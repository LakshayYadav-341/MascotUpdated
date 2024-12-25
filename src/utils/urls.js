
export const serverPath = "https://mascotbackend.onrender.com"
export const basePath = serverPath+"/api"

export const socketServerPath = "https://mascotbackend.onrender.com"

export default {
    auth: {
        register: "/auth/register",
        login: "/auth/login",
        verify: "/auth/verify",
        getUserByEmail: "/auth/get-user/:email"
    },
    user: {
        profile: {
            create: "/profile/create",
            delete: "/profile/:id",
            update: "/profile/update",
            get: "/user/details/:id",
            addSkill: "/profile/add-skill"
        },
        address:{
            create: "/address/create",
            get: "/profile/getAddress",
            update: "/profile/updateAddress"
        },
        suggestedUser:{
            get: "/user/all-users"
        },
        fetchAll: "/user/get-all",
        update: "/user/update",
        updateProfilePhoto: "/user/updateProfilePhoto",
        getLoggedInUser: "/user",
        delete: "/user/:id",
        getByRole: "/users/get-role/:role",
        fetchUsersbyInstitute: "/users/get-by-instituteId"
    },
    skills: "/skills",
    skill: {
        create: "/skill/create"
    },
    work: {
        create: "/work/create"
    },
    post: {
        create: "/post/create",
        delete: "/post/:id",
        interact: "/post/:post/interact/:type", // type = like or comment
        interactions: "/post/:post/interactions/:type"
    },
    posts: {
        get: "/posts/:id",
        all: "/posts",
        getByPostId: "/posts/get-by-postId/:id"
    },
    request: {
        create: "/connection-request/create",
        acceptMutual: "/connection-request/:request/mutual/accept",
        from: "/connection-request",
        ignore:"/connection-request/:request/ignore",
        alumni: "/admin/connection-request/:request/:status",
        alumniRequests: "/admin/alumni-requests",
        findByType: "/connection-request/:type"
    },
    connections: {
        getByUser: "/connections/:user",
        delete: "/connection/delete/:id"
    },
    company: {
        create: "/company/create",
        findAll: "/companies"
    },
    job: {
        create: "/job/create",
        delete: "/job/:id",
        findAll: "/jobs",
        findById: "/jobs/:id",
        application: {
            create: "/job-application/create",
            findByJob: "/job-applications/job/:job"
        },
        searchByTitle: "/jobs/search/:title"
    },
    news: {
        create: "/news/create",
        update: "/news/:id",
        delete: "/news/:id",
        find: "/news"
    },
    achievement: {
        create: "/achievement/create",
        findAll: "/achievements",
        findById: "/achievements/:id",
    },
    institute: {
        create: "/institute/create",
        delete: "/institute/:id",
        findAll: "/institutes",
        findById: "/institutes/:id",
        findWithAdmins: "/admin/institutes"
    },
    education: {
        create: "/education/create"
    },
    report: {
        create: "/reported-user/create",
        getAll: "/reported-user",
        getById: "/reported-user/:id",
        deleteById: "/reported-user/delete/:id"
    },
    reportedPost: {
        create: "/reported-post/create",
        getAll: "/reported-post",
        getById: "/reported-post/:id",
        getByPostId: "/reported-post/getPost/:post",
        deleteById: "/reported-post/delete/:id"
    },
    chat: {
        create: "/chat",
        userChat: "/chat/find",
        findChat: "/chat/find/:userId"
    },
    message: {
        create: "/message",
        getMessage: "/message/:chatId"
    }
}