// ==================== AUTH ====================
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
  role: 'client' | 'barber' | 'admin';
  createdAt: string;
}

// ==================== BARBERS ====================
export interface Barber {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  schedule: Record<string, TimeSlot[]>;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// ==================== SERVICES ====================
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  icon: string;
  category: 'coupe' | 'barbe' | 'soin' | 'pack';
}

// ==================== APPOINTMENTS ====================
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  barber: Barber;
  serviceId: string;
  service: Service;
  date: string;
  time: string;
  status: AppointmentStatus;
  depositPaid: boolean;
  depositAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

// ==================== PRODUCTS ====================
export type ProductCategory = 'soins' | 'styling' | 'accessoires';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  stock: number;
  brand: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ==================== ORDERS ====================
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  clientId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentIntentId?: string;
  createdAt: string;
}

// ==================== BARB'DRIVER ====================
export interface BarbDriverRequest {
  id: string;
  clientId: string;
  address: Address;
  serviceId: string;
  service: Service;
  barberId?: string;
  barber?: Barber;
  scheduledDate: string;
  scheduledTime: string;
  estimatedArrival?: string;
  travelFee: number;
  depositAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'en_route' | 'arrived' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// ==================== NOTIFICATIONS ====================
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'appointment' | 'order' | 'promo' | 'driver';
  read: boolean;
  createdAt: string;
}

// ==================== PROMOTIONS ====================
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percent' | 'fixed';
  validUntil: string;
  image?: string;
  code?: string;
}
