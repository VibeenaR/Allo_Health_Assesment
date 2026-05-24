import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Allo Reservation System",
  description: "High-concurrency inventory locking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: '20px', backgroundColor: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  );
}