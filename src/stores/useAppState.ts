import { create } from "zustand";

interface Order {
  price: number;
  amount: number;
}

interface AppState {
  selectedOrder: Order | null;
  bids: Order[];
  asks: Order[];
  setSelectedOrder: (order: Order | null) => void;
  setOrderBookData: (bids: Order[], asks: Order[]) => void;
}

export const useAppState = create<AppState>((set) => ({
  selectedOrder: null,
  bids: [],
  asks: [],
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setOrderBookData: (bids, asks) => set({ bids, asks }),
}));
