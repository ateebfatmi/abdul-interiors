import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Atelier Showcase — Tubelight Navbar",
  description: "Luxury interior showcase featuring animated Tubelight Navbar",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0e0e0c] text-[#f4efe8]">{children}</body>
    </html>
  )
}
