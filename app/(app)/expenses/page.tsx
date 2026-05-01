"use client"
import { useState, useEffect } from "react"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    
    Promise.all([
      fetch(`${api}/api/expenses`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${api}/api/expenses/summary`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([expData, sumData]) => {
        setExpenses(expData.expenses || [])
        setSummary(sumData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>

      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-primary">${summary.total.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Count</p>
            <p className="text-2xl font-bold">{summary.count}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Average</p>
            <p className="text-2xl font-bold">${summary.average.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Category</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Description</th>
              <th className="text-right p-3 text-sm font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e: any) => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 text-sm">{e.date}</td>
                <td className="p-3"><span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{e.category}</span></td>
                <td className="p-3 text-sm text-gray-600">{e.description || "-"}</td>
                <td className="p-3 text-sm text-right font-medium">${e.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && <p className="text-center py-8 text-gray-400">No expenses recorded yet</p>}
      </div>
    </div>
  )
}
