import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateEmail } from "@/slices/userInfoSlice";
import Sidebar from "@/components/sidebar";

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const email = useSelector((state: RootState) => state.userInfo.email);
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
                dispatch(updateEmail(res.user.email))
            } catch (err) {
                console.error(err);
            }
        };
        if (!checkIsAuthenticated.current) {
            fetchUserInfo();
            checkIsAuthenticated.current = true
        }
    });

    return (
        <main className="flex">
            <Sidebar />
            <div className="flex-1">

            </div>
        </main>
    )
}