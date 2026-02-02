import { faker } from "@faker-js/faker";

// Types mirroring Supabase structure
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  phone?: string;
  role: "customer" | "admin";
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  plate_number: string;
  status: "available" | "rented" | "maintenance";
  thumbnail_url: string;
  images: string[];
  transmission: "Automatic" | "Manual";
  fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  seats: number;
  description: string;
  created_at: string;

  // Pricing
  rates: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  price_per_day: number; // Keep for backward compatibility (alias for rates.daily)
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  rate_applied: "daily" | "weekly" | "monthly";
  created_at: string;

  // Relations (mocked)
  user?: User;
  car?: Car;
}

export interface Activity {
  id: string;
  type: "booking_new" | "booking_cancelled" | "car_added" | "user_joined";
  message: string;
  time: string;
  user?: { name: string; avatar: string };
}

export interface Notification {
  id: string;
  type: "booking_new" | "info" | "alert";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  bookingId?: string;
}

// Generate Mock Data
export const NOTIFICATIONS: Notification[] = []; // Start empty or pre-populate if needed

export const USERS: User[] = Array.from({ length: 45 }).map(() => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  full_name: faker.person.fullName(),
  avatar_url: faker.image.avatar(),
  created_at: faker.date.past().toISOString(),
  phone: faker.phone.number(),
  role: "customer",
}));

const CARS: Car[] = Array.from({ length: 30 }).map(() => {
  const dailyPrice = parseInt(faker.commerce.price({ min: 50, max: 300 }));
  return {
    id: faker.string.uuid(),
    name: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.date.past().getFullYear(),
    plate_number: faker.vehicle.vrm(),
    status: faker.helpers.arrayElement(["available", "rented", "maintenance"]),
    thumbnail_url: faker.image.url(),
    images: Array.from({ length: 3 }).map(() => faker.image.url()),
    transmission: faker.helpers.arrayElement(["Automatic", "Manual"]),
    fuel_type: faker.helpers.arrayElement([
      "Petrol",
      "Diesel",
      "Electric",
      "Hybrid",
    ]),
    seats: faker.helpers.arrayElement([2, 4, 5, 7]),
    description: faker.lorem.paragraph(),
    created_at: faker.date.past().toISOString(),
    rates: {
      daily: dailyPrice,
      weekly: Math.floor(dailyPrice * 0.85), // 15% discount
      monthly: Math.floor(dailyPrice * 0.7), // 30% discount
    },
    price_per_day: dailyPrice,
  };
});

const BOOKINGS: Booking[] = Array.from({ length: 80 }).map(() => {
  const user = faker.helpers.arrayElement(USERS);
  const car = faker.helpers.arrayElement(CARS);
  const start = faker.date.recent();
  const end = faker.date.future({ refDate: start });
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  let rateType: "daily" | "weekly" | "monthly" = "daily";
  let dailyRate = car.rates.daily;

  if (days >= 30) {
    rateType = "monthly";
    dailyRate = car.rates.monthly;
  } else if (days >= 7) {
    rateType = "weekly";
    dailyRate = car.rates.weekly;
  }

  return {
    id: faker.string.uuid(),
    user_id: user.id,
    car_id: car.id,
    start_date: start.toISOString(),
    end_date: end.toISOString(),
    total_price: days * dailyRate,
    status: faker.helpers.arrayElement([
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ]),
    rate_applied: rateType,
    created_at: faker.date.past().toISOString(),
    user,
    car,
  };
});

const ACTIVITIES: Activity[] = Array.from({ length: 15 }).map(() => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement([
    "booking_new",
    "booking_cancelled",
    "car_added",
    "user_joined",
  ]),
  message: faker.lorem.sentence(),
  time: faker.date.recent().toISOString(),
  user: {
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
  },
}));

// Mock API
export const mockApi = {
  cars: {
    getAll: async ({
      page = 1,
      limit = 10,
    }: { page?: number; limit?: number } = {}) => {
      await new Promise((r) => setTimeout(r, 600));
      const start = (page - 1) * limit;
      return {
        data: CARS.slice(start, start + limit),
        total: CARS.length,
      };
    },
    getById: async (id: string) => {
      await new Promise((r) => setTimeout(r, 400));
      return CARS.find((c) => c.id === id);
    },
    create: async (data: Partial<Car>) => {
      await new Promise((r) => setTimeout(r, 800));
      const newCar = {
        ...data,
        id: faker.string.uuid(),
        created_at: new Date().toISOString(),
      } as Car;
      CARS.unshift(newCar);
      return newCar;
    },
    update: async (id: string, data: Partial<Car>) => {
      await new Promise((r) => setTimeout(r, 600));
      const index = CARS.findIndex((c) => c.id === id);
      if (index > -1) {
        CARS[index] = { ...CARS[index], ...data };
        return CARS[index];
      }
      throw new Error("Car not found");
    },
    delete: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
      const index = CARS.findIndex((c) => c.id === id);
      if (index !== -1) CARS.splice(index, 1);
    },
    getAvailableCars: async ({
      startDate,
      endDate,
    }: {
      startDate: string;
      endDate: string;
    }) => {
      await new Promise((r) => setTimeout(r, 600));
      const start = new Date(startDate);
      const end = new Date(endDate);

      return CARS.filter((car) => {
        const hasConflict = BOOKINGS.some(
          (b) =>
            b.car_id === car.id &&
            (b.status === "confirmed" || b.status === "pending") && // Be safe, block pending too? User req: "existing APPROVED bookings" usually blocks confirmed. But often pending blocks too to prevent race conditions. Let's block both for simpler UX or strictly confirmed. The Prompt said: "Validate selected dates against existing APPROVED bookings". OK, so maybe pending doesn't block? logic: "If date range overlaps: Block booking action". Let's block confirmed only for now to follow prompt strictly, OR block pending if we want to be safe. Let's stick to 'confirmed' as requested, but realized typically pending also reserves. I'll block 'confirmed' AND 'pending' to be safe against double booking unless rejected.
            // Actually prompt says: "Validate selected dates against existing APPROVED bookings". accepted status is 'confirmed'.
            // However, "Prevent double booking at UI + logic level".
            // Let's block 'confirmed' bookings.
            b.status === "confirmed" &&
            new Date(b.start_date) < end &&
            new Date(b.end_date) > start,
        );
        return !hasConflict;
      });
    },
  },
  bookings: {
    getAll: async ({
      page = 1,
      limit = 10,
    }: { page?: number; limit?: number } = {}) => {
      await new Promise((r) => setTimeout(r, 600));
      const start = (page - 1) * limit;
      return {
        data: BOOKINGS.slice(start, start + limit),
        total: BOOKINGS.length,
      };
    },
    delete: async (id: string) => {
      await new Promise((r) => setTimeout(r, 500));
      const index = BOOKINGS.findIndex((b) => b.id === id);
      if (index !== -1) BOOKINGS.splice(index, 1);
    },
    approve: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
      const booking = BOOKINGS.find((b) => b.id === id);
      if (!booking) throw new Error("Booking not found");

      // Check for conflicts
      const hasConflict = BOOKINGS.some(
        (b) =>
          b.id !== id &&
          b.car_id === booking.car_id &&
          b.status === "confirmed" &&
          new Date(b.start_date) < new Date(booking.end_date) &&
          new Date(b.end_date) > new Date(booking.start_date),
      );

      if (hasConflict) {
        throw new Error("This car is already booked for the selected dates.");
      }

      booking.status = "confirmed";
      return booking;
    },
    reject: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
      const booking = BOOKINGS.find((b) => b.id === id);
      if (!booking) throw new Error("Booking not found");

      booking.status = "cancelled";
      return booking;
    },
    create: async (data: Partial<Booking>) => {
      await new Promise((r) => setTimeout(r, 800));

      // Validation Check
      if (data.car_id && data.start_date && data.end_date) {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const hasConflict = BOOKINGS.some(
          (b) =>
            b.car_id === data.car_id &&
            b.status === "confirmed" &&
            new Date(b.start_date) < end &&
            new Date(b.end_date) > start,
        );
        if (hasConflict)
          throw new Error("Car is not available for selected dates");
      }

      const newBooking = {
        ...data,
        id: faker.string.uuid(),
        status: "pending",
        created_at: new Date().toISOString(),
        user: USERS[0], // Mock current user
        car: CARS.find((c) => c.id === data.car_id),
      } as Booking;

      BOOKINGS.unshift(newBooking);

      // Trigger Notification
      NOTIFICATIONS.unshift({
        id: faker.string.uuid(),
        type: "booking_new",
        title: "New Booking Request",
        message: `${newBooking.user?.full_name} requested ${newBooking.car?.name}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        bookingId: newBooking.id,
      });

      return newBooking;
    },
  },
  notifications: {
    getAll: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return NOTIFICATIONS;
    },
    markRead: async (id: string) => {
      const n = NOTIFICATIONS.find((n) => n.id === id);
      if (n) n.isRead = true;
    },
    markAllRead: async () => {
      NOTIFICATIONS.forEach((n) => (n.isRead = true));
    },
  },
  customers: {
    getAll: async ({
      page = 1,
      limit = 10,
    }: { page?: number; limit?: number } = {}) => {
      await new Promise((r) => setTimeout(r, 600));
      const start = (page - 1) * limit;
      const paginatedUsers = USERS.slice(start, start + limit).map((user) => {
        const userBookings = BOOKINGS.filter((b) => b.user_id === user.id);
        const totalSpent = userBookings.reduce(
          (sum, b) => sum + b.total_price,
          0,
        );
        return {
          ...user,
          total_bookings: userBookings.length,
          total_spent: totalSpent,
        };
      });

      return {
        data: paginatedUsers,
        total: USERS.length,
      };
    },
  },
  stats: {
    getDashboard: async () => {
      await new Promise((r) => setTimeout(r, 800));
      return {
        revenue: BOOKINGS.reduce(
          (acc, b) =>
            acc +
            (["completed", "confirmed"].includes(b.status) ? b.total_price : 0),
          0,
        ),
        bookings: BOOKINGS.length,
        activeFleet: CARS.filter((c) => c.status === "rented").length,
        newCustomers: USERS.filter(
          (u) =>
            u.created_at &&
            new Date(u.created_at) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        ).length,
      };
    },
    getRecentActivity: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return ACTIVITIES.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      );
    },
  },
  auth: {
    changePassword: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await new Promise((r) => setTimeout(r, 1000));
      if (!currentPassword || !newPassword) {
        throw new Error("All fields are required");
      }
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      // In mock, we just approve it
      return { success: true };
    },
  },
};
