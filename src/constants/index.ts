import { Car } from "@/types";

export const FEATURED_CARS: Car[] = [
  {
    id: "1",
    name: "Tesla Model 3",
    brand: "Tesla",
    type: "Luxury",
    price_per_day: 95,
    image_url:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80",
    transmission: "Automatic",
    fuel_type: "Electric",
    seats: 5,
    description:
      "The Tesla Model 3 is designed for electric performance, with dual motor AWD, quick acceleration, long range and fast charging.",
    is_available: true,
  },
  {
    id: "2",
    name: "Lexus LX 570",
    brand: "Lexus",
    type: "Luxury SUV",
    price_per_day: 180,
    image_url:
      "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHg1NzB8ZW58MHx8MHx8fDA%3D",
    transmission: "Automatic",
    fuel_type: "Petrol",
    seats: 7,
    description:
      "The Lexus LX 570 features a 5.7L V8 engine with around 383 hp and 4WD luxury performance with premium leather interior and advanced safety suite.",
    is_available: true,
  },
  {
    id: "3",
    name: "Lexus LX 600",
    brand: "Lexus",
    type: "Luxury SUV",
    price_per_day: 220,
    image_url:
      "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior-pr-103-6864352bba6da.jpg?crop=0.708xw:0.598xh;0.145xw,0.304xh&resize=1200:*",
    transmission: "Automatic",
    fuel_type: "Petrol",
    seats: 7,
    description:
      "The Lexus LX 600 comes with a 3.5L twin-turbo V6 producing ~409 hp, advanced infotainment, full-time 4WD, and a premium spacious interior with modern tech. :contentReference[oaicite:0]{index=0}",
    is_available: true,
  },
  {
    id: "4",
    name: "Lexus LX 700h Overtrail",
    brand: "Lexus",
    type: "Luxury Hybrid SUV",
    price_per_day: 260,
    image_url:
      "https://lexusenthusiast.com/images/weblog/20241010_01_02-1200x640.jpg",
    transmission: "Automatic",
    fuel_type: "Hybrid",
    seats: 7,
    description:
      "The LX 700h adds a 3.4L twin-turbo hybrid V6 with around 457 hp and 583 lb-ft torque, plus overlanding-ready features like differential locks and a waterproofed hybrid system. :contentReference[oaicite:1]{index=1}",
    is_available: true,
  },
  {
    id: "5",
    name: "Lexus LC 500",
    brand: "Lexus",
    type: "Luxury Coupe",
    price_per_day: 300,
    image_url:
      "https://hips.hearstapps.com/hmg-prod/images/2024-lexus-lc-500-convertible-117-655d765c34a2d.jpg?crop=0.764xw:0.647xh;0.115xw,0.262xh&resize=2048:*",
    transmission: "Automatic",
    fuel_type: "Petrol",
    seats: 4,
    description:
      "The Lexus LC is a luxury grand tourer with striking design, premium materials, and a front-engine, rear-drive layout. The LC500 coupe is powered by a V8, blending performance and elegance. :contentReference[oaicite:2]{index=2}",
    is_available: true,
  },
  {
    id: "6",
    name: "Mercedes-AMG GT 63 S E PERFORMANCE",
    brand: "Mercedes-AMG",
    type: "Luxury Supercar",
    price_per_day: 450,
    image_url:
      "https://www.topgear.com/sites/default/files/2022/04/1-Mercedes-AMG-GT-63-S-E-Performance.jpg",
    transmission: "Automatic",
    fuel_type: "Petrol",
    seats: 4,
    description:
      "Combines a handcrafted AMG 4.0L V8 twin-turbo with an electric motor for massive performance and supreme driving dynamics.",
    is_available: true,
  },
  {
    id: "7",
    name: "Audi R8 V10 Performance",
    brand: "Audi",
    type: "Supercar",
    price_per_day: 480,
    image_url:
      "https://www.luxurylifestylemag.co.uk/wp-content/uploads/2020/04/A1813694_large.jpg",
    transmission: "Automatic",
    fuel_type: "Petrol",
    seats: 2,
    description:
      "Mid-engine 5.2L V10 supercar with quattro all-wheel drive and blistering acceleration — an icon of Audi performance.",
    is_available: true,
  },
];

export const BOOKING_STEPS = [
  {
    number: "01",
    title: "Choose your car",
    description: "Pick the premium model that suits your style and plans.",
  },
  {
    number: "02",
    title: "Contact Us",
    description: "Reach out and reserve your dates.",
  },
  {
    number: "03",
    title: "Confirm & Secure",
    description: "Send documents, pay deposit and we'll handle the rest.",
  },
  {
    number: "04",
    title: "Drive Away",
    description: "We deliver the car to your desired location.",
  },
];
