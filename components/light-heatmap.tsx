import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SensorReading } from "@/lib/useFirebaseData"

interface LightHeatmapProps {
  data: SensorReading[]
}

export function LightHeatmap({ data }: LightHeatmapProps) {
  // Calcular promedios
  const averages = data.reduce(
    (acc, reading) => ({
      LDR1: acc.LDR1 + reading.LDR1,
      LDR2: acc.LDR2 + reading.LDR2,
      LDR3: acc.LDR3 + reading.LDR3,
      LDR4: acc.LDR4 + reading.LDR4,
    }),
    { LDR1: 0, LDR2: 0, LDR3: 0, LDR4: 0 }
  )

  if (data.length > 0) {
    averages.LDR1 /= data.length
    averages.LDR2 /= data.length
    averages.LDR3 /= data.length
    averages.LDR4 /= data.length
  }

  const maxValue = Math.max(averages.LDR1, averages.LDR2, averages.LDR3, averages.LDR4)

  const safeRatio = (value: number) => {
    if (maxValue <= 0 || Number.isNaN(maxValue)) return 0
    return value / maxValue
  }

  const getIntensityColor = (value: number) => {
    const intensity = safeRatio(value)
    if (intensity > 0.7) return "bg-gradient-to-br from-red-500 to-red-700"
    if (intensity > 0.4) return "bg-gradient-to-br from-yellow-400 to-orange-500"
    return "bg-gradient-to-br from-emerald-400 to-emerald-600"
  }

  const getIntensityOpacity = (value: number) => {
    const intensity = safeRatio(value)
    return Math.max(0.4, intensity)
  }

  const getGlowEffect = (value: number) => {
    const intensity = safeRatio(value)
    if (intensity > 0.7) return "shadow-lg shadow-red-500/40"
    if (intensity > 0.4) return "shadow-lg shadow-yellow-500/40"
    return "shadow-lg shadow-emerald-500/40"
  }

  return (
    <Card className="bg-neutral-900 border border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-red-500 rounded-full animate-pulse"></div>
          Mapa de Calor - Concentración de Luz
        </CardTitle>
        <p className="text-sm text-gray-400">Distribución espacial de la intensidad lumínica</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 aspect-square max-w-sm mx-auto">
          {["LDR1", "LDR2", "LDR3", "LDR4"].map((key, idx) => {
            const value = averages[key as keyof typeof averages]
            return (
              <div
                key={idx}
                className={`${getIntensityColor(value)} ${getGlowEffect(value)} rounded-xl p-6 flex flex-col items-center justify-center text-white font-semibold transform hover:scale-105 transition-all duration-300 cursor-pointer`}
                style={{ opacity: getIntensityOpacity(value) }}
              >
                <div className="text-xs text-gray-100/80 mb-1">{key}</div>
                <div className="text-2xl font-bold text-gray-50">{Math.round(value)}</div>
                <div className="text-xs text-gray-200 mt-1">lux</div>
              </div>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800">
            <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-sm"></div>
            <span className="text-gray-300 font-medium">Baja</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800">
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-sm"></div>
            <span className="text-gray-300 font-medium">Media</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-sm"></div>
            <span className="text-gray-300 font-medium">Alta</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
