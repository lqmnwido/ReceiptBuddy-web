"use client"
import { useState } from "react"

export default function GenerateShiftsPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!startDate || !endDate) return
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/shifts/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Generate Shifts</h1>
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <p className="text-gray-500 text-sm">AI will generate optimal shift schedules based on templates and employee preferences.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading || !startDate || !endDate}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
          {loading ? "Generating..." : "Generate Shifts with AI"}
        </button>
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-medium text-green-800">{result.message}</p>
            <p className="text-sm text-green-600 mt-1">Conflicts detected: {result.conflicts}</p>
          </div>
        )}
      </div>
    </div>
  )
}
