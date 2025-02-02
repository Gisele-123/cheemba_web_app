'use client';
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)


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

              <form className="space-y-6">
                <div className="space-y-4">
                  <input id="email" type="email" placeholder="Email" className="font-spaceGrotesk border-b border-gray-300 w-full py-2 bg-gray-100" />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="font-spaceGrotesk border-b border-gray-300 w-full py-2 bg-gray-100"
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
                  <Link href="/forgot-password" className="underline text-sm font-spaceGrotesk">
                    Forgot Password
                  </Link>
                </div>

                <Link href="/home" className="flex items-center justify-center"><Button className="h-11 w-full bg-black text-white hover:bg-black/90 font-spaceGrotesk">Log in</Button></Link>

                <p className="text-center text-sm font-spaceGrotesk">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline font-bold font-spaceGrotesk">
                    Sign up for free
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

