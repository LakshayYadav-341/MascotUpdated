import React from 'react';
import Footer from '../footer';
import { useParams } from 'react-router-dom';
import { basePath, serverPath } from '../../../utils/urls';
import urls from '../../../utils/urls';
import { useGetter } from '../../hooks/fetcher';
import tempImage from "@client/assets/images/profile.png";
import { Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { selectSession } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function UserJob() {
    const session = useSelector(selectSession)
    const params = useParams();
    const { data: filterResults, mutate: filterMutate } = useGetter(basePath + urls.job.findById.replace(":id", params.id))

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const deleteHandler = async (id) => {
        const res = await axios.delete(basePath + urls.job.delete.replace(":id", id), {
            headers: {
                authorization: `Bearer ${session.token}`
            }
        })
        if (res?.status === 200) {
            toast.error("Deleted Job Successfully")
            filterMutate();
        }
        else {
            toast.error("Something went wrong!!")
        }
    }

    return (
        <div className="flex flex-col items-center px-4 sm:px-8">
            <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl sm:text-2xl text-gray-300 font-semibold mb-4">Jobs Posted</h3>
                <hr className="border-gray-600 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filterResults?.data.length ? filterResults?.data?.map((job) => (
                        <div key={job._id} className="relative bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center mb-4">
                                <img
                                    src={job?.from?.profilePhoto ? serverPath + job.from.profilePhoto : tempImage}
                                    alt="profileImg"
                                    className="w-16 h-16 rounded-full border-2 border-gray-500"
                                />
                                <div className="ml-4 text-gray-300">
                                    <h5 className="text-lg font-medium">{job.from.name.first} {job.from.name.last}</h5>
                                    <p className="text-sm text-gray-300">{job.from.bio}</p>
                                </div>
                            </div>
                            <div className="text-gray-300">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-lg font-semibold">{job.title}</h4>
                                    <span className="text-sm text-gray-400 italic">{job.description}</span>
                                </div>
                                <p className="mb-2">At <span className="font-bold">{job.company.name}</span></p>
                                <p className="mb-2">Skills Required: {job?.skills.map((skill, i) => (
                                    <Chip key={i} label={skill?.name} variant="outlined" className="text-sm bg-gray-600 text-gray-300 mr-2 mb-2" />
                                ))}</p>
                                <p className="mb-2">Experience Years: {job.experienceYears}</p>
                                <p className="mb-2">Apply Before: {formatDate(job.endsAt)}</p>
                            </div>
                            {session?.user === params.id && (
                                <IconButton
                                    className="absolute bottom-4 right-4"
                                    onClick={() => deleteHandler(job?._id)}
                                >
                                    <DeleteIcon className="text-red-500" fontSize="large" />
                                </IconButton>
                            )}
                        </div>
                    )) : (
                        <h1 className="text-xl text-gray-300 col-span-full text-center">No Jobs found</h1>
                    )}
                </div>
            </div>
            <div className="w-full max-w-6xl mt-8">
                <Footer />
            </div>
        </div>
    );
}
