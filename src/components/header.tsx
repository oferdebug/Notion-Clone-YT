"use client";
import { Sparkles } from 'lucide-react';

/** @format */
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

import Breadcrumbs from './Breadcrumbs';
import ThemeToggle from './ThemeToggle';

function Header() {
  const { user } = useUser();
  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-md border-b-2 border-primary/20 shadow-lg">
      <div className="flex items-center justify-between px-8 py-5">
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                {user?.firstName}&apos;s Space
              </h1>
              <p className="text-xs text-muted-foreground">Welcome back!</p>
            </div>
          </div>
        )}
        <Breadcrumbs />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-xl ring-2 ring-primary/50 hover:ring-primary transition-all"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
export default Header;