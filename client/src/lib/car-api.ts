import { supabase } from "./supabase";
import { Database } from "../types/supabase";

type Car = Database["public"]["Tables"]["cars"]["Row"];
type NewsPost = Database["public"]["Tables"]["news"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type CarRequest = Database["public"]["Tables"]["car_requests"]["Insert"];

export async function getCars(): Promise<Car[]> {
  const { data, error } = await supabase.from("cars").select("*");

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  return (data as Car[]) || [];
}

export async function getCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching car by id:", error);
    return null;
  }

  return data as Car;
}

export async function createCar(
  car: Database["public"]["Tables"]["cars"]["Insert"],
): Promise<Car | null> {
  const { data, error } = await supabase
    .from("cars")
    .insert([car] as any)
    .select()
    .single();

  if (error) {
    console.error("Error creating car:", error);
    return null;
  }

  return data as Car;
}

export async function requestCar(request: CarRequest): Promise<boolean> {
  const { error } = await (supabase.from("car_requests") as any).insert([
    request,
  ]);

  if (error) {
    console.error("Error submitting car request:", error);
    return false;
  }

  return true;
}

export async function getNews(): Promise<NewsPost[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }

  return (data as NewsPost[]) || [];
}

export async function createNewsPost(
  post: Database["public"]["Tables"]["news"]["Insert"],
): Promise<NewsPost | null> {
  const { data, error } = await supabase
    .from("news")
    .insert([post] as any)
    .select()
    .single();

  if (error) {
    console.error("Error creating news post:", error);
    return null;
  }

  return data as NewsPost;
}

export async function createBooking(
  booking: Database["public"]["Tables"]["bookings"]["Insert"],
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .insert([booking] as any)
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return null;
  }

  return data as Booking;
}
