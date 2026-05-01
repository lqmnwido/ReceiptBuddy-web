"use client"
import { useState, useEffect } from "react"

export default function AnalyticsPage() {
  const [catData, setCatData] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    
    Promise.all([
      fetch(`${api}/api/analytics/category-breakdown`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${api}/api/analytics/expense-trends?months=6`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([cat, trend]) => {
        setCatData(cat)
        setTrendData(trend)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>

  const totalCat = catData.reduce((s, c) => s + c.total, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {catData.map((c: any, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.category}</span>
                  <span className="font-medium">${c.total.toFixed(2)} ({c.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: `${c.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Monthly Spending Trends</h2>
          <div className="space-y-3">
            {trendData.map((m: any, i) => {
              const maxVal = Math.max(...trendData.map((t) => t.total))
              const pct = maxVal > 0 ? (m.total / maxVal) * 100 : 0
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{m.month}</span>
                    <span className="font-medium">${m.total.toFixed(2)} ({m.count} items)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-green-500 rounded-full h-3" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
