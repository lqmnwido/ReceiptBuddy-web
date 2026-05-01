"use client"
import { useState, useEffect } from "react"
import { Wallet, ClipboardCheck, Package } from "lucide-react"

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/reports/financial-summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const downloadReport = async (type: string) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/reports/${type}?format=csv`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}_report.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {/* Financial Summary */}
      {summary && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-semibold mb-4">Financial Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-primary">RM {summary.total_expenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payroll Cost</p>
              <p className="text-xl font-bold text-green-600">RM {summary.payroll_cost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hours Worked</p>
              <p className="text-xl font-bold">{summary.total_hours_worked}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Labor Cost %</p>
              <p className="text-xl font-bold">{summary.labor_cost_percentage}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Download Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { type: "expenses", label: "Expenses Report", Icon: Wallet },
          { type: "attendance", label: "Attendance Report", Icon: ClipboardCheck },
          { type: "inventory", label: "Inventory Report", Icon: Package },
        ].map((r) => (
          <button key={r.type} onClick={() => downloadReport(r.type)}
            className="bg-white border rounded-xl p-6 text-left hover:shadow-md transition flex items-center gap-3">
            <r.Icon size={28} className="text-primary" />
            <div>
              <p className="font-semibold">{r.label}</p>
              <p className="text-sm text-gray-500">Download CSV</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
