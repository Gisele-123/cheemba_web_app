"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import Link from "next/link"
import Swal from "sweetalert2"
import axios from "axios"

export default function CodePage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false);

  // Function to handle form submission and API call
  const handleVerify = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:5000/confirm-verify", {
        company_email: email,
        verification_code: code,
      })
      
      // If verification is successful, show success message with SweetAlert2
      Swal.fire({
        title: 'Verification Successful!',
        text: 'Your email has been verified.',
        icon: 'success',
        confirmButtonText: 'Okay',
      }).then(() => {
       
        window.location.href = '/login'
      })
    } catch (error: any) {
     
      Swal.fire({
        title: 'Verification Failed',
        text: error.response?.data?.message || 'An error occurred, please try again.',
        icon: 'error',
        confirmButtonText: 'Okay',
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Logo Section */}
      <div className="px-10 py-6">
        <div className="flex items-center gap-4">
          <Image src="/assets/logo.png" alt="Cheemba Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-black-xl font-roboto font-bold">Chee-<span className="text-blue-600 font-roboto font-bold">mba</span></span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex min-h-[calc(100vh-88px)] items-center justify-center px-4">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2">
          {/* Left Section - Illustration */}
          <div className="relative hidden lg:block">
            <Image src="/assets/frame.png" alt="Login Illustration" width={600} height={600} className="h-auto w-full" priority />
          </div>

          {/* Right Section - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-manrope font-bold tracking-tight">Verification code</h1>
                <p className="font-spaceGrotesk">Verify using email</p>
              </div>

              <form className="space-y-8" onSubmit={handleVerify}>
                <div className="space-y-4 mt-12 mb-4">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-spaceGrotesk border-b border-gray-300 w-full py-2 bg-gray-100"
                  />
                </div>

                <div className="space-y-4 mt-12 mb-4">
                  <input
                    id="code"
                    type="number"
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-spaceGrotesk border-b border-gray-300 w-full py-2 bg-gray-100"
                  />
                </div>

                <Button
      className="h-11 w-full bg-black text-white hover:bg-black/90 font-spaceGrotesk"
      type="submit"
      onClick={handleVerify}
      disabled={loading}
    >
      {loading ? 'Verifying...' : 'Verify'}
    </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
