'use client'
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateDashboardPhase } from "@/slices/dashboardSlice";
import { updateIsEmailSynced } from "@/slices/userInfoSlice";

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
import { sendEmail, syncUserEmail } from "@/services/userServices";

const EmailAccounts: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const dashboardPhase = useSelector((state: RootState) => state.dashboard.dashboardPhase);
    const email = useSelector((state: RootState) => state.userInfo.email);
    const emailSyncStatus = useSelector((state: RootState) => state.userInfo.isEmailSynced);


    const handleSyncEmail = async () => {
        try {
            await syncUserEmail();
            dispatch(updateIsEmailSynced(true))
        } catch(err) {
            console.error('Error syncing email:', err);
        }
    }

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
                    {/* Add any additional content here */}
                </CardContent>
                <CardFooter className="flex gap-3">
                    <Button
                        onClick={() => handleSyncEmail()}
                        disabled={emailSyncStatus}
                        className={emailSyncStatus ? 'bg-green-500 text-white' : ''}
                    >
                        {emailSyncStatus ? 'Monitoring' : 'Start monitoring'}
                    </Button>
                    {emailSyncStatus && (
                        <>
                        <Badge className="flex items-center">
                        <CircleCheck className="pr-1.5 text-green-500" />monitoring
                    </Badge>
                    <Badge>
                        <CircleCheck className="pr-1.5 text-green-500" />authenticated
                    </Badge>
                        </>
                    )}
                    <Button onClick={async () => await sendEmail('uber-eats.pdf')}>send uber</Button>
                    <Button onClick={async () => await sendEmail('mcdonalds.pdf')}>send mcdonalds</Button>
                    <Button onClick={async () => await sendEmail('grocery-receipt.pdf')}>send grocery</Button>
                    <Button onClick={async () => await sendEmail('foodie-fruitie.pdf')}>send foodie fruitie</Button>
                </CardFooter>
            </Card>
        </main>
    )
}

export default EmailAccounts;
