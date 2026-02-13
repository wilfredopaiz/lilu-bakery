"use client"

import { Button } from "@/components/ui/button"
import { useConfig } from "@/hooks/dashboard/use-config"
import { ShippingConfigCard } from "@/components/dashboard/settings/shipping-config-card"
import { ClosedDatesCard } from "@/components/dashboard/settings/closed-dates-card"

export default function DashboardConfiguracionPage() {
  const {
    shippingFee,
    setShippingFee,
    closedDates,
    newClosedDate,
    setNewClosedDate,
    isSavingConfig,
    addClosedDate,
    removeClosedDate,
    saveConfig,
  } = useConfig()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Configuración</h1>
        <p className="text-sm text-muted-foreground">Ajusta costos de envío y fechas cerradas.</p>
      </div>

      <ShippingConfigCard shippingFee={shippingFee} setShippingFee={setShippingFee} />
      <ClosedDatesCard
        newClosedDate={newClosedDate}
        setNewClosedDate={setNewClosedDate}
        closedDates={closedDates}
        onAddDate={addClosedDate}
        onRemoveDate={removeClosedDate}
      />

      <div className="flex justify-end">
        <Button onClick={() => void saveConfig()} disabled={isSavingConfig}>
          {isSavingConfig ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  )
}

