"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function EmployeesListPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setEmployees)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Link href="/employees/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">+ Add Employee</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Department</th>
                <th className="text-right p-3 text-sm font-medium text-gray-500">Rate</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e: any) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium"><Link href={`/employees/${e.id}`} className="text-primary hover:underline">{e.name}</Link></td>
                  <td className="p-3 text-sm text-gray-600">{e.email}</td>
                  <td className="p-3 text-sm">{e.role || "-"}</td>
                  <td className="p-3 text-sm">{e.department || "-"}</td>
                  <td className="p-3 text-sm text-right">RM {e.hourly_rate?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && <p className="text-center py-8 text-gray-400">No employees found</p>}
        </div>
      )}
    </div>
  )
}
