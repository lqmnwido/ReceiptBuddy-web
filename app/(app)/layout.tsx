"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3, Camera, Wallet, TrendingUp, Users, Calendar,
  ClipboardCheck, Umbrella, Package, FileText, ClipboardList,
  Bot, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: BarChart3 },
  { href: "/receipts", label: "Receipts", Icon: Camera },
  { href: "/expenses", label: "Expenses", Icon: Wallet },
  { href: "/analytics", label: "Analytics", Icon: TrendingUp },
  { href: "/employees/list", label: "Employees", Icon: Users },
  { href: "/shifts/calendar", label: "Shifts", Icon: Calendar },
  { href: "/attendance", label: "Attendance", Icon: ClipboardCheck },
  { href: "/leave/requests", label: "Leave", Icon: Umbrella },
  { href: "/inventory", label: "Inventory", Icon: Package },
  { href: "/invoices", label: "Invoices", Icon: FileText },
  { href: "/reports", label: "Reports", Icon: ClipboardList },
  { href: "/ai-chat", label: "AI Chat", Icon: Bot },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setUser(data))
      .catch(() => { localStorage.removeItem("token"); router.push("/login") })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r ${sidebarOpen ? "w-64" : "w-16"} transition-all duration-200 flex flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">RB</span>
            </div>
            {sidebarOpen && <span className="font-bold">ReceiptBuddy</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-600">
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                pathname.startsWith(item.href) ? "bg-primary-50 text-primary font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          {sidebarOpen && user && (
            <div className="text-sm">
              <p className="font-medium truncate">{user.full_name}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
          )}
          <button onClick={handleLogout} className="mt-2 text-sm text-red-500 hover:text-red-700 w-full text-left flex items-center gap-3">
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
