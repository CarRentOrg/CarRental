export interface Car {
    id: string;
    name: string;
    brand: string;
    type: string;
    price_per_day: number;
    image_url: string;
    transmission: 'Automatic' | 'Manual';
    fuel_type: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
    seats: number;
    description: string;
    is_available: boolean;
    created_at?: string;
}

export interface Booking {
    id: string;
    car_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    user_name: string;
    user_email: string;
    user_phone: string;
    created_at?: string;
    car?: Car;
}
