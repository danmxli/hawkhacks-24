import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateDashboardPhase } from "@/slices/dashboardSlice";

import BlobSVG from "./ui/logo";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Home, Mail, Files, CircleUserRoundIcon, Settings } from "lucide-react";

const toggleOptions = [
    { icon: Home, label: "Home", phase: "home" },
    { icon: Mail, label: "Email Accounts", phase: "email" },
    { icon: Files, label: "Documents", phase: "docs" }
];

const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const dashboardPhase = useSelector((state: RootState) => state.dashboard.dashboardPhase);
    const email = useSelector((state: RootState) => state.userInfo.email);

    return (
        <main className="flex flex-col h-screen w-64 p-2 border-r">
            <div className="flex flex-col items-center gap-1 pb-2 border-b">
                <BlobSVG className="w-24 p-3 rounded-full shadow" />
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
            <div className="flex-grow max-h-fit"></div>
            <Card className="flex-none w-full p-3">
                <CardHeader>
                    <CircleUserRoundIcon className="w-full" />
                    <h1 className="truncate ... font-semibold">{email}</h1>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button variant="secondary"><Settings className="mr-2 h-4 w-4" />My Settings</Button>
                </CardContent>
            </Card>
        </main>
    );
}

export default Sidebar;
