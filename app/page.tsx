import Link from "next/link"
import {
  Camera, Wallet, BarChart3, Calendar,
  ClipboardCheck, Bot,
} from "lucide-react"

const features = [
  { title: "Receipt Scanner", desc: "Snap a photo, AI extracts vendor, total, date & items automatically", Icon: Camera },
  { title: "Expense Tracking", desc: "Categorize, tag, and track every business expense effortlessly", Icon: Wallet },
  { title: "AI Analytics", desc: "Beautiful charts, spending trends, and AI-generated business insights", Icon: BarChart3 },
  { title: "Smart Scheduling", desc: "AI generates optimal shift schedules based on availability & demand", Icon: Calendar },
  { title: "Attendance & Leave", desc: "Clock in/out with GPS, manage leave requests with AI approval suggestions", Icon: ClipboardCheck },
  { title: "AI Business Chat", desc: "Ask questions about your business data in plain English", Icon: Bot },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RB</span>
            </div>
            <span className="font-bold text-xl">ReceiptBuddy</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
            <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Run Your Business Smarter<br />with <span className="text-primary">AI</span></h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Receipt scanning, expense tracking, smart shift scheduling, attendance management,
          and AI-powered insights — all in one platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transition">Start Free Trial</Link>
          <Link href="/login" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg hover:border-primary hover:text-primary transition">Sign In</Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="border rounded-xl p-6 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <f.Icon size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-500">
        <p>© 2026 ReceiptBuddy. All rights reserved. Runs locally, zero API costs.</p>
      </footer>
    </div>
  )
}
