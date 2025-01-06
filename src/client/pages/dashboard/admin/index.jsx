import { TabPanel } from "@mui/lab"
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { selectLoggedInUser } from "@client/components/auth/authSlice"
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Institute from "@client/components/institute";
import NewsCard from "../../../components/cards/newsCard";
import AlumniRequest from "../../../components/alumni-request";
import AdminPost from "../../../components/posts/admin-posts";
import AdminUserUpdate from "../../../components/updateByAdmin";
import ReportedUser from "../../../components/reported-user";
import ReportedPost from "@client/components/posts/reported-post";
import InstituteAdminHandleuser from "../../../components/updateByAdmin/InstituteAdminHandleUser";
import { basePath } from "../../../../utils/urls";
import urls from "../../../../utils/urls";
import { useGetter } from "../../../hooks/fetcher";

const panels = {
    "Institutes": <Institute />,
    "Alumni Approval": <AlumniRequest></AlumniRequest>,
    "Manage Users": <AdminUserUpdate></AdminUserUpdate>,
    "Reported Users": <ReportedUser></ReportedUser>,
    "Reported Posts": <ReportedPost></ReportedPost>,
    "Update News": <NewsCard></NewsCard>,
}

const panels2 = {
    "Alumni Approval": <AlumniRequest></AlumniRequest>,
    "Manage Users": <InstituteAdminHandleuser></InstituteAdminHandleuser>
    // "Institutes": <Institute />,
}

export default function Page() {
    const [value, setValue] = useState(Object.keys(panels)[0])
    const handleChangeValue = (_, _new) => setValue(_new)
    const [value2, setValue2] = useState(Object.keys(panels2)[0])
    const handleChangeValue2 = (_, _new) => setValue2(_new)
    const user = useSelector(selectLoggedInUser)
    const profileUrl = basePath + urls.user.profile.get.replace(':id', user)
    const { data: tempUser, mutate: tempUserMutate, isLoading } = useGetter(profileUrl)
    const navigate = useNavigate()

    useEffect(() => {
        if (tempUser && tempUser?.data?.role !=="admin") {
            navigate("/home")
        }
    }, [tempUser])

    return (
        <Box sx={{ width: '100%', typography: 'h2', marginTop: "4.5rem" }}>
            {tempUser&&tempUser.data.role === "admin" ? <TabContext value={value}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: "center",
                    }}
                >
                    <TabList
                        onChange={handleChangeValue}
                        sx={{
                            gap: "1rem",
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "1rem"
                        }}
                    >
                        {Object.keys(panels).map(e => (
                            <Tab key={e} label={e} value={e} />
                        ))}
                    </TabList>
                </Box>
                {Object.keys(panels).map(e => (
                    <TabPanel
                        key={e}
                        value={e}

                    >
                        {panels[e]}
                    </TabPanel>
                ))}
            </TabContext> : <TabContext value={value2}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: "center",
                    }}
                >
                    <TabList
                        onChange={handleChangeValue2}
                        sx={{
                            gap: "1rem",
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "1rem"
                        }}
                    >
                        {Object.keys(panels2).map(e => (
                            <Tab key={e} label={e} value={e} />
                        ))}
                    </TabList>
                </Box>
                {Object.keys(panels2).map(e => (
                    <TabPanel
                        key={e}
                        value={e}

                    >
                        {panels2[e]}
                    </TabPanel>
                ))}
            </TabContext>}
            
        </Box>
    )
}

// export const layout = {
//     hasFooter: false,
//     hasHeader: false
// }