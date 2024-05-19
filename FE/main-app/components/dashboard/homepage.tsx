import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateDashboardPhase } from "@/slices/dashboardSlice";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";
import { Mail, Files } from "lucide-react";

const Homepage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <main className="w-full h-full flex flex-col items-start p-8 gap-10">
            <div className="flex flex-col gap-3">
            <h1 className='text-4xl font-bold'>Welcome back, John!</h1>
            <p className="text-neutral-500">TRACE is your personal assistant for managing receipts and tracking expenses, transforming hours of work into just a few clicks.</p>
            </div>
            <Card className="m-auto -translate-y-20">
                <CardHeader>
                    <CardTitle>Your Dashboard for Managing Document Extraction.</CardTitle>
                    <CardDescription>Turn hours of work into just a few clicks.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 items-start">
                    <Button onClick={() => dispatch(updateDashboardPhase("email"))} variant="secondary"><Mail className="mr-2 h-4 w-4" />Monitor email accounts and set permissions</Button>
                    <Button onClick={() => dispatch(updateDashboardPhase("docs"))} variant="secondary"><Files className="mr-2 h-4 w-4" />View list of all the documents extracted from your accounts</Button>
                </CardContent>
            </Card>

        </main>
    )
}

export default Homepage;