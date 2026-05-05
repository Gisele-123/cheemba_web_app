'use client';
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { supabase } from "@/lib/supabase/client";
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_ROLES } from "@/lib/auth/constants";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const seedResponse = await fetch("/api/admin/seed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
          }),
        });

        if (!seedResponse.ok) {
          const seedData = await seedResponse.json();
          throw new Error(seedData.message || "Failed to prepare admin account.");
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || "Invalid credentials.");
      }

      const role = String(data.user.user_metadata?.role || "");
      if (normalizedEmail === ADMIN_EMAIL && role !== APP_ROLES.ADMIN) {
        throw new Error("Admin role is missing on this account.");
      }

      Swal.fire({
        icon: 'success',
        title: 'Login successful',
        showConfirmButton: true,
        timer: 900,
      }).then(() => {
        router.push('/home');
        router.refresh();
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      Swal.fire({
        icon: 'error',
        title: 'Sign in failed',
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Logo Section */}
      <div className="px-10 py-6">
        <div className="flex items-center gap-4">
          <Image src="/assets/logo.png" alt="Cheemba Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-black-xl font-roboto font-bold">Chee-<span className="text-blue-600 font-roboto font-bold">mba</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex min-h-[calc(100vh-88px)] items-center justify-center px-4">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2">
          {/* Left Section - Illustration */}
          <div className="relative hidden lg:block">
            <Image
              src="/assets/frame.png"
              alt="Login Illustration"
              width={600}
              height={600}
              className="h-auto w-full"
              priority
            />
          </div>

          {/* Right Section - Login Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-manrope font-bold tracking-tight">Welcome back, Cheemba</h1>
                <p className="font-spaceGrotesk">Welcome back! Please enter your details.</p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="font-spaceGrotesk border-b border-gray-300 w-full px-3 py-3 bg-gray-100 rounded-t-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="font-spaceGrotesk border-b border-gray-300 w-full px-3 py-3 bg-gray-100 rounded-t-md"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-2 py-2 hover:bg-transparent border-gray-300"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" className="bg-white border-gray-300" />
                    <label
                      htmlFor="terms"
                      className="font-spaceGrotesk text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Terms & Conditions
                    </label>
                  </div>
                  <span className="text-xs text-slate-600">Sign-in only demo access</span>
                </div>

                <Button className="h-11 w-full bg-black text-white hover:bg-black/90 font-spaceGrotesk" type="submit" disabled={loading}>
                  {loading ? 'Signing In...' : 'Log In'}
                </Button>

                <p className="text-center text-sm font-spaceGrotesk">
                  Accounts are created by an admin only.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
