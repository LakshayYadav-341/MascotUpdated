import { selectSession } from "@client/components/auth/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Protected from "./components/auth/Protected";
import Header from "./components/header";

export default function Layout({ children, data }) {
    const navigate = useNavigate()
    const session = useSelector(selectSession)
    const loc = useLocation()
    const freePaths = [
        "/",
        "/signin",
        "/signup"
    ]
    useEffect(() => {
        if (!freePaths.includes(loc.pathname) && session === null) {
            navigate("/signin")
        }
        if (freePaths.includes(loc.pathname) && session !== null) {
            navigate("/home")
        }
    }, [session, loc.pathname])
    if (!data) {
        data = {
            hasFooter: true,
            hasHeader: true
        }
    }
    else {
        if (data.hasFooter === null || data.hasFooter === undefined) {
            data.hasFooter = true
        }
        if (data.hasHeader === null || data.hasHeader === undefined) {
            data.hasHeader = true
        }
    }
    return (
        <Protected>
            {data.hasHeader && <Header />}
            <main>
                <div className="mt-20 h-[90vh]">
                    {children}
                </div>
            </main>
        </Protected>
    )
}