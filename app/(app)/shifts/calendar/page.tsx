"use client"
import { useState, useEffect } from "react"

export default function ShiftsCalendarPage() {
  const [shifts, setShifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const start = weekStart.toISOString().split("T")[0]
    const end = weekEnd.toISOString().split("T")[0]
    fetch(`${api}/api/shifts/calendar?start_date=${start}&end_date=${end}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setShifts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shift Calendar</h1>
        <span className="text-gray-500">{weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div key={d} className="bg-gray-100 rounded-t-lg p-2 text-center font-medium text-sm">{d}</div>
          ))}
          {days.map((_, dayIdx) => {
            const date = new Date(weekStart)
            date.setDate(weekStart.getDate() + dayIdx)
            const dateStr = date.toISOString().split("T")[0]
            const dayShifts = shifts.filter((s: any) => s.date === dateStr)
            return (
              <div key={dayIdx} className="bg-white border rounded-b-lg min-h-32 p-2">
                <p className="text-xs text-gray-400 mb-1">{dateStr}</p>
                {dayShifts.length === 0 ? (
                  <p className="text-xs text-gray-300">No shifts</p>
                ) : (
                  dayShifts.map((s: any, i: number) => (
                    <div key={i} className="bg-primary-50 text-primary text-xs rounded p-1 mb-1">
                      <p className="font-medium">{s.start_time}-{s.end_time}</p>
                      <p className="text-primary-700">{s.staff_count}/{s.min_staff} staff</p>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
