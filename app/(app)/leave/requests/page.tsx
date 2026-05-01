"use client"
import { useState, useEffect } from "react"

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [balances, setBalances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ leave_type: "annual", start_date: "", end_date: "", reason: "" })

  const fetchData = () => {
    const token = localStorage.getItem("token")
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    
    Promise.all([
      fetch(`${api}/api/leave/requests`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${api}/api/leave/balances`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([req, bal]) => {
        setRequests(req)
        setBalances(bal)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/leave/requests`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ leave_type: "annual", start_date: "", end_date: "", reason: "" })
    fetchData()
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
          {showForm ? "Cancel" : "+ New Request"}
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {balances.map((b: any) => (
          <div key={b.leave_type} className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500 capitalize">{b.leave_type}</p>
            <p className="text-2xl font-bold">{b.remaining}<span className="text-sm text-gray-400">/{b.total_days}</span></p>
            <p className="text-xs text-gray-400">{b.used_days} used</p>
          </div>
        ))}
      </div>

      {/* New Request Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Leave Type</label>
              <select value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2">
                <option value="annual">Annual</option>
                <option value="sick">Sick</option>
                <option value="medical">Medical</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">Submit Request</button>
        </form>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Type</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Dates</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Days</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Reason</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 text-sm capitalize">{r.leave_type}</td>
                <td className="p-3 text-sm">{r.start_date} → {r.end_date}</td>
                <td className="p-3 text-sm">{r.days_requested}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === "approved" ? "bg-green-100 text-green-700" :
                    r.status === "rejected" ? "bg-red-100 text-red-700" :
                    r.status === "cancelled" ? "bg-gray-100 text-gray-500" :
                    "bg-amber-100 text-amber-700"
                  }`}>{r.status}</span>
                </td>
                <td className="p-3 text-sm text-gray-500">{r.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
