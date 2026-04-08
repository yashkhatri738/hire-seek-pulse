import { getCurrentUser } from "@/lib/action/auth.quires";
import HomeClient from "./home-client";

export default async function Landing() {
  const user = await getCurrentUser();
  
  return <HomeClient user={user} />;
}
