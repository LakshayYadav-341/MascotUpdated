import React, { useState } from "react";
import jobHuntImg from "../../assets/images/job-hunt.svg";
import { useGetter } from "@client/hooks/fetcher.js";
import urls, { serverPath, basePath } from "../../../utils/urls";
import { Autocomplete, Chip, IconButton, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { selectSession } from "../auth/authSlice";
import styles from "./styles.module.scss";
import tempImage from "@client/assets/images/profile.png"
import { toast } from "react-toastify";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";

const JobContainer = ({ usermain, jobs, alumnis, csrfToken, allJobs }) => {
    const navigate = useNavigate();

    const [company, setCompany] = useState("");
    const companyUrl = basePath + urls.company.findAll;
    const jobGetUrl = basePath + urls.job.findAll;
    const { data: companyData } = useGetter(companyUrl);
    const { data: jobData, mutate: jobMutate } = useGetter(jobGetUrl);
    const { data: skillsData } = useGetter(basePath + urls.skills);
    const [changedSkill, setChangedSkill] = useState("");
    const [skills, setSkills] = useState([]);
    const session = useSelector(selectSession);
    const [currentSkills, setCurrentSkills] = useState([]);

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

    const handleAddSkill = async () => {
        const res = await axios.put(
            basePath + urls.skill.create,
            { name: changedSkill },
            {
                headers: {
                    authorization: `Bearer ${session?.token}`,
                },
            }
        );
    };
    const initial = {
        title: "",
        company: "",
        description: "",
        endsAt: "",
        experienceYears: ""
    }
    const [formData, setFormData] = useState(initial)

    const handleChangeFormData = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleCreateCompany = async (e) => {
        e.preventDefault()
        const data = structuredClone(formData)
        data.company = company
        data.skills = currentSkills.map(e => e._id)
        // for(const entry of data.entries()){
        //     console.log(entry);
        // }
        const res = await axios.post(basePath + urls.job.create, data, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if(res?.status === 200){
            setFormData(initial)
            setCompany("");       // Reset company field
            setCurrentSkills([]);
            toast.success("Job Posted Successfully")
        }
        else{
            toast.error("Something went wrong!!")
        }
        jobMutate()
    }

    return (
        <main className="job-container">
            <div className="container-main">
                {session?.user.role === "alumni" ? (
                    <div className="card">
                        <h3 style={{ textAlign: "center" }}>Create Referral</h3>
                        <form className="jobForm">
                            <label className="jobLabel" htmlFor="job-title">
                                Title
                            </label>
                            <input
                                className="jobInput"
                                type="text"
                                id="job-title"
                                name="title"
                                required
                                onChange={handleChangeFormData}
                                value={formData.title}
                            />

                            <label className="jobLabel" htmlFor="company-name">
                                Company Name
                            </label>
                            <Autocomplete
                                sx={{
                                    bgcolor: "white",
                                    "& .MuiOutlinedInput-root.Mui-focused": {
                                        color: "black",
                                        borderColor: "black",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        color: "black", // Set text color when not focused
                                    },
                                    "& .MuiInputLabel-outlined.Mui-focused": {
                                        color: "black",
                                    },
                                    "& .MuiInputLabel-outlined": {
                                        color: "black", // Set label color when not focused
                                    },
                                }}
                                freeSolo
                                options={
                                    companyData?.data?.map((company) => company.name) || []
                                }
                                renderInput={(params) => (
                                    <TextField
                                        name="company"
                                        {...params}
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                )}
                                onChange={(_, value) => setCompany(value)}
                                value={company}
                            />

                            <label className="jobLabel" htmlFor="job-description">
                                Description
                            </label>
                            <textarea
                                className="jobInput"
                                id="job-description"
                                name="description"
                                value={formData.description}
                                required
                                onChange={handleChangeFormData}
                            ></textarea>
                            <label className="jobLabel" htmlFor="job-skills">
                                Skills
                            </label>
                            <Autocomplete
                                sx={{
                                    bgcolor: "white",
                                    "& .MuiOutlinedInput-root.Mui-focused": {
                                        color: "black",
                                        borderColor: "black",
                                    },
                                    "& .MuiInputLabel-outlined.Mui-focused": {
                                        color: "black",
                                    },
                                }}
                                freeSolo
                                options={
                                    skillsData?.data?.filter((skill) => !currentSkills.map((e) => e?._id)?.includes(skill?._id))?.map((e) => e?.name) || []
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                    />
                                )}
                                value={changedSkill}
                                onChange={(_, value, reason) => {
                                    if (reason === "clear") {
                                        setChangedSkill("")
                                        return
                                    }
                                    setCurrentSkills((prev) => {
                                        if (prev.includes(skillsData?.data?.filter((k) => k.name === value)[0])) {
                                            return prev
                                        }
                                        return [
                                            ...prev,
                                            skillsData?.data?.filter((k) => k.name === value)[0],
                                        ]
                                    });
                                    setChangedSkill("")
                                }}
                            />
                            <div className={styles.changedSkillContainer}>
                                {currentSkills.map((skill, i) => (
                                    <Chip
                                        label={
                                            skillsData?.data?.filter((k) => k._id === skill._id)?.[0]?.name
                                        }
                                        key={i}
                                        variant="outlined"
                                        onDelete={() => {
                                            setCurrentSkills(prev => {
                                                prev.splice(i, 1)
                                                return prev
                                            })
                                        }}
                                    />

                                ))}
                            </div>

                            <label className="jobLabel" htmlFor="job-location">
                                Apply Before
                            </label>
                            <input
                                className="jobInput"
                                type="date"
                                id="job-location"
                                name="endsAt"
                                value={formData.endsAt}
                                onChange={handleChangeFormData}
                                required
                            />

                            <label className="jobLabel" htmlFor="job-salary">
                                Experience in Years
                            </label>
                            <input
                                className="jobInput"
                                type="number"
                                id="job-salary"
                                name="experienceYears"
                                value={formData.experienceYears}
                                onChange={handleChangeFormData}
                                required

                            />

                            <button
                                className="submitButton"
                                style={{ width: "100%" }}
                                onClick={handleCreateCompany}
                            >
                                Post Job
                            </button>
                        </form>
                    </div>
                ) : jobData?.length > 0 ? (
                    <div className="card job-card-container">
                        <div className="container-title">
                            <div
                                style={{ fontSize: "18px", fontWeight: 600, color: "white" }}
                            >
                                Referrals, recommended for you
                            </div>
                            {/* <div style={{ fontSize: "13px", fontWeight: "normal" }}>
                                Based on your searches, profile and search history
                            </div> */}
                        </div>
                        {jobData?.map((job) => (
                            <div className="card" style={{ display: "flex", flexDirection: "column", boxShadow: "1px 1px 20px 0px black" }} key={job._id}>
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
                                    {/* <div className="posted-time">Skills: {job.skills}</div> */}
                                    <div>Skills Required : {job?.skills.map((eachSkill, i) => <Chip variant="outlined" key={i} label={eachSkill?.name} />)}</div>
                                    <div className="posted-time">Experience Years: {job.experienceYears}</div>

                                    <div className="posted-time">Apply Before: {formatDate(job.endsAt)}</div>
                                    {
                                        <IconButton sx={{ position: "absolute", bottom: "0.5rem", right: "1rem" }} color="primary" aria-label="add to shopping cart" onClick={() => {navigate(`/chat?userId=${job?.from?._id}`)}}>
                                            <SendIcon sx={{ color: "#3297d1", fontSize: "2rem" }} />
                                        </IconButton>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card"><h1>No Referral Available</h1></div>
                )}
            </div>
            <div className="container-right">
                {session?.user?.role === 'student' ? (<div className="card job-helper">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: "18px", fontWeight: 600, color: "white" }}>
                            Job Seeker Guidance
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                            fontSize: "13px",
                            color: "#cacaca",
                        }}
                    >
                        <img
                            src={jobHuntImg}
                            width="80%"
                            alt="job-hunt"
                            style={{ paddingLeft: "10%" }}
                        />
                        <div>
                            Looking to advance your career and land your next job opportunity?
                            Our expert-led courses are designed to provide you with the tools
                            and knowledge you need to take your career to the next level. Our
                            courses cover a wide range of topics, including resume writing,
                            interview skills, networking strategies, job searching techniques,
                            and more. Whether you're just starting out in your career or
                            looking to make a career change, our courses are tailored to meet
                            your needs and help you achieve your goals.
                        </div>
                        <div>
                            Our courses are led by industry experts with years of experience
                            in their respective fields. They will guide you through each step
                            of the process, providing practical advice and actionable tips to
                            help you succeed. You'll learn how to create a winning resume that
                            highlights your skills and accomplishments, craft effective cover
                            letters that grab the attention of hiring managers, and develop a
                            strong professional network that can help you uncover hidden job
                            opportunities.
                        </div>
                        <div>
                            In addition to our core courses, we also offer a variety of
                            specialized courses to help you develop specific skills or address
                            specific challenges. Whether you need help with public speaking,
                            time management, or negotiation, our courses will provide you with
                            the knowledge and tools you need to succeed.
                        </div>
                        <div>
                            At the end of each course, you'll receive a certificate of
                            completion that you can add to your resume and LinkedIn profile.
                            This will demonstrate to employers that you are committed to your
                            professional development and have invested in yourself to enhance
                            your skills and knowledge.
                        </div>
                    </div>
                </div>) :
                    jobData?.length > 0 ? (
                        <div className="card job-card-container">
                            <div className="container-title">
                                <div
                                    style={{ fontSize: "18px", fontWeight: 600, color: "white" }}
                                >
                                    Referrals, recommended for you
                                </div>
                                {/* <div style={{ fontSize: "13px", fontWeight: "normal" }}>
                                    Based on your searches, profile and search history
                                </div> */}
                            </div>
                            {jobData?.map((job) => (
                                <div className="card" style={{ display: "flex", flexDirection: "column", boxShadow: "1px 1px 20px 0px black" }} key={job._id}>
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
                                            {/* <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: "2rem",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                <span className="material-symbols-rounded job-icon job-visibility">
                                                    visibility_off
                                                </span>
                                                <span className="material-symbols-rounded job-icon">
                                                    bookmark
                                                </span>
                                            </div> */}
                                        </div>
                                        <div className="company-name">
                                            At{" "}
                                            <span style={{ fontWeight: "bold" }}>
                                                {job.company.name}
                                            </span>
                                        </div>
                                        {/* <div className="posted-time">Skills: {job.skills}</div> */}
                                        <div>Skills Required : {job?.skills.map((eachSkill, i) => <Chip variant="outlined" key={i} label={eachSkill?.name} />)}</div>
                                        <div className="posted-time">Experience Years: {job.experienceYears}</div>
                                        <div className="posted-time">Apply Before: {formatDate(job.endsAt)}</div>
                                        {
                                            <IconButton sx={{ position: "absolute", bottom: "0.5rem", right: "1rem" }} color="primary" aria-label="add to shopping cart" onClick={() => {navigate(`/chat?userId=${job?.from?._id}`)}}>
                                                <SendIcon sx={{ color: "#3297d1", fontSize: "2rem" }} />
                                            </IconButton>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card"><h1>No Referral Available</h1></div>
                    )
                }
            </div>
        </main>
    );
};

export default JobContainer;
