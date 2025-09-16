"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { SensorCards } from "@/components/sensor-cards"
import { HistoricalChart } from "@/components/historical-chart"
import { LightHeatmap } from "@/components/light-heatmap"
import { AverageChart } from "@/components/average-chart"
import { ServoStatus } from "@/components/servo-status"
import { ExportButton } from "@/components/export-button"
import { useFirebaseData, SensorReading } from "../lib/useFirebaseData"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("inicio")
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    end: new Date().toISOString().slice(0, 16),
  })

const { estado, historial } = useFirebaseData("tracksolar_01")

// Filtrar por rango de fechas
const filteredData = historial.filter((reading) => {
  const readingDate = new Date(reading.fecha)
  const startDate = new Date(dateRange.start)
  const endDate = new Date(dateRange.end)
  return readingDate >= startDate && readingDate <= endDate
})

// Última lectura real
const currentReading = estado || {
  fecha: new Date().toISOString(),
  LDR1: 0,
  LDR2: 0,
  LDR3: 0,
  LDR4: 0,
  servoV: 0,
  servoH: 0,
}


  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-8 animate-fade-in">
          {activeSection === "inicio" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-primary">Panel de Control Solar</h1>
                  <p className="text-muted-foreground mt-2 text-lg">Última semana de lecturas</p>
                </div>
                <ExportButton data={filteredData} />
              </div>

              <SensorCards currentReading={currentReading} />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <HistoricalChart data={filteredData} dateRange={dateRange} onDateRangeChange={setDateRange} />
                <LightHeatmap data={[currentReading]} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AverageChart data={historial} />
                <ServoStatus currentReading={currentReading} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
