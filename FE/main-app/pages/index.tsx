import { Button } from "@/components/ui/button";
import { loginUser } from "@/services/userServices";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <Button onClick={() => loginUser()}>Login</Button>
    </main>
  );
}
