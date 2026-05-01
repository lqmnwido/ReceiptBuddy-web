"use client"
import { useState, useEffect } from "react"

export default function LeaveBalancesPage() {
  const [balances, setBalances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/leave/balances`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setBalances)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leave Balances</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {balances.map((b: any) => (
            <div key={b.leave_type} className="bg-white rounded-xl border p-6 text-center">
              <p className="text-3xl font-bold mb-2">{b.remaining}</p>
              <p className="text-gray-500 capitalize">{b.leave_type}</p>
              <p className="text-sm text-gray-400">{b.used_days} used of {b.total_days}</p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                <div className="bg-primary rounded-full h-2" style={{ width: `${b.total_days > 0 ? (b.used_days / b.total_days) * 100 : 0}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
