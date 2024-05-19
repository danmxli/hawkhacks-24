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
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        onClick={() => handleSyncEmail()}
                        disabled={emailSyncStatus}
                        className={`w-full ${emailSyncStatus ? 'bg-green-500 text-white' : ''}`}
                    >
                        {emailSyncStatus ? 'Monitoring' : 'Start monitoring'}
                    </Button>
                    <div className="border-2 border-red-400  grid grid-cols-4 gap-2 items-center">
        <h1 className="col-span-4">KEVINS CORNER 👾🤖🧑‍💻🕵️‍♂️🌐💻🖥️</h1>
                    <Button onClick={async () => await sendEmail('amazon.pdf')}>send amazon</Button>
                    <Button onClick={async () => await sendEmail('amazon.pdf')}>send amazon</Button>
<Button onClick={async () => await sendEmail('amazon2.pdf')}>send amazon2</Button>
<Button onClick={async () => await sendEmail('amazon3.pdf')}>send amazon3</Button>
<Button onClick={async () => await sendEmail('amazon4.pdf')}>send amazon4</Button>
<Button onClick={async () => await sendEmail('amazon5.pdf')}>send amazon5</Button>
<Button onClick={async () => await sendEmail('amazon6.pdf')}>send amazon6</Button>
<Button onClick={async () => await sendEmail('amazon7.pdf')}>send amazon7</Button>
<Button onClick={async () => await sendEmail('amazon8.pdf')}>send amazon8</Button>
<Button onClick={async () => await sendEmail('amazon9.pdf')}>send amazon9</Button>
<Button onClick={async () => await sendEmail('amazon10.pdf')}>send amazon10</Button>
<Button onClick={async () => await sendEmail('amazon11.pdf')}>send amazon11</Button>
<Button onClick={async () => await sendEmail('amazon12.pdf')}>send amazon12</Button>

                    <Button onClick={async () => await sendEmail('mcdonalds.pdf')}>send mcdonalds</Button>
                    <Button onClick={async () => await sendEmail('grocery-receipt.pdf')}>send grocery</Button>
                    <Button onClick={async () => await sendEmail('foodie-fruitie.pdf')}>send foodie fruitie</Button>
                    </div>
                </CardFooter>
            </Card>
        </main>
    )
}

export default EmailAccounts;
