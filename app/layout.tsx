import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppProvider } from "@/context/AppContext"
import { UserProvider } from "@/context/UserContext"
import PWARegister from "@/components/PWARegister"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SafeNow - Emergency Response System",
  description: "Offline emergency response and first aid guide with voice controls",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeNow",
  },
}

export const viewport: Viewport = {
  themeColor: "#dc2626",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AppProvider>
          <UserProvider>{children}</UserProvider>
        </AppProvider>
        <PWARegister />
        <Analytics />
      </body>
    </html>
  )
}
