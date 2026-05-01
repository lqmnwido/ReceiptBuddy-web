"use client"
import { useState, useEffect } from "react"

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    
    Promise.all([
      fetch(`${api}/api/inventory`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${api}/api/inventory/alerts/list`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([inv, al]) => {
        setItems(inv)
        setAlerts(al)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>

      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="font-semibold text-red-700 mb-2">⚠️ Low Stock Alerts ({alerts.length})</p>
          <div className="space-y-1">
            {alerts.map((a: any) => (
              <p key={a.id} className="text-sm text-red-600">{a.name} - {a.quantity} remaining (min: {a.min_stock})</p>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Category</th>
              <th className="text-right p-3 text-sm font-medium text-gray-500">Quantity</th>
              <th className="text-right p-3 text-sm font-medium text-gray-500">Min Stock</th>
              <th className="text-right p-3 text-sm font-medium text-gray-500">Unit Price</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} className={`border-b last:border-0 hover:bg-gray-50 ${item.needs_reorder ? "bg-red-50" : ""}`}>
                <td className="p-3 text-sm font-medium">{item.name}</td>
                <td className="p-3 text-sm">{item.category || "-"}</td>
                <td className={`p-3 text-sm text-right font-medium ${item.needs_reorder ? "text-red-600" : ""}`}>{item.quantity}</td>
                <td className="p-3 text-sm text-right">{item.min_stock}</td>
                <td className="p-3 text-sm text-right">{item.unit_price ? `$${item.unit_price.toFixed(2)}` : "-"}</td>
                <td className="p-3 text-sm">{item.supplier || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
