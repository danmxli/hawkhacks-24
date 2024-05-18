import { useEffect } from "react"
import { getUserInfo } from "@/services/userServices";

export default function Dashboard() {

    useEffect(() => {
        getUserInfo()
        
    }, []);

    return (
        <main>
            
        </main>
    )
}