export interface AccountingService {
  id: string;
  title: string;
  description: string;
  audience: "entrepreneurs" | "freelancers" | "both";
}

export const ACCOUNTING_SERVICES: AccountingService[] = [
  {
    id: "bookkeeping",
    title: "Bookkeeping",
    description: "Monthly bookkeeping, kept current and ready for review at any time.",
    audience: "both",
  },
  {
    id: "vat",
    title: "VAT administration",
    description: "Quarterly BTW-aangifte prepared and filed on time, every time.",
    audience: "both",
  },
  {
    id: "annual-accounts",
    title: "Annual accounts",
    description: "Your jaarrekening prepared and filed, with a plain-language summary.",
    audience: "entrepreneurs",
  },
  {
    id: "tax-support",
    title: "Tax support",
    description: "Income tax and corporate tax support, with advice before deadlines matter.",
    audience: "both",
  },
  {
    id: "payroll",
    title: "Payroll",
    description: "Monthly payroll processing for your team, payslips included.",
    audience: "entrepreneurs",
  },
  {
    id: "freelancer-start",
    title: "For freelancers",
    description: "Everything a zzp'er needs: bookkeeping, BTW and income tax in one package.",
    audience: "freelancers",
  },
];

export interface AccountingPlan {
  name: string;
  audience: string;
  price: string;
  description: string;
  features: string[];
}

export const ACCOUNTING_PLANS: AccountingPlan[] = [
  {
    name: "Zelfstandig",
    audience: "For freelancers and sole traders",
    price: "From €75 / month",
    description: "Bookkeeping, VAT and income tax support in one monthly package.",
    features: ["Monthly bookkeeping", "Quarterly VAT return", "Annual income tax return"],
  },
  {
    name: "Groeiend",
    audience: "For small growing businesses",
    price: "From €150 / month",
    description: "Everything in Zelfstandig, with annual accounts and payroll for a small team.",
    features: ["Monthly bookkeeping", "Quarterly VAT return", "Annual accounts", "Payroll (up to 5 people)"],
  },
  {
    name: "Onderneming",
    audience: "For established companies",
    price: "From €275 / month",
    description: "Full bookkeeping, tax and payroll support with a dedicated point of contact.",
    features: ["Monthly bookkeeping", "Quarterly VAT return", "Annual accounts", "Payroll", "Dedicated contact"],
  },
];

export const APPOINTMENT_REASONS = [
  "Starting as a freelancer",
  "Switching accountants",
  "Annual accounts",
  "VAT question",
  "Payroll setup",
  "Something else",
];

export interface PortalInvoice {
  id: string;
  client: string;
  amount: number;
  status: "Paid" | "Open" | "Overdue";
  date: string;
}

export const PORTAL_INVOICES: PortalInvoice[] = [
  { id: "INV-2031", client: "De Groot Interieur", amount: 1240, status: "Paid", date: "3 Aug" },
  { id: "INV-2032", client: "Studio Renkema", amount: 860, status: "Open", date: "10 Aug" },
  { id: "INV-2033", client: "Van Loon Consultancy", amount: 2100, status: "Overdue", date: "22 Jul" },
];

export interface PortalDocument {
  id: string;
  name: string;
  category: string;
  date: string;
}

export const PORTAL_DOCUMENTS: PortalDocument[] = [
  { id: "d1", name: "Q2 VAT return.pdf", category: "VAT", date: "12 Jul" },
  { id: "d2", name: "Bank statement - July.pdf", category: "Bank", date: "1 Aug" },
  { id: "d3", name: "Annual accounts 2025 (draft).pdf", category: "Annual accounts", date: "5 Aug" },
];

export interface PortalTask {
  id: string;
  label: string;
  due: string;
  done: boolean;
}

export const PORTAL_TASKS: PortalTask[] = [
  { id: "t1", label: "Submit Q3 VAT return", due: "31 Oct", done: false },
  { id: "t2", label: "Upload July receipts", due: "15 Aug", done: true },
  { id: "t3", label: "Sign annual accounts 2025", due: "20 Aug", done: false },
];

export const PORTAL_MESSAGES = [
  {
    from: "Bergendal Accountants",
    subject: "Your Q2 VAT return has been filed",
    date: "12 Jul",
  },
  {
    from: "Bergendal Accountants",
    subject: "A few questions about your July bank statement",
    date: "3 Aug",
  },
];

export const VAT_OVERVIEW = [
  { quarter: "Q1", amount: 2140 },
  { quarter: "Q2", amount: 2680 },
  { quarter: "Q3", amount: 1950 },
];

export const FINANCIAL_OVERVIEW = [
  { month: "May", revenue: 12400, expenses: 6100 },
  { month: "Jun", revenue: 14100, expenses: 6800 },
  { month: "Jul", revenue: 13200, expenses: 7200 },
];
