import { redirect } from "next/navigation";

import { OutreachBoard } from "@/components/admin/OutreachBoard";
import { readOutreachBoard } from "@/lib/server/outreach";
import { getSessionUserFromHeaders } from "@/lib/server/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function OutreachPage() {
  // Authorization happens here, on the server, before any pipeline data is
  // read. The board carries prospect emails and draft messages: admin only.
  const user = await getSessionUserFromHeaders();
  if (!user || user.role !== "admin") redirect("/admin/login");

  const data = await readOutreachBoard();
  return <OutreachBoard data={data} />;
}
