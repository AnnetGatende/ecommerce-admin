"use client";

import { UserButton, SignedIn } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      <h1 className="text-xl font-bold">Ecommerce-Annet</h1>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </nav>
  );
}
