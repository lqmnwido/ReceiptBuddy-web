"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewEmployeePage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", department: "", hourly_rate: 15 })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/employees`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to create employee")
      router.push("/employees/list")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Employee</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
        <div><label className="block text-sm font-medium mb-1">Name*</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" required /></div>
        <div><label className="block text-sm font-medium mb-1">Email*</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-3 py-2" required /></div>
        <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Role</label><input type="text" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Department</label><input type="text" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Hourly Rate</label><input type="number" step="0.01" value={form.hourly_rate} onChange={(e) => setForm({...form, hourly_rate: parseFloat(e.target.value)})} className="w-full border rounded-lg px-3 py-2" /></div>
        <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">Create Employee</button>
      </form>
    </div>
  )
}
