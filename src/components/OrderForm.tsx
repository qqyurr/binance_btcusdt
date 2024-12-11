"use client";

import { useState, useEffect } from "react";
import { useAppState } from "@/stores/useAppState";

interface InputFieldProps {
  label: string;
  value: number | "";
  onChange: (value: number) => void;
  step: number;
  unit: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

const InputField = ({
  label,
  value,
  onChange,
  step,
  unit,
  onIncrement,
  onDecrement,
}: InputFieldProps) => (
  <div className="my-2">
    <h4 className="font-bold mb-2">{label}</h4>
    <div className="flex items-center relative border border-gray-700 rounded-md bg-gray-900">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        className="flex-1 px-4 py-2 bg-transparent text-white placeholder-gray-500 outline-none pr-16"
        placeholder={label}
      />
      <div className="absolute right-2 flex flex-col">
        <button
          type="button"
          onClick={onIncrement}
          className="text-gray-500 hover:text-green-500"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onDecrement}
          className="text-gray-500 hover:text-green-500"
        >
          ▼
        </button>
      </div>
      <span className="absolute right-4 text-gray-400 px-4">{unit}</span>
    </div>
  </div>
);

export default function OrderForm() {
  const { selectedOrder } = useAppState();
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [buyAmount, setBuyAmount] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");
  const [sellAmount, setSellAmount] = useState<number | "">("");

  useEffect(() => {
    if (selectedOrder) {
      setBuyPrice(selectedOrder.price);
      setBuyAmount(selectedOrder.amount);
      setSellPrice(selectedOrder.price);
      setSellAmount(selectedOrder.amount);
    }
  }, [selectedOrder]);

  const handleIncrement = (
    setState: React.Dispatch<React.SetStateAction<number | "">>,
    step: number
  ) => {
    setState((prev) => (prev === "" ? step : +(prev + step).toFixed(5)));
  };

  const handleDecrement = (
    setState: React.Dispatch<React.SetStateAction<number | "">>,
    step: number
  ) => {
    setState((prev) => (prev === "" ? 0 : +(prev - step).toFixed(5)));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md mt-4">
      <h3 className="text-lg font-bold mb-4">Order Form</h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Buy Section */}
        <div>
          <InputField
            label="Buy Price"
            value={buyPrice}
            onChange={setBuyPrice}
            step={0.01}
            unit="USDT"
            onIncrement={() => handleIncrement(setBuyPrice, 0.01)}
            onDecrement={() => handleDecrement(setBuyPrice, 0.01)}
          />
          <InputField
            label="Buy Amount"
            value={buyAmount}
            onChange={setBuyAmount}
            step={0.00001}
            unit="BTC"
            onIncrement={() => handleIncrement(setBuyAmount, 0.00001)}
            onDecrement={() => handleDecrement(setBuyAmount, 0.00001)}
          />
          <button className="w-full mt-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            Buy BTC
          </button>
        </div>

        {/* Sell Section */}
        <div>
          <InputField
            label="Sell Price"
            value={sellPrice}
            onChange={setSellPrice}
            step={0.01}
            unit="USDT"
            onIncrement={() => handleIncrement(setSellPrice, 0.01)}
            onDecrement={() => handleDecrement(setSellPrice, 0.01)}
          />
          <InputField
            label="Sell Amount"
            value={sellAmount}
            onChange={setSellAmount}
            step={0.00001}
            unit="BTC"
            onIncrement={() => handleIncrement(setSellAmount, 0.00001)}
            onDecrement={() => handleDecrement(setSellAmount, 0.00001)}
          />
          <button className="w-full mt-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
            Sell BTC
          </button>
        </div>
      </div>
    </div>
  );
}
