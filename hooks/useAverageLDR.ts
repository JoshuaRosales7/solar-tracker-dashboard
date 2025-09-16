// hooks/useAverageLDR.ts
"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export interface AverageData {
  LDR1: number
  LDR2: number
  LDR3: number
  LDR4: number
}

export function useAverageLDR(date: string) {
  const [averages, setAverages] = useState<AverageData | null>(null)

  useEffect(() => {
    if (!date) return

    const historialRef = ref(db, `proyectos/tracksolar_01/historial/${date}`)
    const unsubscribe = onValue(historialRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        let total = { LDR1: 0, LDR2: 0, LDR3: 0, LDR4: 0 }
        let count = 0

        Object.values(data).forEach((reading: any) => {
          total.LDR1 += reading.LDR1
          total.LDR2 += reading.LDR2
          total.LDR3 += reading.LDR3
          total.LDR4 += reading.LDR4
          count++
        })

        if (count > 0) {
          setAverages({
            LDR1: Math.round(total.LDR1 / count),
            LDR2: Math.round(total.LDR2 / count),
            LDR3: Math.round(total.LDR3 / count),
            LDR4: Math.round(total.LDR4 / count),
          })
        }
      }
    })

    return () => unsubscribe()
  }, [date])

  return averages
}
