"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Ecommerce-Annet</h1>
      <p className="mb-8 text-lg">Your modern e-commerce admin dashboard.</p>

      <SignedOut>
        <div className="flex gap-4">
          <Link href="/sign-in" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            Sign In
          </Link>
          <Link href="/sign-up" className="px-6 py-2 bg-gray-200 text-black rounded-lg">
            Sign Up
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">You are signed in 🎉</p>
          <Link href="/dashboard" className="px-6 py-2 bg-green-600 text-white rounded-lg">
            Go to Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </main>
  );
}
