"use client"

import { Button } from "@/components/ui/button"

export type ReportType = "general" | "products"

export function ReportTypeSelector(props: {
  value: ReportType
  onChange: (next: ReportType) => void
}) {
  const { value, onChange } = props

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Tipo de informe</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={value === "general" ? "default" : "outline"}
          className={value === "general" ? "" : "bg-transparent"}
          onClick={() => onChange("general")}
        >
          General
        </Button>
        <Button
          type="button"
          variant={value === "products" ? "default" : "outline"}
          className={value === "products" ? "" : "bg-transparent"}
          onClick={() => onChange("products")}
        >
          Productos
        </Button>
      </div>
    </div>
  )
}
