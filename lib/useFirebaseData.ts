"use client"

import { useState, useEffect } from "react"
import { db } from "./firebase"
import { ref, onValue, off } from "firebase/database"

export interface SensorReading {
  fecha: string
  LDR1: number
  LDR2: number
  LDR3: number
  LDR4: number
  servoV: number
  servoH: number
}

function parseFecha(dayKey: string, timeKey: string): string {
  // dayKey = "20250914" → "2025-09-14"
  const year = dayKey.slice(0, 4)
  const month = dayKey.slice(4, 6)
  const day = dayKey.slice(6, 8)

  // timeKey = "15_21_41" → "15:21:41"
  const time = timeKey.replace(/_/g, ":")

  const iso = `${year}-${month}-${day}T${time}:00Z` // agrego segundos y Zulu para UTC
  const parsed = new Date(iso)

  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
}

export function useFirebaseData(projectId: string) {
  const [estado, setEstado] = useState<SensorReading | null>(null)
  const [historial, setHistorial] = useState<SensorReading[]>([])

  useEffect(() => {
    // 👉 Estado en tiempo real
    const estadoRef = ref(db, `proyectos/${projectId}/estado`)
    const unsubEstado = onValue(estadoRef, (snapshot) => {
      const v = snapshot.val()
      if (!v) return
      setEstado({
        fecha: new Date().toISOString(),
        LDR1: v.LDR1 || 0,
        LDR2: v.LDR2 || 0,
        LDR3: v.LDR3 || 0,
        LDR4: v.LDR4 || 0,
        servoV: v.servoV || 0,
        servoH: v.servoH || 0,
      })
    })

    // 👉 Historial de últimos 7 días
    const hoy = new Date()
    const dayKeys: string[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(hoy)
      d.setDate(hoy.getDate() - i)
      dayKeys.push(d.toISOString().slice(0, 10).replace(/-/g, "")) // YYYYMMDD
    }

    const unsubs: (() => void)[] = []

    dayKeys.forEach((dayKey) => {
      const dayRef = ref(db, `proyectos/${projectId}/historial/${dayKey}`)
      const unsub = onValue(dayRef, (snapshot) => {
        const data = snapshot.val()
        if (!data) return

        const readings: SensorReading[] = Object.entries(data).map(([timeKey, values]) => {
          const v = values as any
          return {
            fecha: parseFecha(dayKey, timeKey),
            LDR1: v.LDR1 || 0,
            LDR2: v.LDR2 || 0,
            LDR3: v.LDR3 || 0,
            LDR4: v.LDR4 || 0,
            servoV: v.servoV || 0,
            servoH: v.servoH || 0,
          }
        })

        // ✅ Evitar duplicados con Set
        setHistorial((prev) => {
          const fechasPrevias = new Set(prev.map((r) => r.fecha))
          const nuevos = readings.filter((r) => !fechasPrevias.has(r.fecha))
          return [...prev, ...nuevos].sort(
            (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          )
        })
      })
      unsubs.push(() => off(dayRef, "value", unsub))
    })

    return () => {
      off(estadoRef, "value", unsubEstado)
      unsubs.forEach((fn) => fn())
    }
  }, [projectId])

  return { estado, historial }
}
