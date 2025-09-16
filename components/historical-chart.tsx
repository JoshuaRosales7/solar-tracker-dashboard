"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { SensorReading } from "@/lib/useFirebaseData"

interface HistoricalChartProps {
  data: SensorReading[]
  dateRange: { start: string; end: string }
  onDateRangeChange: (range: { start: string; end: string }) => void
}

export function HistoricalChart({ data, dateRange, onDateRangeChange }: HistoricalChartProps) {
  const chartData = data.map((reading) => ({
    ...reading,
    time: new Date(reading.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
  }))

  return (
    <Card className="bg-neutral-900 border border-neutral-800 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-100">Lecturas Históricas</CardTitle>
        <div className="flex gap-4 mt-4">
          <input
            type="datetime-local"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="px-3 py-2 border border-neutral-700 rounded-lg text-sm bg-neutral-800 text-gray-100"
          />
          <input
            type="datetime-local"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="px-3 py-2 border border-neutral-700 rounded-lg text-sm bg-neutral-800 text-gray-100"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.4} />
            <XAxis dataKey="time" stroke="#e5e7eb" fontSize={11} />
            <YAxis stroke="#e5e7eb" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
            <Legend wrapperStyle={{ color: "#f9fafb" }} />

            <Line dataKey="LDR1" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line dataKey="LDR2" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line dataKey="LDR3" stroke="#eab308" strokeWidth={2} dot={false} />
            <Line dataKey="LDR4" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
