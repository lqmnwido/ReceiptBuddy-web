"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/analytics/kpis`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setKpis)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Expenses", value: `$${kpis?.total_expenses?.toLocaleString() || "0"}`, href: "/expenses", color: "bg-blue-50 text-blue-700" },
          { label: "Payroll Cost", value: `$${kpis?.total_payroll?.toLocaleString() || "0"}`, href: "/reports", color: "bg-green-50 text-green-700" },
          { label: "Attendance Rate", value: `${kpis?.avg_attendance_rate || "0"}%`, href: "/attendance", color: "bg-purple-50 text-purple-700" },
          { label: "Pending Leave", value: `${kpis?.pending_leave_requests || "0"}`, href: "/leave/requests", color: "bg-amber-50 text-amber-700" },
        ].map((card, i) => (
          <Link key={i} href={card.href} className={`${card.color} rounded-xl p-6 hover:shadow-md transition`}>
            <p className="text-sm opacity-75 mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Upload Receipt", href: "/receipts", icon: "📸" },
              { label: "Add Expense", href: "/expenses", icon: "💰" },
              { label: "Clock In/Out", href: "/attendance", icon: "✅" },
              { label: "AI Chat", href: "/ai-chat", icon: "🤖" },
              { label: "Generate Shifts", href: "/shifts/generate", icon: "📅" },
              { label: "View Reports", href: "/reports", icon: "📋" },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition">
                <span className="text-xl">{action.icon}</span>
                <span className="text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Status Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Top Expense Category</span>
              <span className="font-medium">{kpis?.top_expense_category || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Labor Cost %</span>
              <span className="font-medium">{kpis?.labor_cost_percentage || "0"}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Low Stock Items</span>
              <span className="font-medium text-red-600">{kpis?.low_stock_items || "0"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Pending Leave Requests</span>
              <span className="font-medium text-amber-600">{kpis?.pending_leave_requests || "0"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
