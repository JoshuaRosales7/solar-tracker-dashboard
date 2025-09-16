"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { SensorReading } from "@/lib/useFirebaseData"

interface ExportButtonProps {
  data: SensorReading[]
}

export function ExportButton({ data }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = ["Fecha", "LDR1", "LDR2", "LDR3", "LDR4", "ServoV", "ServoH"]
    const csvContent = [
      headers.join(","),
      ...data.map((row) => [row.fecha, row.LDR1, row.LDR2, row.LDR3, row.LDR4, row.servoV, row.servoH].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `solar_tracker_data_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <Button onClick={exportToCSV} className="gap-2">
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
