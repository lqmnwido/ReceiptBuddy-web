"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const form = new URLSearchParams()
      form.append("username", email)
      form.append("password", password)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Login failed")
      }

      const data = await res.json()
      localStorage.setItem("token", data.access_token)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">RB</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-500">Sign in to ReceiptBuddy</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
