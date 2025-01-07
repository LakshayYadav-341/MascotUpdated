import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    IconButton,
    Stack,
    Chip
} from "@mui/material"
import { useGetter } from "../../hooks/fetcher"
import urls, { basePath } from "../../../utils/urls"
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectSession } from "../auth/authSlice";
import { toast } from "react-toastify";


export default function Institute() {
    const { data: instituteData, mutate: mutateInstituteData } = useGetter(basePath + urls.institute.findAll)
    const deleteHandler = async (id) => {
        const deleteInstituteUrl = basePath + urls.institute.delete.replace(":id", id)
        try {
            const res = await axios.delete(deleteInstituteUrl, {
                headers: {
                    authorization: `Bearer ${session.token}`,
                }
            });
            if (res?.status === 200) {
                toast.error("Deleted Institute Successfully")
            }
            else {
                toast.error("Something went wrong!!")
            }
            mutateInstituteData();
        } catch (error) {
            console.error("Error deleting Institute :", error);
        }
    };
    const initialValues = {
        name: "",
        contact: {
            emails: [],
            phone: [],
            social: {
                facebook: "",
                instagram: "",
                x: "",
                quora: "",
                others: []
            }
        },
        address: {
            line1: "",
            line2: "",
            street: "",
            landmark: "",
            city: "",
            state: "",
            country: "",
            pinCode: 0
        }
    }
    const form = useFormik({
        initialValues
    })

    const { values: formData, handleChange: handleChangeFormData, setValues: setFormData, resetForm } = form

    const [email, setEmail] = useState("")
    const handleAddEmail = () => {
        const currentForm = structuredClone(formData)
        if (!currentForm.contact.emails.includes(email.trim()))
            currentForm.contact.emails.push(email)
        setFormData(currentForm)
        setEmail("")
    }
    const handleRemoveEmail = (index) => {
        const currentForm = structuredClone(formData)
        currentForm.contact.emails.splice(index, 1)
        setFormData(currentForm)
    }

    const [phone, setPhone] = useState("")
    const handleAddPhone = () => {
        const currentForm = structuredClone(formData)
        if (!currentForm.contact.phone.includes(phone.trim()))
            currentForm.contact.phone.push(phone)
        setFormData(currentForm)
        setPhone("")
    }

    const handleRemovePhone = (index) => {
        const currentForm = structuredClone(formData)
        currentForm.contact.phone.splice(index, 1)
        setFormData(currentForm)
    }

    const initialState = {
        name: "",
        value: ""
    }
    const [otherHandle, setOtherHandle] = useState(initialState)
    const handleChangeOtherHandle = (e) => setOtherHandle(prev => ({ ...prev, [e.target.name]: e.target.value }))
    const handleAddSocial = () => {
        const currentForm = structuredClone(formData)
        const otherHandles = currentForm.contact.social.others.map(e => e[0]) || []
        if (otherHandles.includes(otherHandle.name.trim())) {
            currentForm.contact.social.others[otherHandles.indexOf(otherHandle.name.trim())][1] = otherHandle.value
        }
        else {
            currentForm.contact.social.others.push([otherHandle.name, otherHandle.value])
        }
        setFormData(currentForm)
        setOtherHandle(initialState)
    }
    const handleRemoveSocial = (index) => {
        const currentForm = structuredClone(formData)
        currentForm.contact.social.others.splice(index, 1)
        setFormData(currentForm)
    }

    const session = useSelector(selectSession)
    const handleFormSubmit = async () => {
        const res = await axios.post(basePath + urls.institute.create, formData, {
            headers: {
                authorization: `Bearer ${session?.token}`
            }
        })
        if (res?.status === 200) {
            toast.success("Added Institute Successfully")
        }
        else {
            toast.error("Something went wrong!!")
        }
        if (res.data) {
            resetForm()
            mutateInstituteData()
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* Institutes List Section */}
            <div className="flex flex-col w-full md:w-1/4 gap-4 bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-300">Institutes</h2>
                <div className="flex flex-col gap-4">
                    {instituteData?.data?.map((e, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                        >
                            <p className="text-gray-300">{e?.name}</p>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => deleteHandler(e?._id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Section */}
            <div className="flex flex-col w-full md:w-3/4 gap-6">
                {/* Institute Name */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Institute Name</h3>
                    <input
                        type="text"
                        placeholder="Enter Institute Name"
                        name="name"
                        onChange={handleChangeFormData}
                        className="w-full p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Institute Address */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        Enter Institute Address
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Line 1"
                            name="address.line1"
                            required
                            onChange={handleChangeFormData}
                            className="w-full md:w-1/2 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Line 2"
                            name="address.line2"
                            onChange={handleChangeFormData}
                            className="w-full md:w-1/2 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Landmark"
                            name="address.landmark"
                            onChange={handleChangeFormData}
                            className="w-full md:w-1/2 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Street"
                            name="address.street"
                            required
                            onChange={handleChangeFormData}
                            className="w-full md:w-1/2 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="City"
                            name="address.city"
                            required
                            onChange={handleChangeFormData}
                            className="w-full md:w-1/2 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="State"
                            name="address.state"
                            required
                            onChange={handleChangeFormData}
                            className="w-full md:w-1/2 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Country"
                            name="address.country"
                            required
                            onChange={handleChangeFormData}
                            className="w-3/4 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Pin code"
                            name="address.pinCode"
                            required
                            onChange={handleChangeFormData}
                            className="w-1/4 p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Socials Section */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Add Socials</h3>
                    <div className="flex items-center gap-4 mb-2">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className="w-full p-2 bg-gray-700 text-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddEmail}
                            className="p-2 bg-blue-500 text-gray-300 rounded-md hover:bg-blue-600"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.contact.emails.map((e, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 bg-gray-700 p-2 rounded-md"
                            >
                                <span className="text-gray-300">{e}</span>
                                <button
                                    onClick={() => handleRemoveEmail(i)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Add similar inputs for Phone Numbers and Social Media Links */}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        onClick={handleFormSubmit}
                        className="w-full p-2 bg-green-500 text-gray-300 rounded-md hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}