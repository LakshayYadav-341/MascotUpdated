import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import urls, { basePath, serverPath } from '@utils/urls'
import { selectSession } from '../auth/authSlice'
// @ts-ignore
import tempImage from "@client/assets/images/profile.png"

const AlumniRequestCard = (props) => {
    const acceptRequestUrl = basePath + urls.request.alumni.replace(':request', props.cr?._id).replace(':status', "accept")
    const ignoreRequestUrl = basePath + urls.request.alumni.replace(':request', props.cr?._id).replace(':status', "reject")
    const session = useSelector(selectSession);

    const clickHandler = async () => {
        const res = await axios.put(acceptRequestUrl, {}, {
            headers: { authorization: `Bearer ${session.token}` }
        })
        if(res?.status === 200) {
            toast.success("Request accepted Successfully")
        } else {
            toast.error("Something went wrong!!")
        }
        props.requestMutate()
    }

    const ignoreHandler = async () => {
        try {
            const res = await axios.put(ignoreRequestUrl, {}, {
                headers: { authorization: `Bearer ${session.token}` }
            });
            if(res?.status === 200) {
                toast.error("Ignored Request Successfully")
            } else {
                toast.error("Something went wrong!!")
            }
            props.requestMutate();
        } catch (error) {
            console.error("Error deleting connection request:", error);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-3 md:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-2xl mx-auto my-2 md:my-4">
            <Link to={`/profile/${props?.user?._id}`}>
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 md:gap-4 lg:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                        <img
                            src={props.user?.profilePhoto ? serverPath + props.user?.profilePhoto : tempImage}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-2 border-gray-700"
                        />
                    </div>
                    <div className="flex-grow min-w-0">
                        <h5 className="text-base sm:text-lg md:text-xl font-semibold text-gray-100 truncate">
                            {props?.user?.name?.first} {props?.user?.name?.last}
                        </h5>
                        <p className="text-sm md:text-base text-gray-400 line-clamp-2">
                            {props?.user?.bio}
                        </p>
                    </div>
                </div>
            </Link>

            <div className="mt-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                <a 
                    href={serverPath + props?.cr?.document} 
                    target="_blank"
                    className="text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
                >
                    View Document
                </a>
                <div className="flex gap-2 md:gap-4 w-full xs:w-auto justify-end">
                    <button 
                        onClick={ignoreHandler}
                        className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors duration-200"
                        type="button"
                    >
                        Reject
                    </button>
                    <button 
                        onClick={clickHandler}
                        className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-blue-600 text-gray-300 rounded hover:bg-blue-500 transition-colors duration-200"
                        type="button"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AlumniRequestCard