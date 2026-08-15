export interface DashboardBooking {
  id: string;
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "pending" | "confirmed" | "declined";
  total: number;
}

export const DASHBOARD_BOOKINGS: DashboardBooking[] = [
  { id: "bk1", propertyId: "pr1", guestName: "Sanne de Groot", checkIn: "12 Sep", checkOut: "20 Sep", status: "pending", total: 1480 },
  { id: "bk2", propertyId: "pr2", guestName: "Marco Bianchi", checkIn: "5 Sep", checkOut: "12 Sep", status: "confirmed", total: 665 },
  { id: "bk3", propertyId: "pr3", guestName: "Emma Janssen", checkIn: "1 Oct", checkOut: "10 Oct", status: "pending", total: 1650 },
  { id: "bk4", propertyId: "pr5", guestName: "Lucas Meyer", checkIn: "18 Sep", checkOut: "25 Sep", status: "confirmed", total: 980 },
  { id: "bk5", propertyId: "pr6", guestName: "Fien Willems", checkIn: "3 Sep", checkOut: "8 Sep", status: "pending", total: 487 },
];

export interface DashboardMessage {
  id: string;
  guestName: string;
  propertyId: string;
  unread: boolean;
  thread: { from: "guest" | "host"; text: string; time: string }[];
}

export const DASHBOARD_MESSAGES: DashboardMessage[] = [
  {
    id: "msg1",
    guestName: "Sanne de Groot",
    propertyId: "pr1",
    unread: true,
    thread: [
      { from: "guest", text: "Hi, is parking included with the apartment?", time: "09:14" },
    ],
  },
  {
    id: "msg2",
    guestName: "Marco Bianchi",
    propertyId: "pr2",
    unread: true,
    thread: [
      { from: "guest", text: "What time can I check in on the 5th?", time: "Yesterday" },
      { from: "host", text: "Check-in is from 15:00, but let me know if you need earlier.", time: "Yesterday" },
    ],
  },
  {
    id: "msg3",
    guestName: "Emma Janssen",
    propertyId: "pr3",
    unread: false,
    thread: [
      { from: "guest", text: "Is the garden fenced? We have a dog.", time: "Mon" },
      { from: "host", text: "Yes, it's fully fenced and pets are welcome.", time: "Mon" },
      { from: "guest", text: "Perfect, thank you.", time: "Mon" },
    ],
  },
];

export const REVENUE_BY_MONTH = [
  { month: "Mar", revenue: 3200 },
  { month: "Apr", revenue: 4100 },
  { month: "May", revenue: 3800 },
  { month: "Jun", revenue: 5200 },
  { month: "Jul", revenue: 6100 },
  { month: "Aug", revenue: 5700 },
];

export type DayStatus = "available" | "booked" | "blocked";

export function generateMonthDays(propertyId: string, blocked: number[]): { day: number; status: DayStatus }[] {
  const seed = [...propertyId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const days = [];
  for (let day = 1; day <= 30; day++) {
    let status: DayStatus = "available";
    if (blocked.includes(day)) {
      status = "blocked";
    } else if ((day + seed) % 5 === 0 || (day + seed) % 7 === 0) {
      status = "booked";
    }
    days.push({ day, status });
  }
  return days;
}
