"use client"
import { useState, useEffect } from "react"

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchReceipts = () => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/receipts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setReceipts(Array.isArray(data) ? data : data.receipts || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReceipts() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append("file", file)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/receipts/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (res.ok) {
        fetchReceipts()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token")
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/receipts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchReceipts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <label className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-700 transition">
          {uploading ? "Uploading..." : "+ Upload Receipt"}
          <input type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">📸</p>
          <p className="text-lg">No receipts yet</p>
          <p className="text-sm">Upload a receipt to get started with AI-powered scanning</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition">
              {r.image_url && (
                <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${r.image_url}`} alt={r.filename} className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              <div className="space-y-1">
                <p className="font-semibold truncate">{r.vendor || "Unknown Vendor"}</p>
                <p className="text-lg font-bold text-primary">${r.total?.toFixed(2) || "0.00"}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{r.date || "No date"}</span>
                  {r.category && <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{r.category}</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{r.filename}</p>
              </div>
              <button onClick={() => handleDelete(r.id)} className="mt-2 text-xs text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
