"use client"
import { useState } from "react"

export default function AIChatPage() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!query.trim()) return
    
    const userMsg = { role: "user", content: query }
    setMessages((prev) => [...prev, userMsg])
    setQuery("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/ai/chat`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">AI Business Chat</h1>
      <p className="text-gray-500 text-sm mb-4">Ask questions about your business data in plain English.</p>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🤖</p>
            <p>Ask me anything about your business</p>
            <p className="text-sm">e.g., "How much did we spend this month?" or "Who's on leave next week?"</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl rounded-xl px-4 py-3 ${
              m.role === "user" ? "bg-primary text-white" : "bg-white border"
            }`}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-white border rounded-xl px-4 py-3"><div className="animate-pulse">Thinking...</div></div></div>}
      </div>

      <div className="flex gap-2">
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
        />
        <button onClick={handleSend} disabled={loading || !query.trim()}
          className="bg-primary text-white px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition">
          Send
        </button>
      </div>
    </div>
  )
}
