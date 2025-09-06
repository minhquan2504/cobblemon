import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "@/types/session"
import { Providers } from "@/components/providers/Providers"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Harry Cobblemon - Trung tâm thông tin Cobblemon",
  description: "Website tra cứu Pokédex và luật giải đấu cho cộng đồng Harry Cobblemon.",
  keywords: ["pokemon", "cobblemon", "tournament", "pokedex", "ev training", "pokemon vietnam"],
  authors: [{ name: "Harry Cobblemon" }],
  openGraph: {
    title: "Harry Cobblemon",
    description: "Trung tâm tra cứu Cobblemon cho cộng đồng",
    type: "website",
    locale: "vi_VN",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}