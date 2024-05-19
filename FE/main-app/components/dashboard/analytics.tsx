'use client'
import { useEffect, useState, useRef } from "react"
import { getUserInfo } from "@/services/userServices"
import { ReceiptDBResponse, UserData } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card"

const Analytics: React.FC = () => {
    const fetchExecuted = useRef(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalTimeSaved, setTotalTimeSaved] = useState(0);
    const [totalMoneySaved, setTotalMoneySaved] = useState(0);
    const [numReceipts, setNumReceipts] = useState(0);

    const calculateTotalSum = (receipts: ReceiptDBResponse[]): number => {
        return receipts.reduce((total, receipt) => {
            // Remove any non-numeric characters (except for the decimal point) and parse the value to a float
            const numericValue = parseFloat(receipt.TOTAL.replace(/[^0-9.-]+/g, ''));
            return total + (isNaN(numericValue) ? 0 : numericValue);
        }, 0);
    };

    useEffect(() => {
        const handleUserInfo = async () => {
            try {
                const response = await getUserInfo();
                console.log(response.user.receipts)
                setUserData(response.user);

                const totalSpent = calculateTotalSum(response.user.receipts);
                setTotalSpent(totalSpent);
                setTotalMoneySaved(0.12 * totalSpent);
                setNumReceipts(response.user.receipts.length);
                setTotalTimeSaved(0.33 * response.user.receipts.length);
            }
            catch (error) {
                console.error(error)
            }
        }
        if (!fetchExecuted.current) {
            handleUserInfo();
            fetchExecuted.current = true;
        }
    });

    const processData = (data: UserData) => {
        const vendorCount: { [key: string]: number } = {};

        data.receipts.forEach(receipt => {
            const vendor = receipt.VENDOR_NAME;
            if (vendorCount[vendor]) {
                vendorCount[vendor] += 1;
            } else {
                vendorCount[vendor] = 1;
            }
        });

        return Object.keys(vendorCount).map(vendor => ({
            vendor,
            count: vendorCount[vendor]
        }));
    };

    const chartData = userData ? processData(userData) : [];

    return (
        <main className="w-full h-full flex flex-col items-center justify-center p-2 gap-2">
            <Card className="w-full">
                <CardHeader>
                    <div className="grid grid-cols-4 gap-3">
                        <Card className="p-3">
                            <h1 className="font-medium">Total Money Spent:</h1>
                            ${totalSpent}
                        </Card>
                        <Card className="p-3">
                            <h1 className="font-medium">Total Time Saved:</h1>
                            {totalTimeSaved} minutes
                        </Card>
                        <Card className="p-3">
                            <h1 className="font-medium">Total Money Saved:</h1>
                            ${totalMoneySaved}
                        </Card>
                        <Card className="p-3">
                            <h1 className="font-medium">Number of Receipts:</h1>
                            {numReceipts}
                        </Card>
                    </div>
                </CardHeader>
                <CardTitle className="pt-9 pb-6 w-full flex justify-center">Categorization of Receipts by Vendor Name</CardTitle>
                <CardContent className="w-full flex justify-center">
                    {userData ? (
                        <ResponsiveContainer width="70%" height={200}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="vendor" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#737373" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}

export default Analytics
