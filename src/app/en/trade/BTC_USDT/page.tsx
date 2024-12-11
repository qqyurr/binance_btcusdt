"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInitialPrice } from "@/services/binanceAPI";
import { useAppState } from "@/stores/useAppState";
import Header from "@/components/Header";
import OrderBook from "@/components/OrderBook";
import TradeChart from "@/components/TradeChart";
import CoinSearch from "@/components/CoinSearch";
import HeaderGuide from "@/components/HeaderGuide";
import OrderForm from "@/components/OrderForm";

export default function BTCUSDTPage() {
  const { setSelectedOrder } = useAppState();

  const { isLoading, isError } = useQuery({
    queryKey: ["initialPrice"],
    queryFn: fetchInitialPrice,
    onSuccess: (data) => setSelectedOrder(data),
  });

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Failed to fetch data.</div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />

      <main className="w-full p-4 grid lg:grid-cols-12 gap-6 text-sm">
        <div className="lg:col-span-9 space-y-6">
          <HeaderGuide />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-4 bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-sm font-bold mb-4">Order Book</h2>
              <OrderBook />
            </section>

            <section className="lg:col-span-8 bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-sm font-bold mb-4">Trading Chart</h2>
              <TradeChart />
              <OrderForm />
            </section>
          </div>
        </div>

        <section className="lg:col-span-3 bg-gray-800 p-4 rounded-lg shadow-md">
          <CoinSearch />
        </section>
      </main>
    </div>
  );
}
