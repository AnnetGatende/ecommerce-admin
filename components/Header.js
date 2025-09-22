 
"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-bold">
        My App
      </Link>
      <div className="flex items-center gap-4">
        {!isSignedIn ? (
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              Hello, {user?.firstName}!
            </span>
            <UserButton />
          </>
        )}
      </div>
    </header>
  );
}