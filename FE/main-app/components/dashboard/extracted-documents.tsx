'use client'
import React, { useState, useRef, useEffect } from "react";
import { Card } from "../ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import { getUserInfo, getEmailPdf, exportToCSV } from "@/services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateReceipts } from "@/slices/userInfoSlice";
import { ReceiptData } from "@/lib/utils";
import { Button } from "../ui/button";
import { FileSpreadsheet } from "lucide-react";
import { useTheme } from "next-themes";

const transformPayload = (payload: any[]): ReceiptData => {
    return payload.map(item => ({
        fileName: item.FILE_NAME,
        companyName: item.VENDOR_NAME,
        amount: item.SUBTOTAL,
        date: item.INVOICE_RECEIPT_DATE,
        tax: item.TAX,
        total: item.TOTAL,
        address: item.VENDOR_ADDRESS,
        category: item.CATEGORY,
    }));
};

const ExtractedDocuments: React.FC = () => {
    const fetchExecuted = useRef(false);
    const dispatch = useDispatch<AppDispatch>();
    const receipts = useSelector((state: RootState) => state.userInfo.receipts);
    console.log(receipts);

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

    const handleExportToCSV = async () => {
        try {
            const response = await exportToCSV();
            const blob = await response?.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "Expenses.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error("Error exporting to CSV:", error);
        }
    };

    const [pdfContent, setPdfContent] = useState<string | null>(null);

    const handleFetchPdf = async (fileName: string) => {
        try {
            const response = await getEmailPdf(fileName);
            const blob = await response?.blob();
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                setPdfContent(url);
            } else {
                console.error("Empty blob received.");
            }
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    };

    return (
        <main className="w-full h-screen p-2 flex flex-col items-center justify-center gap-2">
            <Card className="w-full ">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className=" border-none">
                            <TableHead className="w-1/4">Company</TableHead>
                            <TableHead className="w-1/4">Category</TableHead>
                            <TableHead className="w-1/4">Date</TableHead>
                            <TableHead className="w-1/4">Amount</TableHead>
                            <TableHead className="w-1/4">Tax</TableHead>
                            <TableHead className="w-1/4">Total</TableHead>
                            <TableHead className="w-1/4">Address</TableHead>
                            <TableHead className="w-1/4">PDF</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </Card>
            <Card className="w-full overflow-y-scroll relative">
                {!receipts.length ? (
                    <p className='ml-1'>No receipts available.</p>
                ) : (
                    <Table className="table-fixed w-full">
                        <TableBody>
                            {receipts.map((receipt, key) => (
                                <TableRow key={key}>
                                    <TableCell className="w-1/4 font-medium">
                                        {receipt.companyName}
                                    </TableCell>
                                    <TableCell className="w-1/4">{receipt.category}</TableCell>
                                    <TableCell className="w-1/4">{receipt.date}</TableCell>
                                    <TableCell className="w-1/4">{receipt.amount}</TableCell>
                                    <TableCell className="w-1/4">{receipt.tax}</TableCell>
                                    <TableCell className="w-1/4">{receipt.total}</TableCell>
                                    <TableCell className="w-1/4">{receipt.address}</TableCell>
                                    <TableCell className="w-1/4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" onClick={() => handleFetchPdf(receipt.fileName)}>View PDF</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{receipt.companyName} - PDF</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    {pdfContent && (
                                                        <iframe
                                                            title="PDF Viewer"
                                                            src={pdfContent}
                                                            width="100%"
                                                            height="600px"
                                                            className="rounded"
                                                        ></iframe>
                                                    )}
                                                </DialogDescription>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
            <Button 
                className="fixed bottom-4 right-4 ml-3 mr-1" 
                onClick={handleExportToCSV}
            >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to CSV
            </Button>
        </main>
    );
};

export default ExtractedDocuments;
