"use client"
import { useState, useEffect } from "react"
import { Camera, Pencil, X } from "lucide-react"

function formatDate(d: string | null | undefined): string {
  if (!d) return "No date"
  // If YYYY-MM-DD (from database Date type), convert to DD/MM/YYYY
  const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) return `${match[3]}/${match[2]}/${match[1]}`
  // If already DD/MM/YYYY, return as-is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) return d
  return d
}

function toInputDate(d: string | null | undefined): string {
  if (!d) return ""
  // Try DD/MM/YYYY → YYYY-MM-DD for input[type=date]
  const dmy = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`
  // If already YYYY-MM-DD, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
  return d
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingReceipt, setEditingReceipt] = useState<any>(null)
  const [editForm, setEditForm] = useState({ vendor: "", total: "", date: "", category: "" })

  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const fetchReceipts = () => {
    const token = localStorage.getItem("token")
    fetch(`${api}/api/receipts`, {
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
      const res = await fetch(`${api}/api/receipts/upload`, {
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
    await fetch(`${api}/api/receipts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchReceipts()
  }

  const openEdit = (r: any) => {
    setEditingReceipt(r)
    setEditForm({
      vendor: r.vendor || "",
      total: r.total?.toString() || "",
      date: toInputDate(r.date),
      category: r.category || "",
    })
  }

  const handleSave = async () => {
    if (!editingReceipt) return
    const token = localStorage.getItem("token")
    const payload: any = {}
    if (editForm.vendor !== (editingReceipt.vendor || "")) payload.vendor = editForm.vendor
    const totalNum = parseFloat(editForm.total)
    if (!isNaN(totalNum) && totalNum !== editingReceipt.total) payload.total = totalNum
    if (editForm.date !== (editingReceipt.date || "")) payload.date = editForm.date
    if (editForm.category !== (editingReceipt.category || "")) payload.category = editForm.category

    if (Object.keys(payload).length === 0) {
      setEditingReceipt(null)
      return
    }

    try {
      const res = await fetch(`${api}/api/receipts/${editingReceipt.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        fetchReceipts()
      }
    } catch (err) {
      console.error(err)
    }
    setEditingReceipt(null)
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
          <Camera size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No receipts yet</p>
          <p className="text-sm">Upload a receipt to get started with AI-powered scanning</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition relative group">
              {r.image_url && (
                <img src={`${api}${r.image_url}`} alt={r.filename} className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              <div className="space-y-1">
                <p className="font-semibold truncate">{r.vendor || "Unknown Vendor"}</p>
                <p className="text-lg font-bold text-primary">RM {r.total?.toFixed(2) || "0.00"}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(r.date)}</span>
                  {r.category && <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{r.category}</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{r.filename}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(r)}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(r.id)}
                  className="text-xs text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingReceipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditingReceipt(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Edit Receipt</h2>
              <button onClick={() => setEditingReceipt(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Vendor</label>
                <input type="text" value={editForm.vendor} onChange={(e) => setEditForm({ ...editForm, vendor: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Total (RM)</label>
                <input type="number" step="0.01" value={editForm.total} onChange={(e) => setEditForm({ ...editForm, total: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Date</label>
                <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Category</label>
                <input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <button onClick={() => setEditingReceipt(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition">Cancel</button>
              <button onClick={handleSave}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
