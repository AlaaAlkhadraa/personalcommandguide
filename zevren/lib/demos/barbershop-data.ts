export interface BarberService {
  id: string;
  name: string;
  duration: string;
  price: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
}

export const BARBER_SERVICES: BarberService[] = [
  { id: "classic-haircut", name: "Classic Haircut", duration: "30 min", price: "€25" },
  { id: "skin-fade", name: "Skin Fade", duration: "40 min", price: "€30" },
  { id: "beard-trim", name: "Beard Trim", duration: "20 min", price: "€15" },
  { id: "haircut-beard", name: "Haircut + Beard", duration: "50 min", price: "€38" },
  { id: "kids-haircut", name: "Kids Haircut", duration: "25 min", price: "€18" },
];

export const BARBERS: Barber[] = [
  { id: "lucas", name: "Lucas", role: "Master Barber" },
  { id: "daan", name: "Daan", role: "Barber" },
  { id: "milan", name: "Milan", role: "Barber" },
];

export const BARBER_DATES = [
  { id: "thu-20", label: "Thu 20 Aug" },
  { id: "fri-21", label: "Fri 21 Aug" },
  { id: "sat-22", label: "Sat 22 Aug" },
  { id: "mon-24", label: "Mon 24 Aug" },
  { id: "tue-25", label: "Tue 25 Aug" },
];

export const BARBER_DATE_FULL_LABELS: Record<string, string> = {
  "thu-20": "Thursday, 20 August",
  "fri-21": "Friday, 21 August",
  "sat-22": "Saturday, 22 August",
  "mon-24": "Monday, 24 August",
  "tue-25": "Tuesday, 25 August",
};

export const BARBER_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const UNAVAILABLE_INDEXES = [1, 4, 7, 10];

export function isTimeSlotAvailable(
  dateId: string,
  barberId: string,
  timeIndex: number
): boolean {
  const dateSeed = BARBER_DATES.findIndex((d) => d.id === dateId);
  const barberSeed = BARBERS.findIndex((b) => b.id === barberId);
  const seed = (dateSeed + 1) * (barberSeed + 2);
  return !UNAVAILABLE_INDEXES.includes((timeIndex + seed) % BARBER_TIME_SLOTS.length);
}
