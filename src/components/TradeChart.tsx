"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { fetchCandlestickData, CandlestickData } from "@/services/binanceAPI";
import { connectStreamCandlestickData } from "@/services/webSocket";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const timeIntervals = ["1s", "1m", "5m", "15m", "1h", "4h", "1d", "1w"];

export default function TradeChart() {
  const [interval, setInterval] = useState<string>("1m");
  const [liveData, setLiveData] = useState<CandlestickData[]>([]);
  const [isWebSocketLoading, setIsWebSocketLoading] = useState<boolean>(false);

  useEffect(() => {
    if (interval !== "1s") return;

    setIsWebSocketLoading(true);

    const ws = connectStreamCandlestickData(
      "btcusdt",
      interval,
      (newCandle) => {
        setLiveData((prev) => [...prev.slice(-99), newCandle]);
        setIsWebSocketLoading(false);
      },
      (error) => console.error(error)
    );

    return () => {
      ws.close();
    };
  }, [interval]);

  const {
    data: restData,
    isLoading,
    isError,
  } = useQuery<CandlestickData[]>({
    queryKey: ["candlestickData", "BTCUSDT", interval],
    queryFn: () => fetchCandlestickData("BTCUSDT", interval),
    refetchInterval: interval !== "1s" ? 60000 : false,
    enabled: interval !== "1s",
  });

  const combinedData =
    interval === "1s"
      ? [...(restData || []), ...liveData].slice(-100)
      : restData || [];

  const chartOptions: ApexOptions = {
    chart: {
      type: "candlestick",
      height: 400,
      toolbar: { show: false },
      background: "transparent",
    },
    grid: {
      borderColor: "#334155",
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#cbd5e1",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        style: {
          colors: "#cbd5e1",
          fontSize: "12px",
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#22c55e",
          downward: "#ef4444",
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  if (
    (isLoading && interval !== "1s") ||
    (interval === "1s" && isWebSocketLoading)
  ) {
    return <p className="text-white">Loading...</p>;
  }
  if (isError) return <p className="text-red-500">Error loading data</p>;

  const series = [
    {
      data: combinedData.map((candle) => ({
        x: candle.time,
        y: [candle.open, candle.high, candle.low, candle.close],
      })),
    },
  ];

  return (
    <div className="shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {timeIntervals.map((int) => (
            <button
              key={int}
              onClick={() => setInterval(int)}
              className={`px-3 py-1 rounded ${
                interval === int
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {int}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="candlestick"
          height={400}
        />
      </div>
    </div>
  );
}
