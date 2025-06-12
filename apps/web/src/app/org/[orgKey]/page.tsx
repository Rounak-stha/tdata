import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function Page() {
  redirect(Paths.myTasks());
}
