import tempImage from "@client/assets/images/profile.png";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Autocomplete, Box, Chip, FormControl, FormControlLabel, ImageList, ImageListItem, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import urls, { basePath, serverPath } from '@utils/urls';
import axios from 'axios';
import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import { FormLabel, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetter, usePutter } from '@client/hooks/fetcher';
import { selectSession } from '../auth/authSlice';
import Footer from '../footer';
import Loading from '../loading';
import CustomModal from '../modal';
import SubmitModal from '../submitModal';
import { MuiFileInput } from "mui-file-input";
import PostCard from '../posts/PostCard';
import AddressModal from "./AddressModal";
import ProfileAnalytics from "./ProfileAnalytics";
import CompleteProfile from "./CompleteProfile";
import ContactInfo from "./ContactInfo";
import EducationDetails from "./EducationDetails";
import SkillsDetails from "./SkillsDetails"
import AchievementsDetails from "./AchievementsDetails";
import RightContainer from "./RightContainer";

const ProfileComponent = () => {

    const navigate = useNavigate()
    const params = useParams()
    const session = useSelector(selectSession)

    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [profilePhotoModelOpen, setProfilePhotoModalOpen] = useState(false)

    const [info, setInfo] = useState("")
    const [description, setDescription] = useState("")
    const [others, setOthers] = useState(false)
    const [file, setFile] = useState(null)
    const [changedSkill, setChangedSkill] = useState("")

    const profileUrl = basePath + urls.user.profile.get.replace(':id', params.id)
    const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", params.id)
    const postUrl = basePath + urls.posts.get.replace(":id", params.id)

    const { data: connectedUser } = useGetter(connectionsUrl)
    const { data: postData, mutate: postMutate } = useGetter(postUrl)
    const { data: skillsData } = useGetter(basePath + urls.skills)
    const { data: tempUser, mutate: tempUserMutate, isLoading } = useGetter(profileUrl)
    const { data: instituteData } = useGetter(basePath + urls.institute.findAll)
    const { data: jobData } = useGetter(basePath + urls.job.findById.replace(":id", params.id))
    const { data: updatedUserData, trigger: updateProfilePhoto, error: updatedUserError } = usePutter(basePath + urls.user.updateProfilePhoto)

    const [profilePhotoUrl, setProfilePhotoUrl] = useState(tempUser?.data?.profilePhoto ? serverPath + tempUser?.data?.profilePhoto : tempImage)

    const handleAddSkill = async () => {
        const res = await axios.put(basePath + urls.user.profile.addSkill, { skill: changedSkill }, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.status === 200)
            toast.success("Added Skill Successfully")
        else
            toast.error("Something went wrong!!")
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
        if (res?.status === 200 || res?.status === "success")
            toast.success("Added achievement Successfully")
        else
            toast.error("Something went wrong!!")
        if (res?.data) {
            setShowAchievementModal(false)
            setDescription("")
            setInfo("")
            tempUserMutate()
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const address = {}
        for (const entry of formData.entries())
            address[entry[0]] = entry[1]
        const res = await axios.post(basePath + urls.user.profile.create, { address, role: tempUser?.data?.role }, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.status === 200)
            toast.success("Added Address Successfully")
        else
            toast.error("Something went wrong!!")
        if (res?.data) {
            setShowAddressModal(false)
            tempUserMutate()
        }
    }
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
    const { values: formData, handleChange: handleChangeFormData } = form
    const handleAddEducation = async () => {
        setShowEducationModal(false)
        const res = await axios.post(basePath + urls.education.create, formData, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.status === 200)
            toast.success("Added Education Successfully")
        else
            toast.error("Something went wrong!!")
        if (res.data)
            tempUserMutate()
    }
    useEffect(() => {
        setOthers(session?.user !== params.id)
    }, [session.token]);
    useEffect(() => {
        handleCloseProfilePhoto()
        if (updatedUserData)
            toast.success("Successfully updated profile photo! It may take some time to update in the overall website")
        if (updatedUserError)
            toast.error("Error while updating profile photo")
    }, [updatedUserData, updatedUserError])
    return (
        <>{isLoading ?
            <Loading /> :
            <div className="profileContainer">
                <div className="container-main">
                    <div className="card profileCard-profile">
                        <div className="cover"></div>
                        {tempUser?.data?._id === session.user && (
                            <Link to="/edit-details">
                                <span className="material-symbols-rounded cover-edit">edit</span>
                            </Link>)}
                        <div className="profileInfo tempProfile">
                            <img src={tempUser?.data?.profilePhoto ? serverPath + tempUser?.data?.profilePhoto : tempImage} alt="profileImg" className="profileImg" />
                            {tempUser?.data?._id === session?.user && <>
                                <span
                                    className="material-symbols-rounded profile-edit-button"
                                    onClick={() => setProfilePhotoModalOpen(true)}>
                                    edit</span></>}</div>
                        <div className="profileDetails w-100">
                            <div className="personal">
                                <div className="edit-title">
                                    <h3>
                                        {tempUser?.data?.name?.first} {tempUser?.data?.name?.last}
                                        <Chip sx={{ background: "white", color: "black", margin: "0 1rem" }} label={tempUser?.data?.role.toUpperCase()} />
                                    </h3>
                                </div>
                                <p className="personalDescription">{tempUser?.data?.bio || ""}</p>
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
                                    <ContactInfo tempUser={tempUser} />
                                </div>

                                <div className={`modal profileModal fade ${showAddressModal ? 'show' : ''}`} id="addressModal" tabIndex={-1} aria-labelledby="articleModalLabel" aria-hidden="true" style={{ color: 'black' }}>
                                    <AddressModal tempUser={tempUser} />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Profile Card - Analytics */}
                    <ProfileAnalytics postData={postData} tempUser={tempUser} id={params?.id} jobData={jobData} session={session} connectedUser={connectedUser} others={others} />

                    {/* Profile Card - Education */}
                    <EducationDetails
                        isAdmin={Object.values(tempUser?.data).includes("admin")}
                        hasProfile={Object.keys(tempUser?.data).includes("profile")}
                        education={tempUser?.data?.profile?.education}
                        others={others}
                        onAddEducation={() => setShowEducationModal(true)}
                    />

                    {/* Profile Card - Skills */}
                    <SkillsDetails
                        isAdmin={!Object.keys(tempUser?.data).includes("admin")}
                        hasProfile={Object.keys(tempUser?.data).includes("profile")}
                        skills={tempUser?.data?.profile?.skills}
                        others={others}
                        onAddSkill={() => setShowSkillModal(true)}
                    />

                    {/* Profile Card - Achievements */}
                    <AchievementsDetails
                        isAdmin={!Object.keys(tempUser?.data).includes("admin")}
                        hasProfile={Object.keys(tempUser?.data).includes("profile")}
                        achievements={tempUser?.data?.profile?.achievements}
                        others={others}
                        onAddAchievement={() => setShowAchievementModal(true)}
                        serverPath={serverPath}
                    />

                    {/* {!others && postData?.data.map((post, id) => <PostCard key={id} post={post} delete={true} postMutate={postMutate} />)} */}

                </div>

                {/* Right Container */}
                <div className="container-right content">
                    <RightContainer
                        others={others}
                        tempUser={tempUser}
                        setShowAddressModal={setShowAddressModal}
                    />
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
                <CompleteProfile />
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
                            onChange={handleChangeFormData}>
                            {instituteData?.data?.map((e, ind) => (<MenuItem key={ind} value={e?._id}>{e?.name}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Are you currently studying here?</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={formData.completion.isCurrent}><FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Yes"
                                name="completion.isCurrent"
                                onChange={handleChangeFormData} /><FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="No"
                                name="completion.isCurrent"
                                onChange={handleChangeFormData}
                            /></RadioGroup></FormControl><FormControl><FormLabel>Joining Date</FormLabel><TextField
                                type='date'
                                variant='filled'
                                name="joined"
                                onChange={handleChangeFormData}
                                value={formData.joined} /></FormControl></Stack></CustomModal>
            <SubmitModal
                open={showAchievementModal}
                setOpen={setShowAchievementModal}
                title={"Add Achievements"}
                handleSubmit={handleAddAchievement}>
                <Box noValidate sx={{ mt: 2, color: 'white' }} className='formContainer' padding={'1rem'}>
                    <Stack direction={'column'}><Stack sx={{ mt: 2 }} direction={'row'} spacing={2}>
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
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": { color: "white" },
                                "& .MuiInputLabel-outlined.Mui-focused": { color: "white" },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
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
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": { color: "white" },
                                    "& .MuiInputLabel-outlined.Mui-focused": { color: "white" },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                                }}
                            />
                        </Stack>
                    </Stack>
                </Box>
            </SubmitModal>
            <CustomModal open={profilePhotoModelOpen} setOpen={setProfilePhotoModalOpen} title={"Change Profile Photo"} handleSubmit={handleSubmitProfilePhoto} handleClose={handleCloseProfilePhoto}>
                <Stack direction="column">
                    <ImageList cols={3}>
                        <ImageListItem />
                        <ImageListItem>
                            <img src={profilePhotoUrl} alt="profile-photo" />
                        </ImageListItem>
                        <ImageListItem />
                    </ImageList>
                    <MuiFileInput
                        value={file} onChange={handleChange} InputProps={{ inputProps: { accept: "image/jpeg,image/png" }, startAdornment: <AddPhotoAlternateIcon /> }} />
                </Stack>
            </CustomModal>
        </>
    );
};
export default ProfileComponent;