export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Admin: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Splash: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Booking: undefined;
  Shop: undefined;
  Driver: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
};

export type BookingStackParamList = {
  BookingMain: undefined;
  SelectBarber: undefined;
  SelectService: undefined;
  SelectDateTime: undefined;
  BookingConfirm: undefined;
  BookingSuccess: undefined;
};

export type ShopStackParamList = {
  ShopMain: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: undefined;
};

export type DriverStackParamList = {
  DriverMain: undefined;
  DriverForm: undefined;
  DriverConfirm: undefined;
  DriverTracking: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminAppointments: undefined;
  AdminEmployees: undefined;
  AdminProducts: undefined;
  AdminClients: undefined;
};
