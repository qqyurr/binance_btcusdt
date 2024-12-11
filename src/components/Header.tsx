"use client";

import Image from "next/image";
import BinanceLogo from "@/image/Binance_logo.svg.png";

export default function Header() {
  return (
    <header className="bg-gray-800 p-4">
      <div className="flex items-center space-x-4">
        <div>
          <Image src={BinanceLogo} alt="Binance Logo" height={20} />
        </div>
      </div>
    </header>
  );
}
