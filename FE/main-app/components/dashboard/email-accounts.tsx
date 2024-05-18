import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateDashboardPhase } from "@/slices/dashboardSlice";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { CircleCheck } from "lucide-react";


const EmailAccounts: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const dashboardPhase = useSelector((state: RootState) => state.dashboard.dashboardPhase);
    const email = useSelector((state: RootState) => state.userInfo.email);

    return (
        <main className="w-full h-full flex items-center justify-center">
            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-row items-center gap-3">
                        <FcGoogle className="size-14" />
                        <div>
                            <Badge variant="outline">Google</Badge>
                            <h1 className="f">{email}</h1>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter className="flex gap-3">
                    <Badge className="flex items-center">
                        <CircleCheck className="pr-1.5 text-green-500" />monitoring
                    </Badge>
                    <Badge>
                        <CircleCheck className="pr-1.5 text-green-500" />authenticated
                    </Badge>
                </CardFooter>
            </Card>
        </main>
    )
}

export default EmailAccounts;