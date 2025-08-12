import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FSM Engine",
  description: "Create and Manage Finite State Machines",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased dark">{children}</body>
    </html>
  );
}
