"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  const [catData, setCatData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${api}/api/analytics/kpis`, { headers }).then((r) => r.json()),
      fetch(`${api}/api/analytics/expense-trends?months=6`, { headers }).then((r) => r.json()),
      fetch(`${api}/api/analytics/category-breakdown`, { headers }).then((r) => r.json()),
    ])
      .then(([kpiData, trend, cat]) => {
        setKpis(kpiData)
        const monthly = trend.monthly_data || {}
        setTrendData(Object.entries(monthly).map(([month, total]) => ({ month, total })).reverse())
        setCatData(cat.categories || [])
      })
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
          { label: "Total Expenses", value: `RM ${kpis?.total_expenses?.toLocaleString() || "0"}`, href: "/expenses", color: "bg-blue-50 text-blue-700" },
          { label: "Payroll Cost", value: `RM ${kpis?.total_payroll?.toLocaleString() || "0"}`, href: "/reports", color: "bg-green-50 text-green-700" },
          { label: "Attendance Rate", value: `${kpis?.avg_attendance_rate || "0"}%`, href: "/attendance", color: "bg-purple-50 text-purple-700" },
          { label: "Low Stock Items", value: `${kpis?.low_stock_items || "0"}`, href: "/inventory", color: "bg-red-50 text-red-700" },
        ].map((card, i) => (
          <Link key={i} href={card.href} className={`${card.color} rounded-xl p-6 hover:shadow-md transition`}>
            <p className="text-sm opacity-75 mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Spending Trend */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Monthly Spending Trend</h2>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`RM ${value.toFixed(2)}`, "Total"]} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No expense data yet</p>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Spending by Category</h2>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={catData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                >
                  {catData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`RM ${value.toFixed(2)}`, "Total"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No categories yet</p>
          )}
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Business Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Top Category</span>
              <span className="font-medium">{kpis?.top_expense_category || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Labor Cost %</span>
              <span className="font-medium">{kpis?.labor_cost_percentage || "0"}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Pending Leave</span>
              <span className="font-medium text-amber-600">{kpis?.pending_leave_requests || "0"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Low Stock Items</span>
              <span className="font-medium text-red-600">{kpis?.low_stock_items || "0"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 md:col-span-2">
          <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
          <p className="text-gray-400 text-center py-8">Activity feed coming soon</p>
        </div>
      </div>
    </div>
  )
}
