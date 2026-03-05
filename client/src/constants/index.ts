import { Users, FileText, Car as CarIcon, Wallet } from "lucide-react";

// Note: CARS data is now fetched from the backend API
// Use api.cars.getAll() to fetch real car data

export const BOOKING_STEPS = [
  {
    number: "01",
    title: "car_rental_guide.step1Title",
    description: "car_rental_guide.step1Desc",
  },
  {
    number: "02",
    title: "car_rental_guide.step2Title",
    description: "car_rental_guide.step2Desc",
  },
  {
    number: "03",
    title: "car_rental_guide.step3Title",
    description: "car_rental_guide.step3Desc",
  },
  {
    number: "04",
    title: "car_rental_guide.step4Title",
    description: "car_rental_guide.step4Desc",
  },
];

export const RENTAL_TERMS = [
  { icon: Users, title: "terms.age", subtitle: "terms.minAge" },
  {
    icon: FileText,
    title: "terms.document",
    subtitle: "terms.documentsDesc",
  },
  {
    icon: CarIcon,
    title: "terms.experience",
    subtitle: "terms.experienceDesc",
  },
  { icon: Wallet, title: "terms.deposit", subtitle: "terms.depositDesc" },
];
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: "faq.q1",
    answer: "faq.a1",
  },
  {
    question: "faq.q2",
    answer: "faq.a2",
  },
  {
    question: "faq.q3",
    answer: "faq.a3",
  },
  {
    question: "faq.q4",
    answer: "faq.a4",
  },
  {
    question: "faq.q5",
    answer: "faq.a5",
  },
  {
    question: "faq.q6",
    answer: "faq.a6",
  },
];

export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
  Completed = "completed",
}
