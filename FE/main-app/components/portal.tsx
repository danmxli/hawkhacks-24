import { useEffect, useRef } from "react";
import { loginUserWithGoogle, getUserInfo } from "@/services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateEmail } from "@/slices/userInfoSlice";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail, LayoutDashboard } from "lucide-react";

const Portal: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const email = useSelector((state: RootState) => state.userInfo.email);
    const checkIsAuthenticated = useRef(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await getUserInfo();
                if (!res.user) {
                    dispatch(updateEmail(""))
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

    const handleLoginWithGoogle = async () => {
        try {
            const data = await loginUserWithGoogle();
            console.log(data);
            window.location.href = data.url;
        } catch (err) {
            console.error('Error logging in with Google:', err);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Streamlined Receipt and Invoice Extraction</CardTitle>
                <CardDescription>Optimize expense tracking and integrate with management systems.</CardDescription>
            </CardHeader>
            <CardContent>
                {email === "" ? (
                    <Button onClick={handleLoginWithGoogle}>
                        <Mail className="mr-2 h-4 w-4" /> Login with Email
                    </Button>
                ) : (
                    <Button>
                        <LayoutDashboard className="mr-2 h-4 w-4" />Dashboard
                    </Button>
                )}

            </CardContent>
            <CardFooter>
                <a className="flex items-center gap-1.5" href="https://github.com/danmxli/hawkhacks-24" target="_blank" rel="noopener noreferrer">Version 0.1.0</a>
            </CardFooter>
        </Card>
    );
};

export default Portal;
