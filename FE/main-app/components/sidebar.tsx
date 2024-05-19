import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateDashboardPhase } from "@/slices/dashboardSlice";
import { logoutUser } from "@/services/userServices";

import BlobSVG from "./ui/logo";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Home, Mail, Files, CircleUserRoundIcon, Settings, Router } from "lucide-react";
import ToggleThemeButton from "./ui/themeToggleBtn";
import { useTheme } from "next-themes";

const toggleOptions = [
    { icon: Home, label: "Home", phase: "home" },
    { icon: Mail, label: "Email Accounts", phase: "email" },
    { icon: Files, label: "Documents", phase: "docs" }
];

const Sidebar: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const dashboardPhase = useSelector((state: RootState) => state.dashboard.dashboardPhase);
    const email = useSelector((state: RootState) => state.userInfo.email);
    const {theme} = useTheme();


    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push("/");
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <main className={`flex flex-col h-screen w-64 p-2 border-r ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="flex flex-col items-center gap-1 p-3 pb-5 border-b">
            <img src={theme === 'dark' ? './white-logo.svg' : './logo.svg'} alt="Logo" className="w-full h-12" />
            </div>
            <div className="pt-2 flex flex-col gap-1">
                {toggleOptions.map((button, index) => {
                    const Icon = button.icon;
                    return (
                        <Button
                            key={index}
                            onClick={() => dispatch(updateDashboardPhase(button.phase))}
                            variant={dashboardPhase === button.phase ? "default" : "ghost"}
                            className="justify-start"
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {button.label}
                        </Button>
                    );
                })}
            </div>
            <div className="flex-grow flex items-end justify-center m-2">
                <ToggleThemeButton /> 
            </div>
            <Card className="flex-none w-full p-3">
                <CardHeader className="flex flex-col justify-center">
                    <CircleUserRoundIcon className="w-full" />
                    <h1 className="truncate ... font-medium">{email}</h1>
                </CardHeader>
                <>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full" variant="secondary"><Settings className="mr-2 h-4 w-4" />User Information</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">{email}</h4>
                                <p className="text-sm text-muted-foreground">
                                    Authenticated User
                                </p>
                                <Button onClick={handleLogout}>Logout</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
            </Card>
        </main>
    );
}

export default Sidebar;
