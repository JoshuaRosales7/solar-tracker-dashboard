import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Lightbulb, Zap, Eye } from "lucide-react"
import type { SensorReading } from "@/lib/useFirebaseData"

interface SensorCardsProps {
  currentReading: SensorReading
}

const sensorConfig = [
  { key: "LDR1", label: "LDR1 (Superior Izq.)", icon: Sun, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  { key: "LDR2", label: "LDR2 (Superior Der.)", icon: Lightbulb, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  { key: "LDR3", label: "LDR3 (Inferior Izq.)", icon: Zap, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  { key: "LDR4", label: "LDR4 (Inferior Der.)", icon: Eye, color: "text-red-400", bgColor: "bg-red-500/20" },
]

export function SensorCards({ currentReading }: SensorCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {sensorConfig.map((sensor, index) => {
        const Icon = sensor.icon
        const value = currentReading[sensor.key as keyof SensorReading] as number

        return (
          <Card
            key={sensor.key}
            className="bg-neutral-900 border border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-gray-100 transition-colors">
                {sensor.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${sensor.bgColor} group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${sensor.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-gray-100 tracking-tight">
                  {value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 font-medium">lux</div>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Lectura actual
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
