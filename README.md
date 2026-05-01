# ReceiptBuddy Web

Next.js web frontend for ReceiptBuddy — dashboard UI for all business operations.

## Features

- **Dashboard** — KPIs, expense trends, attendance overview
- **Receipts** — Upload receipt images with AI-powered OCR extraction
- **Expenses** — CRUD with category summaries and filters
- **Inventory** — Stock management with low-stock alerts
- **Invoices** — Create and manage invoices
- **Employees** — Employee profiles and management
- **Attendance** — Clock-in/out records and statistics
- **Leave** — Request and approve leave with balance tracking
- **Shifts** — Calendar view with shift assignments
- **Analytics** — Charts and expense breakdowns
- **AI Chat** — Natural language queries about business data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: REST calls to gateway (port 8000)

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## Docker

```bash
docker build -t receiptbuddy-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 receiptbuddy-web
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | API gateway URL |

## Project Structure

```
app/
├── (app)/          # Authenticated pages
│   ├── dashboard/
│   ├── receipts/
│   ├── expenses/
│   ├── inventory/
│   ├── invoices/
│   ├── employees/
│   ├── attendance/
│   ├── leave/
│   ├── analytics/
│   └── ai-chat/
├── (auth)/         # Login/register pages
│   ├── login/
│   └── register/
└── layout.tsx      # Root layout
```

## Dependencies

- API Gateway (port 8000) with all microservices running
- Node.js 22+
