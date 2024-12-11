"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { connectToWebSocket, CoinData } from "@/services/webSocket";

export default function CoinSearch() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const ws = connectToWebSocket(
      (formattedData) => setCoins(formattedData),
      (error) => console.error(error)
    );

    return () => {
      ws.close();
    };
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const topVolumeCoins = coins
    .slice()
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);

  return (
    <div className="bg-gray-800 p-4 rounded-md text-white text-xs">
      <div className="relative">
        {/* 돋보기 아이콘 */}
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaSearch />
        </span>
        {/* 검색 인풋 */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-10 p-2 rounded-md bg-transparent text-white border border-gray-500 focus:border-yellow-500 hover:border-yellow-500 outline-none transition-colors duration-300"
          placeholder="Search coins..."
        />
        {/* X 버튼 */}
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors duration-300"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-bold mb-2">
          {query ? "Search Results" : "Top Search"}
        </h3>
        <div className="bg-gray-900 p-4 rounded-md shadow-lg">
          <div className="grid grid-cols-3 text-gray-400 font-bold pb-2 border-b border-gray-700">
            <span>Coin</span>
            <span className="text-right">Volume</span>
            <span className="text-right">Change (%)</span>
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {(query ? filteredCoins : topVolumeCoins).map((coin) => (
              <li
                key={coin.symbol}
                className="grid grid-cols-[1fr,1fr,1fr] items-center py-2 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://www.binance.com/en/trade/${coin.symbol}?type=spot`,
                    "_blank"
                  )
                }
              >
                <span className="text-gray-300">{coin.symbol}</span>
                <span className="text-right text-gray-400 truncate">
                  {coin.volume.toLocaleString()}
                </span>
                <span
                  className={`text-right ${
                    coin.priceChangePercent > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.priceChangePercent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
