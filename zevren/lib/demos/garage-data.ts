export interface GarageService {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
}

export const GARAGE_SERVICES: GarageService[] = [
  {
    id: "apk",
    name: "APK Inspection",
    duration: "45 min",
    price: "€45",
    description: "Mandatory annual roadworthiness inspection.",
  },
  {
    id: "maintenance",
    name: "Maintenance",
    duration: "1.5 hr",
    price: "From €95",
    description: "Scheduled maintenance based on your service book.",
  },
  {
    id: "tyres",
    name: "Tyres",
    duration: "40 min",
    price: "From €60",
    description: "Tyre replacement, rotation and balancing.",
  },
  {
    id: "brakes",
    name: "Brakes",
    duration: "1 hr",
    price: "From €85",
    description: "Brake pad, disc and fluid inspection or replacement.",
  },
  {
    id: "oil-service",
    name: "Oil Service",
    duration: "30 min",
    price: "€70",
    description: "Oil and filter change with a full fluid check.",
  },
];

export const GARAGE_DATES = [
  { id: "mon-24", label: "Mon 24 Aug" },
  { id: "tue-25", label: "Tue 25 Aug" },
  { id: "wed-26", label: "Wed 26 Aug" },
  { id: "thu-27", label: "Thu 27 Aug" },
  { id: "fri-28", label: "Fri 28 Aug" },
];

export const GARAGE_DATE_FULL_LABELS: Record<string, string> = {
  "mon-24": "Monday, 24 August",
  "tue-25": "Tuesday, 25 August",
  "wed-26": "Wednesday, 26 August",
  "thu-27": "Thursday, 27 August",
  "fri-28": "Friday, 28 August",
};

export const GARAGE_TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:30",
  "11:00",
  "13:00",
  "13:30",
  "14:00",
  "15:00",
  "15:30",
  "16:00",
];

const UNAVAILABLE_INDEXES = [2, 5, 9];

export function isGarageSlotAvailable(dateId: string, timeIndex: number): boolean {
  const dateSeed = GARAGE_DATES.findIndex((d) => d.id === dateId);
  return !UNAVAILABLE_INDEXES.includes((timeIndex + dateSeed) % GARAGE_TIME_SLOTS.length);
}

export const CAR_BRANDS = [
  "Volkswagen",
  "BMW",
  "Audi",
  "Mercedes-Benz",
  "Peugeot",
  "Renault",
  "Toyota",
  "Ford",
];
