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
        <Stack direction={"row"} gap={"1rem"} padding={"1rem"}>
            <Box
                width={"25%"}
                flex
                flexDirection={"column"}
                gap={"1rem"}
                minHeight={"80vh"}
            >
                <Typography variant="h4">Institutes</Typography>
                <Box
                    width={"100%"}
                    flex
                    flexDirection={"row"}
                    gap={"1rem"}
                >
                    <Box
                    >
                        {/* <Button
                            variant="contained"
                            fullWidth
                        >
                            New Institute
                        </Button> */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem"
                            }}
                        >
                            {instituteData?.data?.map((e, i) => (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}
                                    key={i}
                                >
                                    <Paper
                                        sx={{
                                            padding: ".5rem",
                                            width: "95%"
                                        }}
                                    >
                                        <Typography variant="body1">{e?.name}</Typography>
                                    </Paper>
                                    <IconButton color="primary" aria-label="add to shopping cart" onClick={() => { deleteHandler(e?._id) }}>
                                        <DeleteIcon sx={{ color: "red" }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "75%"
                }}
            >
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem"
                    }}
                >
                    <Typography variant="h5">Institute Name</Typography>
                    <TextField
                        variant="filled"
                        label="Enter Institute Name"
                        name="name"
                        onChange={handleChangeFormData}
                    />
                </Paper>
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem"
                    }}
                >
                    <Typography variant="h5">Enter Institute Address</Typography>
                    <Stack direction={"row"} gap={"1rem"}>
                        <TextField
                            variant="filled"
                            label="Line 1"
                            name="address.line1"
                            required
                            fullWidth
                            onChange={handleChangeFormData}
                        />
                        <TextField
                            variant="filled"
                            label="Line 2"
                            name="address.line2"
                            fullWidth
                        />
                    </Stack>
                    <Stack direction={"row"} gap={"1rem"}>
                        <TextField
                            variant="filled"
                            label="Landmark"
                            name="address.landmark"
                            onChange={handleChangeFormData}
                            fullWidth
                        />
                    </Stack>
                    <Stack direction={"row"} gap={"1rem"}>
                        <TextField
                            variant="filled"
                            label="Street"
                            name="address.street"
                            onChange={handleChangeFormData}
                            required
                            fullWidth
                        />
                        <TextField
                            variant="filled"
                            label="City"
                            name="address.city"
                            onChange={handleChangeFormData}
                            fullWidth
                            required
                        />
                    </Stack>
                    <Stack direction={"row"} gap={"1rem"}>
                        <TextField
                            variant="filled"
                            label="State"
                            name="address.state"
                            onChange={handleChangeFormData}
                            required
                            fullWidth
                        />
                    </Stack>
                    <Stack direction={"row"} gap={"1rem"}>
                        <Box width={"70%"}>
                            <TextField
                                variant="filled"
                                label="Country"
                                name="address.country"
                                onChange={handleChangeFormData}
                                required
                                fullWidth
                            />
                        </Box>
                        <Box width={"30%"}>
                            <TextField
                                variant="filled"
                                label="Pin code"
                                name="address.pinCode"
                                onChange={handleChangeFormData}
                                required
                                fullWidth
                                type="number"
                                autoComplete="off"
                                inputProps={{
                                    "-webkit-outer-spin-button": {
                                        "-webkit-appearance": "none",
                                        appearance: "none",

                                    }
                                }}
                            />
                        </Box>
                    </Stack>
                </Paper>
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem",
                        typography: "body1"
                    }}
                >
                    <Typography variant="h5">Add Socials</Typography>

                    <Stack direction={"row"} gap={"1rem"} alignItems={"center"} justifyContent={"center"}>
                        <Box width={"90%"}>
                            <TextField
                                variant="filled"
                                label="Email"
                                name="email"
                                fullWidth
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value.trim())}
                                value={email}
                                type="email"
                            />
                        </Box>
                        <Box width={"10%"}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleAddEmail}
                            >
                                Add Email
                            </Button>
                        </Box>
                    </Stack>
                    <Box>
                        {formData.contact.emails.map((e, i) => (
                            <Chip label={e} onDelete={e => handleRemoveEmail(i)} />
                        ))}
                    </Box>

                    <Stack direction={"row"} gap={"1rem"} alignItems={"center"} justifyContent={"center"}>
                        <Box width={"90%"}>
                            <TextField
                                variant="filled"
                                label="Phone No."
                                name="phone"
                                fullWidth
                                autoComplete="phone"
                                onChange={(e) => setPhone(e.target.value.trim())}
                                value={phone}
                                type="number"
                            />
                        </Box>
                        <Box width={"10%"}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleAddPhone}
                            >
                                Add Phone
                            </Button>
                        </Box>
                    </Stack>
                    <Box>
                        {formData.contact.phone.map((e, i) => (
                            <Chip label={e} onDelete={e => handleRemovePhone(i)} />
                        ))}
                    </Box>

                    <Stack direction={"row"} gap={"1rem"}>
                        <Box width={"40%"}>
                            <TextField
                                variant="filled"
                                label="Facebook Page URL"
                                name="contact.social.facebook"
                                fullWidth
                                onChange={handleChangeFormData}
                                type="url"
                            />
                        </Box>
                        <Box width={"60%"}>
                            <TextField
                                variant="filled"
                                label="Insta Page URL"
                                name="contact.social.instagram"
                                fullWidth
                                onChange={handleChangeFormData}
                                type="url"
                            />
                        </Box>
                    </Stack>
                    <Stack direction={"row"} gap={"1rem"}>
                        <Box width={"60%"}>
                            <TextField
                                variant="filled"
                                label="Twitter Handle"
                                name="contact.social.x"
                                fullWidth
                                onChange={handleChangeFormData}
                                type="url"
                            />
                        </Box>
                        <Box width={"40%"}>
                            <TextField
                                variant="filled"
                                label="Quora Handle"
                                name="contact.social.quora"
                                fullWidth
                                onChange={handleChangeFormData}
                                type="url"
                            />
                        </Box>
                    </Stack>

                    <Stack direction={"row"} gap={"1rem"}>
                        <Box width={"20%"}>
                            <TextField
                                variant="filled"
                                label="Social Media Name"
                                name="name"
                                fullWidth
                                onChange={handleChangeOtherHandle}
                                type="url"
                                value={otherHandle.name}
                            />
                        </Box>
                        <Box width={"70%"}>
                            <TextField
                                variant="filled"
                                label="Social Media URL"
                                name="value"
                                fullWidth
                                onChange={handleChangeOtherHandle}
                                type="url"
                                value={otherHandle.value}
                            />
                        </Box>
                        <Box width={"10%"}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleAddSocial}
                            >
                                Add Phone
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
                <Box width={"100%"}>
                    <Button variant="contained" fullWidth onClick={handleFormSubmit}>Submit</Button>
                </Box>
            </Box>
        </Stack>
    )
}