import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateEmail, updateIsEmailSynced } from "@/slices/userInfoSlice";
import Sidebar from "@/components/sidebar";
import Homepage from "@/components/dashboard/homepage";
import ExtractedDocuments from "@/components/dashboard/extracted-documents";
import EmailAccounts from "@/components/dashboard/email-accounts";

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const dashboardPhase = useSelector((state: RootState) => state.dashboard.dashboardPhase);
    const checkIsAuthenticated = useRef(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await getUserInfo();
                if (!res.user) {
                    dispatch(updateEmail(""))
                    router.push("/")
                    return
                }
                console.log(res.user)
                dispatch(updateEmail(res.user.email))
                dispatch(updateIsEmailSynced(res.user.isEmailSynced))
            } catch (err) {
                console.error(err);
            }
        };
        if (!checkIsAuthenticated.current) {
            fetchUserInfo();
            checkIsAuthenticated.current = true
        }
    });

    interface DashboardPhases {
        [key: string]: React.ReactNode;
    }

    const currPhase: DashboardPhases = {
        home: <Homepage />,
        email: <EmailAccounts />,
        docs: <ExtractedDocuments />
    }

    return (
        <main className="flex">
            <Sidebar />
            <div className="flex-1">
                {currPhase[dashboardPhase]}
            </div>
        </main>
    )
}