"use client"
import { useState, useEffect } from "react"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/invoices`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Invoice #</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Client</th>
                <th className="text-right p-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium">{inv.invoice_number}</td>
                  <td className="p-3 text-sm">{inv.client_name}</td>
                  <td className="p-3 text-sm text-right font-medium">${inv.total?.toFixed(2) || "0.00"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === "paid" ? "bg-green-100 text-green-700" :
                      inv.status === "sent" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{inv.status}</span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">{inv.due_date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && <p className="text-center py-8 text-gray-400">No invoices yet</p>}
        </div>
      )}
    </div>
  )
}
