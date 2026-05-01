"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EmployeeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setEmployee)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
  if (!employee) return <div className="text-center py-12 text-gray-500">Employee not found</div>

  return (
    <div>
      <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 mb-4">← Back</button>
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-bold mb-2">{employee.name}</h1>
        <p className="text-gray-500 mb-6">{employee.email}</p>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-500">Role</p><p className="font-medium">{employee.role || "-"}</p></div>
          <div><p className="text-sm text-gray-500">Department</p><p className="font-medium">{employee.department || "-"}</p></div>
          <div><p className="text-sm text-gray-500">Hourly Rate</p><p className="font-medium">RM {employee.hourly_rate?.toFixed(2) || "0.00"}</p></div>
          <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{employee.phone || "-"}</p></div>
          <div><p className="text-sm text-gray-500">Max Hours/Week</p><p className="font-medium">{employee.max_hours_per_week || "-"}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><p className="font-medium">{employee.is_active ? "Active" : "Inactive"}</p></div>
        </div>
      </div>
    </div>
  )
}
