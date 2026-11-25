import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxeStay | Room Booking App",
  description: "Browse rooms, calculate stay prices dynamically, and book directly with Supabase and Next.js TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
