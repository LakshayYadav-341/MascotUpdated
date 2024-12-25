import tempImage from "@client/assets/images/profile.png";
import LaunchIcon from '@mui/icons-material/Launch';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
    Autocomplete,
    Box,
    Chip,
    FormControl,
    FormControlLabel,
    ImageList,
    ImageListItem,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField
} from '@mui/material';
import urls, { basePath, serverPath } from '@utils/urls';
import axios from 'axios';
import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import { FormLabel, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import companyImg from "../../assets/images/company.png";
import { useGetter, usePutter } from '@client/hooks/fetcher';
import { selectSession } from '../auth/authSlice';
import Footer from '../footer';
import Loading from '../loading';
import CustomModal from '../modal';
import SubmitModal from '../submitModal';
import { MuiFileInput } from "mui-file-input";
import ConnectionType from './ConnectionType';
import PostCard from '../posts/PostCard';
import Report from "./Report";
import classes from "./styles.module.scss"

const ProfileComponent = ({
    user,
    usermain,
    contact,
    connection,
    job,
    post,
    postImpression,
    aboutData,
    interests,
    users,
}) => {
    const navigate = useNavigate()
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [info, setInfo] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])
    const [others, setOthers] = useState(false)
    const [profilePhotoModelOpen, setProfilePhotoModalOpen] = useState(false)
    const [file, setFile] = useState(null)
    const [institute, setInstitute] = useState("")

    const params = useParams()
    const session = useSelector(selectSession)

    const profileUrl = basePath + urls.user.profile.get.replace(':id', params.id)
    const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", params.id)
    const postUrl = basePath + urls.posts.get.replace(":id", params.id)

    const { data: connectedUser, mutate: connectionMutate, isLoading: connectionIsLoading } = useGetter(connectionsUrl)
    const { data: connectionData, mutate: connectionDataMutate, isLoading: connectionDataIsLoading } = useGetter(basePath + urls.request.findByType.replace(':type', "AlumniRequest"))
    const { data: postData, mutate: postMutate, isLoading: postIsLoading } = useGetter(postUrl)
    const { data: skillsData } = useGetter(basePath + urls.skills)
    const [changedSkill, setChangedSkill] = useState("")
    const { data: tempUser, mutate: tempUserMutate, isLoading } = useGetter(profileUrl)
    const { data: instituteData, mutate: instituteDataMutate } = useGetter(basePath + urls.institute.findAll)
    const { data: jobData } = useGetter(basePath + urls.job.findById.replace(":id", params.id))

    const handleAddSkill = async () => {
        const res = await axios.put(basePath + urls.user.profile.addSkill, { skill: changedSkill }, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.status === 200) {
            toast.success("Added Skill Successfully")
        }
        else {
            toast.error("Something went wrong!!")
        }
        if (res?.data) {
            setShowSkillModal(false)
            setChangedSkill("")
            tempUserMutate()
        }
    }
    const handleAddAchievement = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("info", info)
        data.append("description", description)
        const res = await axios.post(basePath + urls.achievement.create, data, {
            headers: {
                authorization: `Bearer ${session?.token}`,
                "Content-Type": 'multipart/form-data'
            }
        })
        if (res?.status === 200 || res?.status === "success") {
            toast.success("Added achievement Successfully")
        }
        else {
            toast.error("Something went wrong!!")
        }
        if (res?.data) {
            setShowAchievementModal(false)
            setDescription("")
            setInfo("")
            setFiles([])
            tempUserMutate()
        }
    }

    useEffect(() => {
        setOthers(session?.user !== params.id)
    }, [session.token]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const address = {}
        for (const entry of formData.entries()) {
            address[entry[0]] = entry[1]
        }
        const res = await axios.post(basePath + urls.user.profile.create, { address, role: tempUser?.data?.role }, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.status === 200) {
            toast.success("Added Address Successfully")
        }
        else {
            toast.error("Something went wrong!!")
        }
        if (res?.data) {
            setShowAddressModal(false)
            tempUserMutate()
        }
    }
    const handleAlumniSubmit = async (e) => {
        e.preventDefault();
    const data = new FormData(e.currentTarget);
        const resp = await axios.get(basePath + urls.institute.findById.replace(':id', institute), {
            headers: {
                authorization: `Bearer ${session.token}`
            },
        })
        // console.log(res?.data?.data);
        data.append("to", resp?.data?.data?.admin?._id)
        data.append("institute", resp?.data?.data?._id)
        data.append("type", "AlumniRequest")
        const res = await axios.post(basePath + urls.request.create, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${session.token}`
            },
        });
        if (res?.status === 200) {
            toast.success("Applied for alumni Successfully")
            connectionDataMutate();
        }
        else {
            toast.error("Something went wrong!!")
        }
        // console.log(data);
    };

    const form = useFormik({
        initialValues: {
            type: "",
            institute: "",
            joined: "",
            completion: {
                isCurrent: false
            }
        }
    })
    const {
        data: updatedUserData,
        trigger: updateProfilePhoto,
        isMutating,
        error: updatedUserError
    } = usePutter(basePath + urls.user.updateProfilePhoto)
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(
        tempUser?.data?.profilePhoto ?
            serverPath + tempUser?.data?.profilePhoto :
            tempImage
    )
    const handleChange = (newFile) => {
        setFile(newFile)
        const fileReader = new FileReader()
        fileReader.onload = (e) => setProfilePhotoUrl(e.target.result)
        fileReader.readAsDataURL(newFile)
    }
    const handleSubmitProfilePhoto = async () => {
        if (!file) {
            toast.error("No file uploaded")
            return
        }
        const formData = new FormData()
        formData.set("profile", file, file.name)
        console.log(formData.forEach((v, k) => console.log(k, v)))
        await updateProfilePhoto(formData)
    }
    const handleCloseProfilePhoto = () => {
        setFile(null)
        setProfilePhotoModalOpen(false)
        setProfilePhotoUrl(tempUser?.data?.profilePhoto ? serverPath + tempUser?.data?.profilePhoto : tempImage)
    }
    useEffect(() => {
        handleCloseProfilePhoto()
        if (updatedUserData) {
            toast.success("Successfully updated profile photo! It may take some time to update in the overall website")
        }
        if (updatedUserError) {
            toast.error("Error while updating profile photo")
        }
    }, [updatedUserData, updatedUserError])


    const { values: formData, resetForm, handleChange: handleChangeFormData } = form
    const handleAddEducation = async (e) => {
        setShowEducationModal(false)
        const res = await axios.post(basePath + urls.education.create, formData, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.status === 200) {
            toast.success("Added Education Successfully")
        }
        else {
            toast.error("Something went wrong!!")
        }
        if (res.data) {
            tempUserMutate()
        }
    }
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    // console.log(tempUser)
    return (
        <>
            {isLoading ?
                <Loading /> :
                <div className="profileContainer">
                    {/* Main Container */}
                    <div className="container-main">
                        {/* Profile Card */}
                        <div className="card profileCard-profile">
                            {/* Cover and Edit Button */}
                            <div className="cover"></div>
                            {
                                tempUser?.data?._id === session.user && (
                                    <Link to="/edit-details">
                                        <span className="material-symbols-rounded cover-edit">edit</span>
                                    </Link>
                                )
                            }

                            {/* Profile Information */}
                            <div className="profileInfo tempProfile">
                                <img src={tempUser?.data?.profilePhoto ? serverPath + tempUser?.data?.profilePhoto : tempImage} alt="profileImg" className="profileImg" />
                                {tempUser?.data?._id === session?.user && <>
                                    <span
                                        className="material-symbols-rounded profile-edit-button"
                                        onClick={() => setProfilePhotoModalOpen(true)}
                                    >
                                        edit
                                    </span>
                                </>}
                            </div>
                            {/* <p>{fetchedUser.email}</p> */}
                            {/* Profile Details */}
                            <div className="profileDetails w-100">
                                {/* Personal Information */}
                                <div className="personal">
                                    {/* Edit Title */}
                                    <div className="edit-title">
                                        <h3>
                                            {tempUser?.data?.name?.first} {tempUser?.data?.name?.last}
                                            <Chip sx={{ background: "white", color: "black", margin: "0 1rem" }} label={tempUser?.data?.role.toUpperCase()} />
                                        </h3>
                                    </div>
                                    {/* Personal Description */}
                                    <p className="personalDescription">{tempUser?.data?.bio || ""}</p>

                                    {/* Location Information */}
                                    <p className="location-info">
                                        {Object.keys(tempUser?.data).includes("profile") ? <Link to="#" data-bs-toggle="modal" data-bs-target="#addressModal" className="linkStyle">
                                            Address
                                        </Link> : <></>}

                                        <span style={{ fontSize: '15px' }}>•</span>
                                        <Link to="#" className="linkStyle" data-bs-toggle="modal" data-bs-target="#contactModal">
                                            Contact Info
                                        </Link>
                                    </p>

                                    <div className={`modal profileModal fade ${showContactModal ? 'show' : ''}`} id="contactModal" tabIndex={-1} aria-labelledby="articleModalLabel" aria-hidden="true" style={{ color: 'black' }}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">Contact Information</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="mb-2">
                                                        Email : {tempUser?.data?.email}
                                                    </div>
                                                    <div className="mb-2">
                                                        Phone : {tempUser?.data?.phone}
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`modal profileModal fade ${showAddressModal ? 'show' : ''}`} id="addressModal" tabIndex={-1} aria-labelledby="articleModalLabel" aria-hidden="true" style={{ color: 'black' }}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">Address Information</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="mb-2">
                                                        Name : {`${tempUser?.data?.profile?.address.name}`}
                                                    </div>
                                                    {tempUser?.data?.profile?.address.buildingName !== "" && <div className="mb-2">
                                                        Building Name : {tempUser?.data?.profile?.address.buildingName}
                                                    </div>}

                                                    <div className="mb-2">
                                                        Street : {tempUser?.data?.profile?.address.street}
                                                    </div>
                                                    <div className="mb-2">
                                                        Address Line 1 : {tempUser?.data?.profile?.address.line1}
                                                    </div>
                                                    {
                                                        tempUser?.data?.profile?.address.line2 &&
                                                        <div className="mb-2">
                                                            Address Line 2 : {tempUser?.data?.profile?.address.line2}
                                                        </div>
                                                    }
                                                    <div className="mb-2">
                                                        City : {tempUser?.data?.profile?.address.city}
                                                    </div>
                                                    <div className="mb-2">
                                                        Pincode : {tempUser?.data?.profile?.address?.pinCode}
                                                    </div>
                                                    <div className="mb-2">
                                                        State : {tempUser?.data?.profile?.address?.state}
                                                    </div>
                                                    <div className="mb-2">
                                                        Country : {tempUser?.data?.profile?.address?.country}
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connection Info */}
                                    {/* <p className="connection-info">{connectedUser?.data.length} connections</p> */}

                                    {/* Additional Info for Alumni */}
                                    {/* {tempUser?.data?.role === 'alumni' && (
                                        <Link to={`/userJob/${params.id}`}>
                                            <p className="connection-info">
                                                {jobData?.data?.length} Jobs posted
                                            </p>
                                        </Link>
                                    )} */}
                                </div>
                                {/* Apply for Alumni Form (conditionally rendered) */}
                                {tempUser?.data?.role === 'student' && connectionData?.data?.length === 0 && tempUser?.data?._id === session.user && (
                                    <Link to="#" data-bs-toggle="modal" data-bs-target="#aboutModal" className="linkStyle"
                                        style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
                                    >
                                        <button className=" btn btn-primary btn-outline">Apply For Alumni</button>
                                    </Link>
                                )}
                                <div className={classes.bottomRight}>
                                    {others && <ConnectionType userId={params.id} />}
                                    {others && <Report userId={params.id} />}
                                </div>
                            </div>
                        </div>

                        {/* Profile Card - Analytics */}

                        <div className="profile-card card">
                            <div className="analytics-title section-title">
                                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Analytics</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <span className="material-symbols-rounded" style={{ fontSize: '15px' }}>visibility</span>
                                    <div style={{ fontSize: '12px' }}>Private for you</div>
                                </div>
                            </div>
                            <div className="analytics-stats">
                                <div>
                                    <div>
                                        <span className="material-symbols-rounded">description</span>
                                    </div>
                                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                                        <Link to={others ? '#' : '/home'} className="linkStyle">{postData?.data?.length} Posts</Link>
                                        <div style={{ fontSize: '12px' }}>Discover your post.</div>
                                    </div>
                                </div>
                                {tempUser?.data.role === "alumni" && <div>
                                    <div>
                                        <span className="material-symbols-rounded">bar_chart</span>
                                    </div>
                                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                                        <Link to={others ? '#' : `/userJob/${params.id}`} className="linkStyle">{jobData?.data?.length} Referrals posted</Link>
                                        <div style={{ fontSize: '12px' }}>Checkout the referrals posted by you.</div>
                                    </div>
                                </div>}
                                <div>
                                    <div>
                                        <span className="material-symbols-rounded">group</span>
                                    </div>
                                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                                        <Link to={session?.user !== params.id ? '#' : '/network'} className="linkStyle">{typeof connectedUser.data === "string"?0 : connectedUser?.data?.length} connections</Link>
                                        <div style={{ fontSize: '12px' }}>See Your connections.</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Profile Card - About */}
                        {/* <div className="profile-card card">
                            <div className="about-title section-title">
                                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>About</div>
                                {!others &&
                                    <div>
                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#aboutModal" className="linkStyle">
                                            <span className="material-symbols-rounded about-edit">edit</span>
                                        </Link>
                                    </div>
                                }
                            </div>
                            <div className="about-description" style={{ fontSize: '20px' }}>
                                {aboutData !== '' ? aboutData : 'Add About so that people can know you better'}
                            </div>
                        </div> */}

                        {/* About CustomModal */}
                        <div className={`modal profileModal fade ${showAboutModal ? 'show' : ''}`} id="aboutModal" tabIndex={-1} aria-labelledby="articleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel" style={{ color: "black" }}>Add Your Gradesheet and college</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleAlumniSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label" style={{ color: "black" }}>Select file in pdf format</label>
                                                <input type='file' accept="application/pdf" className='form-control' name='document'></input>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label" style={{ color: "black" }}>Select Institute</label>
                                                <select id="institute" className='form-control' value={institute} onChange={(e)=>setInstitute(e.target.value)}>
                                                    <option value="" className='form-control'>Select your institute..</option>
                                                    {instituteData?.data?.map((e, ind)=> (
                                                        <option key={ind} value={e?._id} className='form-control'>{e?.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button type="submit" className="btn submitButton" data-bs-dismiss="modal" style={{ width: '100%' }}>Request For Alumni</button>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Card - Working (conditionally rendered) */}
                        {usermain?.role === "alumni" && (
                            <div className="profile-card card">
                                <div className="about-title section-title">
                                    <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Working</div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                                        {/* Add any additional elements for alumni working section */}
                                    </div>
                                </div>
                                <div className="experience-container">
                                    <div className="experience-main">
                                        <img src={companyImg} height="100px" width="100px" alt="company-logo" />
                                        <div style={{ fontSize: '12px' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                                Working at {user?.workplace}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Profile Card - Education */}
                        {!Object.keys(tempUser?.data).includes("admin") && Object.keys(tempUser?.data).includes("profile") ? <>
                            <div className="profile-card card">
                                <div className="about-title section-title">
                                    <div className="about-title section-title">
                                        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Education</div>
                                    </div>
                                    <div className="button-container" style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                                        {!others && (
                                            <div>
                                                {/* Add Education Button */}
                                                <Link data-bs-toggle="modal" onClick={() => setShowEducationModal(true)}>
                                                    <span className="material-symbols-rounded about-edit">add</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="education-container">
                                    <div className="education-main" style={{ flexDirection: "column" }}>
                                        {/* <img src="/images/college.png" height="100px" width="100px" alt="college-logo" /> */}
                                        {tempUser?.data?.profile?.education?.length > 0 ? tempUser?.data?.profile?.education?.map((ed, id) => (
                                            <div style={{ fontSize: '12px', borderBottom: "1px solid white" }} key={id}>
                                                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                                    {ed?.institute?.name}
                                                </div>
                                                <div>
                                                    Joined in {formatDate(ed?.joined)} <span style={{ fontSize: '15px' }}>•</span> Education Type : {ed?.type}
                                                </div>
                                                <div style={{ paddingTop: '7px' }}></div>
                                                {/* Add any additional information about education */}
                                            </div>
                                        )) : (<h1 style={{ fontSize: '1rem' }}>No Education Detail added</h1>)}
                                    </div>
                                </div>
                            </div>
                        </> : <></>}


                        {/* Profile Card - Skills */}
                        {!Object.keys(tempUser?.data).includes("admin") && Object.keys(tempUser?.data).includes("profile") ? <>
                            <div className="profile-card card">
                                {/* Section Title */}
                                <div className="about-title section-title">
                                    {/* Title Text */}
                                    <div className="title-text" style={{ fontSize: '22px', fontWeight: 'bold' }}>Skills</div>

                                    {/* Button Container */}
                                    <div className="button-container" style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                                        {!others && (
                                            <div>
                                                {/* Add Skill Button */}
                                                <Link data-bs-toggle="modal" onClick={() => setShowSkillModal(true)}>
                                                    <span className="material-symbols-rounded about-edit">add</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills Container */}
                                <div className="skill-container">
                                    {/* Render Skills */}
                                    {tempUser?.data?.profile?.skills?.length > 0 ? (
                                        tempUser?.data?.profile?.skills?.map((skill, index) => (
                                            <div key={index} className="skill-main">
                                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{skill?.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        // No Skills Message
                                        <p>No Skills added</p>
                                    )}
                                </div>
                            </div>
                        </> : <></>}


                        {/* Profile Card - Achievements */}
                        {!Object.keys(tempUser?.data).includes("admin") && Object.keys(tempUser?.data).includes("profile") ? <>
                            <div className="profile-card card">
                                <div className="about-title section-title">
                                    <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Achievements</div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                                        {!others &&
                                            <div>
                                                <Link onClick={() => setShowAchievementModal(true)} data-bs-toggle="modal">
                                                    <span className="material-symbols-rounded about-edit">add</span>
                                                </Link>
                                            </div>
                                        }
                                    </div>
                                </div>



                                {/* Interests Container */}
                                <div className="skill-container">
                                    {tempUser?.data?.profile?.achievements?.length > 0 ? (
                                        tempUser?.data?.profile?.achievements?.map((achievement, index) => (
                                            <div key={index} className="skill-main">
                                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{achievement?.info} {achievement?.documents.length > 0 ? <LaunchIcon component={"a"} href={serverPath + achievement.documents[0]}></LaunchIcon> : ""}</div>
                                                {
                                                    achievement?.description && <p>{achievement?.description}</p>
                                                }
                                            </div>

                                        ))
                                    ) : (
                                        <p>No Achievements added</p>
                                    )}
                                </div>
                            </div>
                        </> : <></>}
                        {!others && postData?.data.map((post, id) => <PostCard key={id} post={post} delete={true} postMutate={postMutate} />)}
                        {/* {console.log(postData?.data)} */}

                    </div>

                    {/* Right Container */}
                    <div className="container-right content">
                        {(others || Object.keys(tempUser?.data).includes("profile") || tempUser?.data?.role === "admin") ? <></> : (
                            <button
                                className='btn btn-primary btn-outline'
                                onClick={() => setShowAddressModal(true)}
                            >
                                Complete Your Profile
                            </button>
                        )}
                        {(!others && tempUser?.data?.admin && tempUser?.data?.admin?.role === "institute" && !tempUser?.data?.admin?.institute) ? (
                            <button
                                className='btn btn-primary btn-outline'
                                onClick={() => navigate("/institute/create")}
                            >
                                Create Institute
                            </button>
                        ) : <></>}
                        <Footer></Footer>
                    </div>
                </div>
            }
            <SubmitModal
                open={showAddressModal}
                setOpen={setShowAddressModal}
                title={"Complete your profile"}
                handleSubmit={handleSubmit}
            >
                <div className='formContainer card'>
                    <div id='detailForm'>
                        <h2>Address Details</h2>
                        <div className="twoInput">
                            <div className="div">
                                {/* <label htmlFor="name">Name</label> */}
                                <input type="text" name="name" placeholder='Name' id="name" required />
                            </div>
                            <div className="div">

                                {/* <label htmlFor="buildingName">Building Name</label> */}
                                <input type="text" name="buildingName" placeholder='Building Name' id="buildingName" />
                            </div>
                        </div>
                        <div className="oneInput">
                            {/* <label htmlFor="">Adress Line 1</label> */}
                            <input type="text" name="line1" placeholder='Address Line 1' id='line1' required />
                        </div>
                        <div className="oneInput">
                            {/* <label htmlFor="">Adress Line 2</label> */}
                            <input type="text" name="line2" placeholder='Adress Line 2' id='line' />
                        </div>
                        <div className="oneInput">
                            {/* <label htmlFor="">Street</label> */}
                            <input type="text" name="street" placeholder='Street name' id='street' required />
                        </div>
                        <div className="twoInput">
                            <div className="div">
                                <input type="text" name='city' placeholder='city' id='city' required />
                            </div>
                            <div className="div">
                                <input type="text" name="state" placeholder='State' id="state" required />
                            </div>
                        </div>
                        <div className="twoInput">
                            <div className="div">
                                {/* <label htmlFor="state">State</label> */}
                                <input type="text" name="country" placeholder='country' id="country" required />
                            </div>
                            <div className="div">

                                {/* <label htmlFor="pinCode">Pin Code</label> */}
                                <input type="number" name="pinCode" placeholder='Pin Code' id="pinCode" required />
                            </div>
                        </div>
                    </div>
                </div>
            </SubmitModal>
            <CustomModal
                open={showSkillModal}
                setOpen={setShowSkillModal}
                title={"Add Skill"}
                handleSubmit={handleAddSkill}
            >
                <Autocomplete
                    freeSolo
                    options={skillsData?.data?.filter(skill => !tempUser?.data?.profile?.skills?.map(e => e?._id)?.includes(skill?._id))?.map(e => e?.name) || []}
                    renderInput={(params) => (
                        <TextField {...params} label="Add your skills" onChange={e => setChangedSkill(e.target.value)} />
                    )}
                    onChange={(_, value) => setChangedSkill(value)}
                />
            </CustomModal>
            <CustomModal
                open={showEducationModal}
                setOpen={setShowEducationModal}
                title={"Add Education"}
                handleSubmit={handleAddEducation}
            >
                <Stack direction='column'>
                    <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
                        <InputLabel id="demo-simple-select-label">Type of Education</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.type}
                            label="Education"
                            name="type"
                            onChange={handleChangeFormData}
                        >
                            <MenuItem value={"metric"}>Metric</MenuItem>
                            <MenuItem value={"high school"}>High School</MenuItem>
                            <MenuItem value={"graduation"}>Graduation</MenuItem>
                            <MenuItem value={"post graduation"}>Post Graduation</MenuItem>
                            <MenuItem value={"Ph.D"}>Ph.D</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
                        <InputLabel id="demo-simple-select-label">Select Institute</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.institute}
                            label="Insitute"
                            name="institute"
                            onChange={handleChangeFormData}
                        >
                            {instituteData?.data?.map((e, ind) => (
                                <MenuItem key={ind} value={e?._id}>{e?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Are you currently studying here?</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={formData.completion.isCurrent}
                        >
                            <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Yes"
                                name="completion.isCurrent"
                                onChange={handleChangeFormData}
                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="No"
                                name="completion.isCurrent"
                                onChange={handleChangeFormData}
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Joining Date</FormLabel>
                        <TextField
                            type='date'
                            variant='filled'
                            name="joined"
                            onChange={handleChangeFormData}
                            value={formData.joined}
                        />
                    </FormControl>
                </Stack>
            </CustomModal>
            <SubmitModal
                open={showAchievementModal}
                setOpen={setShowAchievementModal}
                title={"Add Achievements"}
                handleSubmit={handleAddAchievement}
            >
                <Box noValidate sx={{ mt: 2, color: 'white' }} className='formContainer' padding={'1rem'}>
                    <Stack direction={'column'}>
                        <Stack sx={{ mt: 2 }} direction={'row'} spacing={2}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="Title of the Achievement"
                                name="info"
                                autoComplete="firstName"
                                autoFocus
                                onChange={(e) => setInfo(e.target.value)}
                                sx={{
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white"
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                                        color: "white"
                                    },
                                    "& .MuiInputLabel-outlined.Mui-focused": {
                                        color: "white"
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white"
                                    },
                                }}
                            />
                        </Stack>
                        <Stack sx={{ mt: 2 }} direction={'row'} spacing={2}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="description"
                                label="Description of the Achievement"
                                id="userBio"
                                multiline
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                autoComplete="userBio"
                                sx={{
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white"
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                                        color: "white"
                                    },
                                    "& .MuiInputLabel-outlined.Mui-focused": {
                                        color: "white"
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white"
                                    },
                                }}
                            />
                        </Stack>
                        {/* <Stack sx={{ mt: 2 }} direction={'column'} spacing={2}>
                            <div style={{ marginBottom: '-1rem', marginTop: '1rem' }}>Add files of proof</div>
                            <TextField
                                type='file'
                                margin="normal"
                                fullWidth
                                onChange={handleFileChange}
                                inputProps={{
                                    multiple: true,
                                    accept: 'application/pdf'
                                }}
                                name="documents"
                                // label="File"
                                id="profileImageUrl"
                                autoComplete="profileImageUrl"
                                sx={{
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white"
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                                        color: "white"
                                    },
                                    "& .MuiInputLabel-outlined.Mui-focused": {
                                        color: "white"
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "white"
                                    },
                                }}
                            />
                        </Stack> */}
                    </Stack>
                </Box>
            </SubmitModal>
            <CustomModal
                open={profilePhotoModelOpen}
                setOpen={setProfilePhotoModalOpen}
                title={"Change Profile Photo"}
                handleSubmit={handleSubmitProfilePhoto}
                handleClose={handleCloseProfilePhoto}
            >
                <Stack direction="column">
                    <ImageList cols={3}>
                        <ImageListItem />
                        <ImageListItem>
                            <img
                                src={profilePhotoUrl}
                                alt="profile-photo"
                            />
                        </ImageListItem>
                        <ImageListItem />
                    </ImageList>
                    <MuiFileInput
                        value={file}
                        onChange={handleChange}
                        InputProps={{
                            inputProps: {
                                accept: "image/jpeg,image/png"
                            },
                            startAdornment: <AddPhotoAlternateIcon />
                        }}
                    />
                </Stack>
            </CustomModal>
        </>
    );
};

export default ProfileComponent;