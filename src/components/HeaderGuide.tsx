"use client";

import { useEffect, useRef, useState } from "react";
import { connectMarketWebSocket, MarketData } from "@/services/webSocket";

export default function HeaderGuide() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const prevPrice = useRef<number | null>(null);
  const [priceColor, setPriceColor] = useState<string>("text-gray-400");

  useEffect(() => {
    const ws = connectMarketWebSocket(
      "btcusdt",
      (updatedData) => {
        setMarketData(updatedData);

        if (prevPrice.current !== null) {
          if (updatedData.price > prevPrice.current) {
            setPriceColor("text-green-500"); // 상승
          } else if (updatedData.price < prevPrice.current) {
            setPriceColor("text-red-500"); // 하락
          }
        }

        prevPrice.current = updatedData.price;
      },
      (error) => console.error("WebSocket error:", error)
    );

    return () => {
      ws.close();
    };
  }, []);

  if (!marketData) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
        {/* Symbol */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white">BTC/USDT</h1>
          <p className="text-sm text-gray-400">Bitcoin Price</p>
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <span className={`text-xl font-semibold ${priceColor}`}>
            ${marketData.price.toFixed(2)}
          </span>
        </div>

        {/* 24h Change */}
        <div className="flex flex-col">
          <span className="uppercase text-xs text-gray-400">24h Change</span>
          <p
            className={`${
              marketData.change >= 0 ? "text-green-500" : "text-red-500"
            } text-sm font-semibold`}
          >
            {marketData.change >= 0 ? "+" : ""}
            {marketData.change.toFixed(2)}%
          </p>
        </div>

        {/* 24h High */}
        <div className="flex flex-col">
          <span className="uppercase text-xs text-gray-400">24h High</span>
          <p className="text-gray-100 font-semibold">
            ${marketData.high.toFixed(2)}
          </p>
        </div>

        {/* 24h Low */}
        <div className="flex flex-col">
          <span className="uppercase text-xs text-gray-400">24h Low</span>
          <p className="text-gray-100 font-semibold">
            ${marketData.low.toFixed(2)}
          </p>
        </div>

        {/* 24h Volume */}
        <div className="flex flex-col">
          <span className="uppercase text-xs text-gray-400">24h Volume</span>
          <p className="text-gray-100 font-semibold">
            {marketData.volume.toFixed(2)} BTC
          </p>
        </div>
      </div>
    </div>
  );
}
