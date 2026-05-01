"use client"
import { useState, useEffect } from "react"

export default function AttendancePage() {
  const [status, setStatus] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    const token = localStorage.getItem("token")
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    
    Promise.all([
      fetch(`${api}/api/attendance/today`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${api}/api/attendance/history`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${api}/api/attendance/stats`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([s, h, st]) => {
        setStatus(s)
        setHistory(h)
        setStats(st)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleClockIn = async () => {
    const token = localStorage.getItem("token")
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/attendance/clock-in`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: 0, date: new Date().toISOString().split("T")[0] }),
    })
    fetchData()
  }

  const handleClockOut = async () => {
    const token = localStorage.getItem("token")
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/attendance/clock-out`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: 0, date: new Date().toISOString().split("T")[0] }),
    })
    fetchData()
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance</h1>

      {/* Clock In/Out */}
      <div className="bg-white rounded-xl border p-6 mb-6 text-center">
        <p className="text-4xl mb-2">{status?.clock_in ? (status?.clock_out ? "✅" : "⏳") : "⏰"}</p>
        <p className="text-lg mb-4">
          {status?.clock_in
            ? (status?.clock_out ? `Clocked out - ${status.hours_worked}h worked` : "Currently clocked in")
            : "Not clocked in yet"}
        </p>
        {!status?.clock_in && (
          <button onClick={handleClockIn} className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Clock In</button>
        )}
        {status?.clock_in && !status?.clock_out && (
          <button onClick={handleClockOut} className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">Clock Out</button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold">{stats.total_records}</p>
            <p className="text-sm text-gray-500">Total Records</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold">{stats.late_percentage}%</p>
            <p className="text-sm text-gray-500">Late Rate</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold">{stats.total_hours}</p>
            <p className="text-sm text-gray-500">Total Hours</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold">{stats.average_hours_per_day}</p>
            <p className="text-sm text-gray-500">Avg Hours/Day</p>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Employee</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Clock In</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Clock Out</th>
              <th className="text-right p-3 text-sm font-medium text-gray-500">Hours</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 text-sm">{r.date}</td>
                <td className="p-3 text-sm">{r.employee_name}</td>
                <td className="p-3 text-sm">{r.clock_in ? new Date(r.clock_in).toLocaleTimeString() : "-"}</td>
                <td className="p-3 text-sm">{r.clock_out ? new Date(r.clock_out).toLocaleTimeString() : "-"}</td>
                <td className="p-3 text-sm text-right">{r.hours_worked?.toFixed(1) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
