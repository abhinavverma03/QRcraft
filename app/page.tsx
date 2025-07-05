"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Download, Copy, Check, QrCode, Link2, ArrowRight, Zap, Shield, Smartphone } from "lucide-react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (err) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (include http:// or https://)")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setQrImage(imageUrl)
      } else {
        setError("Failed to generate QR code")
      }
    } catch (error) {
      console.error("Error generating QR code:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (qrImage) {
      const link = document.createElement("a")
      link.href = qrImage
      link.download = "qr-code.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleReset = () => {
    setQrImage(null)
    setUrl("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 p-2 rounded-xl">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">QRCraft</h1>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure & Fast</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!qrImage ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Create QR Codes
                <span className="block text-emerald-500">Instantly</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform any URL into a professional QR code in seconds. Perfect for marketing, events, and digital
                sharing.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Generate QR codes instantly with our optimized engine</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your data is processed securely and never stored</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Ready</h3>
                <p className="text-gray-600">Perfect for all devices and screen sizes</p>
              </div>
            </div>

            {/* Generator Form */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-12">
                <div className="text-center mb-8">
                  <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Link2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter Your URL</h3>
                  <p className="text-gray-600">Paste any website URL to generate a QR code</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="url"
                        name="url"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value)
                          setError("")
                        }}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200 text-lg pr-12"
                        placeholder="https://example.com"
                      />
                      <Link2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center text-lg group"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate QR Code
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* QR Code Result */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your QR Code is Ready!</h2>
              <p className="text-gray-600">Scan with any smartphone camera or QR code reader</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* QR Code Display */}
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
                  <div className="bg-gray-50 rounded-2xl p-8 mb-6 inline-block">
                    <Image
                      src={qrImage || "/placeholder.svg"}
                      alt="Generated QR Code"
                      width={280}
                      height={280}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">QR Code for:</p>
                    <p className="text-gray-900 font-medium break-all">{url}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </button>

                    <button
                      onClick={handleCopy}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Copy URL
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="order-1 lg:order-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use Your QR Code</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-emerald-100 rounded-full p-1 mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Download & Save</p>
                        <p className="text-gray-600 text-sm">Save the QR code image to your device</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-emerald-100 rounded-full p-1 mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Print or Share</p>
                        <p className="text-gray-600 text-sm">Add to flyers, business cards, or digital content</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-emerald-100 rounded-full p-1 mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Scan & Go</p>
                        <p className="text-gray-600 text-sm">Anyone can scan to visit your URL instantly</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 border border-gray-200"
                >
                  Create Another QR Code
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">© {new Date().getFullYear()} QRCraft. Built with ❤️ for seamless sharing.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
