// hooks/useTrackSolar.ts
"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export interface SensorReading {
  LDR1: number
  LDR2: number
  LDR3: number
  LDR4: number
  servoH: number
  servoV: number
  timestampMs: number
  fecha?: string
}

export function useCurrentReading() {
  const [current, setCurrent] = useState<SensorReading | null>(null)

  useEffect(() => {
    const estadoRef = ref(db, "proyectos/tracksolar_01/estado")
    const unsubscribe = onValue(estadoRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrent(snapshot.val())
      }
    })
    return () => unsubscribe()
  }, [])

  return current
}

export function useHistoricalReadings(date: string) {
  const [historical, setHistorical] = useState<SensorReading[]>([])

  useEffect(() => {
    if (!date) return
    const historialRef = ref(db, `proyectos/tracksolar_01/historial/${date}`)
    const unsubscribe = onValue(historialRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const readings: SensorReading[] = Object.entries(data).map(([time, values]) => ({
          ...(values as Omit<SensorReading, "fecha">),
          fecha: time.replace(/_/g, ":"),
        }))
        setHistorical(readings)
      }
    })
    return () => unsubscribe()
  }, [date])

  return historical
}
