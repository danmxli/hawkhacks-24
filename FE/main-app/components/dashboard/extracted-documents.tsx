import React, { useState, useRef, useEffect } from "react";
import { Card } from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import { getUserInfo, getEmailPdf } from "@/services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateReceipts } from "@/slices/userInfoSlice";
import { ReceiptData } from "@/lib/utils";
import { Button } from "../ui/button";

const transformPayload = (payload: any[]): ReceiptData => {
    return payload.map(item => ({
        fileName: item.FILE_NAME,
        companyName: item.VENDOR_NAME,
        amount: item.SUBTOTAL,
        date: item.INVOICE_RECEIPT_DATE,
        tax: item.TAX,
        total: item.TOTAL,
        address: item.VENDOR_ADDRESS,
    }));
};

const ExtractedDocuments: React.FC = () => {
    const fetchExecuted = useRef(false);
    const dispatch = useDispatch<AppDispatch>();
    const receipts = useSelector((state: RootState) => state.userInfo.receipts);

    useEffect(() => {
        const handleReceipts = async () => {
            try {
                const response = await getUserInfo();
                if (response.user && response.user.receipts) {
                    const transformedReceipts = transformPayload(response.user.receipts);
                    dispatch(updateReceipts(transformedReceipts));
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (!fetchExecuted.current) {
            handleReceipts();
            fetchExecuted.current = true;
        }
    }, [dispatch]);

    const [pdfContent, setPdfContent] = useState<string | null>(null); 

    const handleFetchPdf = async (fileName: string) => {
        try {
            const response = await getEmailPdf(fileName);
            const blob = await response?.blob();
            if (blob) {
                const url = URL.createObjectURL(blob);
                setPdfContent(url);
            } else {
                console.error("Empty blob received.");
            }
        
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    };

    return (
        <main className="w-full h-full flex items-center justify-center">
            <Card>
                {!receipts.length ? (
                    <p>No receipts available.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Tax</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receipts.map((receipt, key) => (
                                <TableRow key={key}>
                                    <TableCell className="font-medium">
                                        {receipt.companyName}
                                        <Button onClick={() => handleFetchPdf(receipt.fileName)}>View PDF</Button>
                                    </TableCell>
                                    <TableCell>{receipt.date}</TableCell>
                                    <TableCell>{receipt.amount}</TableCell>
                                    <TableCell>{receipt.tax}</TableCell>
                                    <TableCell>{receipt.total}</TableCell>
                                    <TableCell>{receipt.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {pdfContent && (
                    <iframe
                        title="PDF Viewer"
                        src={pdfContent} // Set iframe source to PDF content URL
                        width="100%"
                        height="600px"
                    ></iframe>
                )}
            </Card>
        </main>
    );
};

export default ExtractedDocuments;
