"use client";

import React, { useEffect } from "react";
import { connectOrderBookWebSocket } from "@/services/webSocket";
import { useAppState } from "@/stores/useAppState";

export default function OrderBook() {
  const { bids, asks, setOrderBookData, setSelectedOrder } = useAppState();

  useEffect(() => {
    const ws = connectOrderBookWebSocket(
      "btcusdt",
      (newBids, newAsks) => {
        setOrderBookData(newBids.slice(0, 10), newAsks.slice(0, 10));
      },
      (error) => console.error("WebSocket error:", error)
    );

    return () => {
      ws.close();
    };
  }, [setOrderBookData]);

  return (
    <div className="rounded-md text-white max-w-md text-sm">
      <div className="grid grid-cols-3 text-gray-400 pb-2 border-b border-gray-700">
        <span>Price (USDT)</span>
        <span>Amount (BTC)</span>
        <span>Total</span>
      </div>

      <div className="overflow-y-auto max-h-96">
        <ul className="divide-y divide-gray-700 mb-4">
          {asks.map((order, idx) => (
            <li
              key={idx}
              className="grid grid-cols-3 py-1 text-red-500 hover:bg-gray-800 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <span>${order.price.toFixed(2)}</span>
              <span>{order.amount.toFixed(4)}</span>
              <span>{(order.price * order.amount).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <ul className="divide-y divide-gray-700">
          {bids.map((order, idx) => (
            <li
              key={idx}
              className="grid grid-cols-3 py-1 text-green-500 hover:bg-gray-800 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <span>${order.price.toFixed(2)}</span>
              <span>{order.amount.toFixed(4)}</span>
              <span>{(order.price * order.amount).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
