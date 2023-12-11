import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import companyImg from "../../assets/images/company.png";
import axios from 'axios';
import urls, { serverPath, basePath } from '@utils/urls';
import { selectSession } from '../auth/authSlice';
import Loading from '../loading';
import { useGetter, usePoster } from '../../hooks/fetcher';
import Footer from '../footer';
import Modal from '../modal';
import { Autocomplete, Chip, Box, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { FormLabel, Stack } from 'react-bootstrap';
import SubmitModal from '../submitModal';
import { useFormik } from "formik"

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
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [info, setInfo] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])

    // const [tempUser, setTempUser] = useState({})
    // const [isLoading, setIsLoading] = useState(true);
    const [others, setOthers] = useState(false)

    function addNewSkill() {
        skills?.push()
    }
    const params = useParams()
    const profileUrl = basePath + urls.user.profile.get.replace(':id', params.id)
    const session = useSelector(selectSession)

    const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", params.id)
    const postUrl = basePath + urls.posts.get.replace(":id", params.id)
    const { data: connectedUser, mutate: connectionMutate, isLoading: connectionIsLoading } = useGetter(connectionsUrl)
    const { data: connectionData, mutate: connectionDataMutate, isLoading: connectionDataIsLoading } = useGetter(basePath + urls.request.findByType.replace(':type', "AlumniRequest"))
    const { data: postData, mutate: postMutate, isLoading: postIsLoading } = useGetter(postUrl)
    const { data: skillsData } = useGetter(basePath + urls.skills)
    const [changedSkill, setChangedSkill] = useState("")

    const handleAddSkill = async () => {
        const res = await axios.put(basePath + urls.user.profile.addSkill, { skill: changedSkill }, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.data) {
            setShowSkillModal(false)
            setChangedSkill("")
            tempUserMutate()
        }
    }
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };
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
        if (res?.data) {
            setShowAchievementModal(false)
            setDescription("")
            setInfo("")
            setFiles([])
            tempUserMutate()
        }
    }

    const { data: tempUser, mutate: tempUserMutate, isLoading } = useGetter(profileUrl)

    useEffect(() => {
        setOthers(session?.user._id !== params.id)
    }, [session.token]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const address = {}
        for (const entry of formData.entries()) {
            address[entry[0]] = entry[1]
        }
        const res = await axios.post(basePath + urls.user.profile.create, { address, role: session?.user?.role }, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.data) {
            setShowAddressModal(false)
            tempUserMutate()
        }
    }
    const handleAlumniSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        data.append("to", "656de3f2bdcaade9d49d0f4b")
        data.append("type", "AlumniRequest")
        const res = await axios.post(basePath + urls.request.create, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${session.token}`
            },
        });
        connectionDataMutate();
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

    const { data: instituteData, mutate: instituteDataMutate } = useGetter(basePath + urls.institute.findAll)

    const { values: formData, resetForm, handleChange: handleChangeFormData } = form
    const handleAddEducation = async (e) => {
        console.log(formData)
        setShowEducationModal(false)
        const res = await axios.post(basePath + urls.education.create, formData, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res.data) {
            tempUserMutate()
        }
    }
    const {data : jobData} = useGetter(basePath + urls.job.findById.replace(":id", session.user._id))
    // console.log(jobData)

    return (
        <>
            {isLoading ? <Loading></Loading> :
                <div className="profileContainer">
                    {/* Main Container */}
                    <div className="container-main">
                        {/* Profile Card */}
                        <div className="card profileCard-profile">
                            {/* Cover and Edit Button */}
                            <div className="cover"></div>
                            {/* {
                                tempUser?.data?._id === session.user._id && (
                                    <Link to="/edit-details">
                                        <span className="material-symbols-rounded cover-edit">edit</span>
                                    </Link>
                                )
                            } */}

                            {/* Profile Information */}
                            <div className="profileInfo">
                                <img src={serverPath + tempUser?.data?.profilePhoto} alt="profileImg" className="profileImg" />
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
                                            <Chip label={tempUser?.data?.role[0].toUpper} />
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
                                    <p className="connection-info">{connectedUser?.data.length} connections</p>

                                    {/* Additional Info for Alumni */}
                                    {tempUser?.data?.role === 'alumni' && (
                                        <p className="connection-info">
                                            {jobData?.data?.length} Jobs posted
                                        </p>
                                    )}
                                </div>
                                {/* Apply for Alumni Form (conditionally rendered) */}
                                {tempUser?.data?.role === 'student' && connectionData?.data?.length === 0 && tempUser?.data?._id === session.user._id && (
                                    <Link to="#" data-bs-toggle="modal" data-bs-target="#aboutModal" className="linkStyle">
                                        <button className=" btn btn-primary btn-outline">Apply For Alumni</button>
                                    </Link>
                                )}
                                {/* ... */}
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
                                {/* <div>
                                    <div>
                                        <span className="material-symbols-rounded">bar_chart</span>
                                    </div>
                                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                                        <Link to={others ? '#' : '/edit-posts'} className="linkStyle">{postImpression} Post impressions</Link>
                                        <div style={{ fontSize: '12px' }}>Checkout who's engaging with your posts.</div>
                                    </div>
                                </div> */}
                                <div>
                                    <div>
                                        <span className="material-symbols-rounded">group</span>
                                    </div>
                                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                                        <Link to={session?.user._id !== params.id ? '#' : '/network'} className="linkStyle">{connectedUser?.data.length} connections</Link>
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

                        {/* About Modal */}
                        <div className={`modal profileModal fade ${showAboutModal ? 'show' : ''}`} id="aboutModal" tabIndex={-1} aria-labelledby="articleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel" style={{ color: "black" }}>Add Your Gradesheet</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleAlumniSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label" style={{ color: "black" }}>Select file in pdf format</label>
                                                <input type='file' accept="application/pdf" className='form-control' name='document'></input>
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
                        {Object.keys(tempUser?.data).includes("profile") ? <>
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
                                        {tempUser?.data?.profile?.education?.length > 0 ? tempUser?.data?.profile?.education?.map(ed => (
                                            <div style={{ fontSize: '12px', borderBottom: "1px solid white" }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                                    {ed.institute.name}
                                                </div>
                                                <div>
                                                    Joined in {ed?.joined} <span style={{ fontSize: '15px' }}>•</span> Education Type : {ed?.type}
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
                        {Object.keys(tempUser?.data).includes("profile") ? <>
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
                                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{skill.name}</div>
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
                        {Object.keys(tempUser?.data).includes("profile") ? <>
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


                    </div>

                    {/* Right Container */}
                    <div className="container-right content">
                        {/* <div className="card left-group" style={{ color: '#cacaca' }}>
                    <h6>Connect with more people.....</h6>
                    {users.map((reqUser) => (
                        <form key={requser?.user} action="/api/connection/create" method="post">
                            <div className="card left-group" style={{ color: '#cacaca' }}>
                                <h6>Connect with more people.....</h6>
                                {users.map((reqUser, index) => (
                                    <form key={index} action="/api/connection/create" method="post">
                                        <div className="connectSuggestion">
                                            <Link to={`/profile/${requser?.user}`}>
                                                <div className="connectProfile">
                                                    <img src={requser?.imageUrl} alt="personImg" />
                                                    <div className="connectInfo">
                                                        <strong>{requser?.firstname} {requser?.lastname}</strong>
                                                        <small>{requser?.bio}</small>
                                                    </div>
                                                </div>
                                            </Link>
                                            <input type="hidden" name="from" value={user?.user} />
                                            <input type="hidden" name="to" value={requser?.user} />
                                            <input type="hidden" name="type" value="MUTUAL" />
                                            <button type="submit">Connect</button>
                                        </div>
                                    </form>
                                ))}
                            </div>
                        </form>
                    ))}
                </div> */}
                        {
                            (others || Object.keys(tempUser?.data).includes("profile")) ? <></> : <button className='btn btn-primary btn-outline' onClick={() => setShowAddressModal(true)}>Complete Your Profile</button>
                        }
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

            <Modal
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
            </Modal>
            <Modal
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
                            {instituteData?.data?.map(e => (
                                <MenuItem key={e?._id} value={e?._id}>{e?.name}</MenuItem>
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
            </Modal>
            <SubmitModal
                open={showAchievementModal}
                setOpen={setShowAchievementModal}
                title={"Add Achievements"}
                handleSubmit={handleAddAchievement}
            >
                <Box component="form" noValidate sx={{ mt: 2, color: 'white' }} className='formContainer' padding={'1rem'}>
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
        </>
    );
};

export default ProfileComponent;
