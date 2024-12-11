import Providers from "@/components/Providers";
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-900 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
