import { Button } from "@/components/ui/button";
import { loginUserWithGoogle } from "@/services/userServices";
import { useEffect } from "react";

export default function Home() {

  const handleLoginWithGoogle = async () => {
    try {
        const data = await loginUserWithGoogle()
        console.log(data)
        window.location.href = data.url;
    } catch (err) {
        throw err
    }
}

  return (
    <main className="h-screen flex items-center justify-center">
      <Button onClick={() => handleLoginWithGoogle()}>Login</Button>
    </main>
  );
}
