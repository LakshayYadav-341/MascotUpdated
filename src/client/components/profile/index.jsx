import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useFormik } from "formik";

import { useGetter, usePutter } from '@client/hooks/fetcher';
import { selectSession } from '../auth/authSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@client/components/ui/dialog";
import { Input } from "@client/components/ui/input";
import { Button } from "@client/components/ui/button";
import { Label } from "@client/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@client/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/components/ui/select";
import { Textarea } from "@client/components/ui/textarea";
import { Autocomplete, TextField } from '@mui/material';

import tempImage from "@client/assets/images/profile.png";
import urls, { basePath, serverPath } from '@utils/urls';
import Footer from '../footer';
import Loading from '../loading';
import AddressModal from "./AddressModal";
import ProfileAnalytics from "./ProfileAnalytics";
import CompleteProfile from "./CompleteProfile";
import ContactInfo from "./ContactInfo";
import EducationDetails from "./EducationDetails";
import SkillsDetails from "./SkillsDetails";
import AchievementsDetails from "./AchievementsDetails";
import RightContainer from "./RightContainer";

const ProfileComponent = () => {
    const params = useParams();
    const session = useSelector(selectSession);

    // State declarations
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddressDetailsModal, setShowAddressDetailsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [profilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);

    const [info, setInfo] = useState("");
    const [description, setDescription] = useState("");
    const [others, setOthers] = useState(false);
    const [file, setFile] = useState(null);
    const [changedSkill, setChangedSkill] = useState("");

    // API endpoints
    const endpoints = {
        profile: basePath + urls.user.profile.get.replace(':id', params.id),
        connections: basePath + urls.connections.getByUser.replace(":user", params.id),
        posts: basePath + urls.posts.get.replace(":id", params.id),
        skills: basePath + urls.skills,
        institutes: basePath + urls.institute.findAll,
        jobs: basePath + urls.job.findById.replace(":id", params.id)
    };

    // Data fetching hooks
    const { data: connectedUser } = useGetter(endpoints.connections);
    const { data: postData } = useGetter(endpoints.posts);
    const { data: skillsData } = useGetter(endpoints.skills);
    const { data: tempUser, mutate: tempUserMutate, isLoading } = useGetter(endpoints.profile);
    const { data: instituteData } = useGetter(endpoints.institutes);
    const { data: jobData } = useGetter(endpoints.jobs);
    const { data: updatedUserData, trigger: updateProfilePhoto, error: updatedUserError } = usePutter(basePath + urls.user.updateProfilePhoto);

    const [profilePhotoUrl, setProfilePhotoUrl] = useState(
        tempUser?.data?.profilePhoto ? serverPath + tempUser?.data?.profilePhoto : tempImage
    );

    // Form handling
    const form = useFormik({
        initialValues: {
            type: "",
            institute: "",
            joined: "",
            completion: { isCurrent: false }
        },
        onSubmit: handleAddEducation
    });

    const handleChange = (e) => {
        if (e.target.files?.[0]) {
            handleFileChange(e.target.files[0]);
        }
    };

    const handleFileChange = (newFile) => {
        setFile(newFile);
        const fileReader = new FileReader();
        fileReader.onload = (e) => setProfilePhotoUrl(e.target.result);
        fileReader.readAsDataURL(newFile);
    };

    const handleCloseProfilePhoto = () => {
        setFile(null);
        setProfilePhotoModalOpen(false);
        setProfilePhotoUrl(tempUser?.data?.profilePhoto ? serverPath + tempUser?.data?.profilePhoto : tempImage);
    };

    // Submit handlers
    const handleAddSkill = async () => {
        try {
            const res = await axios.put(
                basePath + urls.user.profile.addSkill,
                { skill: changedSkill },
                { headers: { authorization: `Bearer ${session?.token}` } }
            );

            if (res?.status === 200) {
                toast.success("Added Skill Successfully");
                setShowSkillModal(false);
                setChangedSkill("");
                tempUserMutate();
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    async function handleAddEducation() {
        try {
            setShowEducationModal(false);
            const res = await axios.post(
                basePath + urls.education.create,
                form.values,
                { headers: { authorization: `Bearer ${session?.token}` } }
            );

            if (res?.status === 200) {
                toast.success("Added Education Successfully");
                tempUserMutate();
                form.resetForm();
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    const handleAddAchievement = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("info", info);
        data.append("description", description);

        try {
            const res = await axios.post(
                basePath + urls.achievement.create,
                data,
                {
                    headers: {
                        authorization: `Bearer ${session?.token}`,
                        "Content-Type": 'multipart/form-data'
                    }
                }
            );

            if (res?.status === 200) {
                toast.success("Added achievement Successfully");
                setShowAchievementModal(false);
                setDescription("");
                setInfo("");
                tempUserMutate();
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const { values: formData, handleChange: handleChangeFormData } = form

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

    const handleSubmitProfilePhoto = async () => {
        if (!file) {
            toast.error("No file uploaded");
            return;
        }

        const formData = new FormData();
        formData.set("profile", file, file.name);
        await updateProfilePhoto(formData);
    };

    // Effects
    useEffect(() => {
        setOthers(session?.user !== params.id);
    }, [session?.user, params.id]);

    useEffect(() => {
        handleCloseProfilePhoto();
        if (updatedUserData) {
            toast.success("Successfully updated profile photo!");
            tempUserMutate();
        }
        if (updatedUserError) {
            toast.error("Error while updating profile photo");
        }
    }, [updatedUserData, updatedUserError]);

    if (isLoading) return <Loading />;
    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-12 bg-gray-900 text-gray-100 p-6">
                {/* Left Section */}
                <div className="flex-1 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                        <div className="h-32 bg-gray-700 relative">
                            <Link to="/edit-details" className="absolute top-2 right-2">
                                <span className="material-symbols-rounded bg-gray-900/50 text-gray-100 p-1 rounded-full hover:bg-gray-800">
                                    edit
                                </span>
                            </Link>
                        </div>
                        <div className="relative -mt-16 px-6">
                            <div className="relative">
                                <img
                                    src={tempUser?.data?.profilePhoto ? serverPath + tempUser?.data?.profilePhoto : tempImage}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-gray-800"
                                />
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-semibold text-gray-100">
                                        {tempUser?.data?.name?.first} {tempUser?.data?.name?.last}
                                    </h3>
                                    <span className="px-3 py-1 bg-gray-700 text-gray-100 text-sm font-medium rounded">
                                        {tempUser?.data?.role.toUpperCase()}
                                    </span>
                                </div>
                                <div className="my-4 flex items-center gap-2 text-sm">
                                    <button
                                        onClick={() => setShowAddressDetailsModal(true)}
                                        className="text-blue-400 hover:text-blue-300 transition"
                                    >
                                        Address
                                    </button>
                                    <span className="text-gray-500">•</span>
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="text-blue-400 hover:text-blue-300 transition"
                                    >
                                        Contact Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Section */}
                    <ProfileAnalytics
                        postData={postData}
                        tempUser={tempUser}
                        id={params?.id}
                        jobData={jobData}
                        session={session}
                        connectedUser={connectedUser}
                        others={others}
                    />

                    {/* Collapsible Sections */}
                    <div className="space-y-4">
                        <EducationDetails
                            isAdmin={tempUser?.data?.role === "admin"}
                            hasProfile={!!tempUser?.data?.profile}
                            education={tempUser?.data?.profile?.education}
                            others={others}
                            onAddEducation={() => setShowEducationModal(true)}
                        />
                        <SkillsDetails
                            isAdmin={tempUser?.data?.role !== "admin"}
                            hasProfile={!!tempUser?.data?.profile}
                            skills={tempUser?.data?.profile?.skills}
                            others={others}
                            onAddSkill={() => setShowSkillModal(true)}
                        />
                        <AchievementsDetails
                            isAdmin={tempUser?.data?.role !== "admin"}
                            hasProfile={!!tempUser?.data?.profile}
                            achievements={tempUser?.data?.profile?.achievements}
                            others={others}
                            onAddAchievement={() => setShowAchievementModal(true)}
                            serverPath={serverPath}
                        />
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-full lg:w-[28rem] space-y-6">
                    <RightContainer
                        others={others}
                        tempUser={tempUser}
                        setShowAddressModal={setShowAddressModal}
                    />
                    <Footer />
                </div>

            </div>

            <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                    </DialogHeader>
                    <ContactInfo tempUser={tempUser} />
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setShowContactModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showAddressDetailsModal} onOpenChange={setShowAddressDetailsModal}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Address Details</DialogTitle>
                    </DialogHeader>
                    <AddressModal tempUser={tempUser} />
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setShowAddressDetailsModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Complete your profile</DialogTitle>
                    </DialogHeader>
                    <CompleteProfile />
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setShowAddressModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Skills Modal */}
            <Dialog open={showSkillModal} onOpenChange={setShowSkillModal}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Add Skill</DialogTitle>
                    </DialogHeader>
                    <Autocomplete
                        freeSolo
                        options={skillsData?.data?.filter(skill => !tempUser?.data?.profile?.skills?.map(e => e?._id)?.includes(skill?._id))?.map(e => e?.name) || []}
                        renderInput={(params) => (
                            <TextField {...params} label="Add your skills" onChange={e => setChangedSkill(e.target.value)} />
                        )}
                        onChange={(_, value) => setChangedSkill(value)}
                    />
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setShowSkillModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddSkill}>Add</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Education Modal */}
            <Dialog open={showEducationModal} onOpenChange={setShowEducationModal}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Add Education</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Type of Education</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => handleChangeFormData({ target: { name: "type", value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="metric">Metric</SelectItem>
                                    <SelectItem value="high school">High School</SelectItem>
                                    <SelectItem value="graduation">Graduation</SelectItem>
                                    <SelectItem value="post graduation">Post Graduation</SelectItem>
                                    <SelectItem value="Ph.D">Ph.D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Institute</Label>
                            <Select
                                value={formData.institute}
                                onValueChange={(value) => handleChangeFormData({ target: { name: "institute", value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select institute" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instituteData?.data?.map((e) => (
                                        <SelectItem key={e._id} value={e._id}>
                                            {e.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Currently Studying Here?</Label>
                            <RadioGroup
                                value={formData.completion.isCurrent}
                                onValueChange={(value) =>
                                    handleChangeFormData({
                                        target: {
                                            name: "completion.isCurrent",
                                            value: value === "true"
                                        }
                                    })
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="current-yes" />
                                    <Label htmlFor="current-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="current-no" />
                                    <Label htmlFor="current-no">No</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Joining Date</Label>
                            <Input
                                type="date"
                                value={formData.joined}
                                onChange={(e) => handleChangeFormData({
                                    target: { name: "joined", value: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setShowEducationModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddEducation}>Add</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Achievement Modal */}
            <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Add Achievement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title of Achievement</Label>
                            <Input
                                placeholder="Enter achievement title"
                                onChange={(e) => setInfo(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Enter achievement description"
                                className="h-32"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setShowAchievementModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddAchievement}>Add</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Profile Photo Modal */}
            <Dialog
                open={profilePhotoModalOpen}
                onOpenChange={setProfilePhotoModalOpen}
            >
                <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Change Profile Photo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div />
                            <div className="aspect-square">
                                <img
                                    src={profilePhotoUrl}
                                    alt="profile-photo"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div />
                        </div>
                        <Input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={handleCloseProfilePhoto}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitProfilePhoto}>Update</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
};
export default ProfileComponent;