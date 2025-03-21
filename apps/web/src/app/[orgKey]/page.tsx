import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ orgKey: string }> }) {
  const { orgKey } = await params;
  redirect(Paths.myTasks(orgKey));
}
