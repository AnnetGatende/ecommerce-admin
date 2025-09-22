import { ClerkProvider } from "@clerk/nextjs"

import type { Metadata } from "next"

import "./globals.css"

import { ModalProvider } from "@/providers/modal-provider"

export const metadata: Metadata = {
  title: "Ecommerce-Annet",
  description: "Your modern e-commerce admin dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className="bg-gray-900">
        <ModalProvider/>
          {children}
        
      </body>
    </html>
    </ClerkProvider>
  )
}