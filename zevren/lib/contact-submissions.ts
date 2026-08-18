import { createHash } from "node:crypto";
import { getDatabase } from "@/lib/database";

export type ContactSubmissionInput = {
  name: string;
  email: string;
  company: string;
  needs: string;
  budget: string;
  message: string;
  ipAddress: string;
  userAgent: string | null;
};

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  needs: string | null;
  budget: string | null;
  message: string;
  created_at: string;
};

function hashIp(ipAddress: string): string {
  // The dashboard never needs the visitor's raw IP address. A one-way hash
  // still lets us investigate duplicate abuse without retaining that data.
  return createHash("sha256").update(ipAddress).digest("hex");
}

export async function createContactSubmission(input: ContactSubmissionInput): Promise<number> {
  const sql = getDatabase();
  const rows = (await sql.query(
    `INSERT INTO contact_submissions
      (name, email, company, needs, budget, message, ip_hash, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      input.name,
      input.email,
      input.company || null,
      input.needs || null,
      input.budget || null,
      input.message,
      hashIp(input.ipAddress),
      input.userAgent,
    ]
  )) as unknown as Array<{ id: number }>;

  const submission = rows[0];
  if (!submission) throw new Error("Contact submission was not saved.");
  return submission.id;
}

export async function getRecentContactSubmissions(): Promise<ContactSubmission[]> {
  const sql = getDatabase();
  return (await sql.query(
    `SELECT id, name, email, company, needs, budget, message, created_at
     FROM contact_submissions
     ORDER BY created_at DESC
     LIMIT 100`
  )) as unknown as ContactSubmission[];
}
