import { create } from 'zustand';
import { Appointment, Barber, Service } from '../services/types';
import { MOCK_APPOINTMENTS } from '../services/mockData';

interface BookingDraft {
  barber: Barber | null;
  service: Service | null;
  date: string | null;
  time: string | null;
}

interface BookingState {
  appointments: Appointment[];
  draft: BookingDraft;
  setDraftBarber: (barber: Barber) => void;
  setDraftService: (service: Service) => void;
  setDraftDate: (date: string) => void;
  setDraftTime: (time: string) => void;
  resetDraft: () => void;
  confirmBooking: () => Promise<Appointment>;
  cancelAppointment: (id: string) => void;
}

const emptyDraft: BookingDraft = {
  barber: null,
  service: null,
  date: null,
  time: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  appointments: MOCK_APPOINTMENTS,
  draft: emptyDraft,

  setDraftBarber: (barber) => set((s) => ({ draft: { ...s.draft, barber } })),
  setDraftService: (service) => set((s) => ({ draft: { ...s.draft, service } })),
  setDraftDate: (date) => set((s) => ({ draft: { ...s.draft, date } })),
  setDraftTime: (time) => set((s) => ({ draft: { ...s.draft, time } })),
  resetDraft: () => set({ draft: emptyDraft }),

  confirmBooking: async () => {
    await new Promise((r) => setTimeout(r, 1200));
    const { draft } = get();
    const newApt: Appointment = {
      id: 'apt' + Date.now(),
      clientId: 'u1',
      barberId: draft.barber!.id,
      barber: draft.barber!,
      serviceId: draft.service!.id,
      service: draft.service!,
      date: draft.date!,
      time: draft.time!,
      status: 'confirmed',
      depositPaid: true,
      depositAmount: Math.round(draft.service!.price * 0.3),
      totalAmount: draft.service!.price,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ appointments: [newApt, ...s.appointments], draft: emptyDraft }));
    return newApt;
  },

  cancelAppointment: (id) =>
    set((s) => ({
      appointments: s.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' } : a
      ),
    })),
}));
