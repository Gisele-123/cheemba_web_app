"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import Link from "next/link"


export default function VerificationPage() {

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

          {/* Right Section - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-manrope font-bold tracking-tight">Verification code</h1>
                <p className="font-spaceGrotesk">Verify using email or phone number</p>
              </div>

              <form className="space-y-8">

                <div className="mt-12 mb-4">

                  <div className="space-y-4">
                    <input id="email" type="email" placeholder="Email" className="font-spaceGrotesk border-b border-gray-300 w-full py-2 bg-gray-100" />
                  </div>

                  <div className="space-y-4">
                    <input id="phone" type="tel" placeholder="Phone" className="font-spaceGrotesk border-b border-gray-300 w-full py-2 bg-gray-100" />
                  </div>

                </div>

                <Link href='/verifycode' className='flex  items-center justify-center'>
                  <Button className="h-11 w-full bg-black text-white hover:bg-black/90 font-spaceGrotesk">verify</Button>
                </Link>


              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

