import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import type { SensorReading } from "@/lib/useFirebaseData"

interface AverageChartProps {
  data: SensorReading[]
}

export function AverageChart({ data }: AverageChartProps) {
  // 📌 Si no hay datos, mostrar mensaje claro
  if (!data || data.length === 0) {
    return (
      <Card className="bg-neutral-900 border border-neutral-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">
            Promedio por Sensor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center">
            No hay datos suficientes para calcular promedios
          </p>
        </CardContent>
      </Card>
    )
  }

  // 📌 Calcular los promedios sobre TODOS los datos disponibles
  const totals = data.reduce(
    (acc, reading) => {
      acc.LDR1 += reading.LDR1 ?? 0
      acc.LDR2 += reading.LDR2 ?? 0
      acc.LDR3 += reading.LDR3 ?? 0
      acc.LDR4 += reading.LDR4 ?? 0
      return acc
    },
    { LDR1: 0, LDR2: 0, LDR3: 0, LDR4: 0 }
  )

  const averages = {
    LDR1: Math.round(totals.LDR1 / data.length),
    LDR2: Math.round(totals.LDR2 / data.length),
    LDR3: Math.round(totals.LDR3 / data.length),
    LDR4: Math.round(totals.LDR4 / data.length),
  }

  // 📊 Datos para la gráfica
  const chartData = [
    { sensor: "LDR1", promedio: averages.LDR1, fill: "#22c55e" }, // verde
    { sensor: "LDR2", promedio: averages.LDR2, fill: "#f59e0b" }, // amarillo
    { sensor: "LDR3", promedio: averages.LDR3, fill: "#3b82f6" }, // azul
    { sensor: "LDR4", promedio: averages.LDR4, fill: "#ef4444" }, // rojo
  ]

  return (
    <Card className="bg-neutral-900 border border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-green-500 rounded-full"></div>
            <div className="w-1 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
            <div className="w-1 h-2 bg-red-500 rounded-full"></div>
          </div>
          Promedio por Sensor
        </CardTitle>
        <p className="text-sm text-gray-400">
          Promedios calculados con todas las lecturas disponibles en la base de datos
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
            <XAxis
              dataKey="sensor"
              stroke="#d1d5db"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#d1d5db"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "#f9fafb", fontWeight: "600" }}
              itemStyle={{ color: "#f9fafb" }}
              formatter={(value: number) => [`${value} lux`, "Promedio"]}
            />
            <Bar
              dataKey="promedio"
              radius={[8, 8, 0, 0]}
              className="hover:opacity-80 transition-opacity duration-200"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-sm" />
              ))}
              <LabelList
                dataKey="promedio"
                position="top"
                style={{ fill: "#f9fafb", fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
