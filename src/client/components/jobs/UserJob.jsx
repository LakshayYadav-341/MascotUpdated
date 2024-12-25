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
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
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
        <>

            <div className="profileContainer" style={{ marginTop: "2rem", padding: "3%"}}>
                <div className="container-main">
                <div className="p-4" style={{ backgroundColor: "#1b2730", borderRadius: "10px" }}>
                    <h3 className=' ms-2'>Jobs Posted</h3>
                    <hr style={{ marginTop: "0.5rem" }} />
                    {/* <hr /> */}
                    <div className="job-cards-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {filterResults?.data.length ? filterResults?.data?.map((job) => (
                            <div className="card m-2" key={job._id} style={{ boxShadow: "1px 1px 20px 0px black" }}>
                                <div className="userProfile">
                                    <div className="profileImgPost">
                                        <img src={job?.from?.profilePhoto ? serverPath + job.from.profilePhoto : tempImage} alt="profileImg" />
                                    </div>
                                    <div className="userInfo">
                                        <h5>{job.from.name.first} {job.from.name.last}</h5>
                                        <p>{job.from.bio}</p>
                                    </div>
                                </div>
                                <div className="company-info">
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: "white",
                                                fontSize: "18px",
                                                fontWeight: 450,
                                            }}
                                            className="job-name"
                                        >
                                            {job.title} ({job.description})
                                        </div>
                                    </div>
                                    <div className="company-name">
                                        At{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                            {job.company.name}
                                        </span>
                                    </div>
                                    <div>Skills Required : {job?.skills.map((eachSkill, i) => <Chip variant="outlined" key={i} label={eachSkill?.name} />)}</div>
                                    <div className="posted-time">Experience Years: {job.experienceYears}</div>
                                    <div className="posted-time">Apply Before: {formatDate(job.endsAt)}</div>
                                </div>
                                {
                                    session?.user === params.id && <IconButton sx={{ position: "absolute", bottom: "0.5rem", right: "1rem" }} color="primary" aria-label="add to shopping cart" onClick={() => { deleteHandler(job?._id) }}>
                                        <DeleteIcon sx={{ color: "#E74C3C", fontSize: "2rem" }} />
                                    </IconButton>
                                }
                            </div>
                        )) : <h1>No Jobs found</h1>}
                    </div>
                </div>
                </div>
                <div className="container-right content"><Footer /></div>
            </div>
        </>
    );
}
