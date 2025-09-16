import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCw, Move } from "lucide-react"
import type { SensorReading } from "@/lib/useFirebaseData"

interface ServoStatusProps {
  currentReading: SensorReading
}

export function ServoStatus({ currentReading }: ServoStatusProps) {
  return (
    <Card className="bg-neutral-900 border border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Posición de Servos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Servo Vertical */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCw className="h-5 w-5 text-blue-400" />
            <div>
              <p className="font-medium text-gray-100">Servo Vertical</p>
              <p className="text-sm text-gray-400">Ángulo de elevación</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-100">{currentReading.servoV}°</p>
          </div>
        </div>

        {/* Servo Horizontal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Move className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-medium text-gray-100">Servo Horizontal</p>
              <p className="text-sm text-gray-400">Ángulo de azimut</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-100">{currentReading.servoH}°</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-700">
          <p className="text-sm text-gray-400">
            Última actualización:{" "}
            <span className="font-medium text-gray-100">
              {new Date(currentReading.fecha).toLocaleString("es-ES")}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
