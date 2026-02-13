"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function ClosedDatesCard(props: {
  newClosedDate: string
  setNewClosedDate: (value: string) => void
  closedDates: string[]
  onAddDate: () => void
  onRemoveDate: (date: string) => void
}) {
  const { newClosedDate, setNewClosedDate, closedDates, onAddDate, onRemoveDate } = props

  return (
    <Card>
      <CardHeader><CardTitle>Fechas cerradas de envío</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input type="date" value={newClosedDate} onChange={(e) => setNewClosedDate(e.target.value)} />
          <Button type="button" onClick={onAddDate}>Agregar fecha</Button>
        </div>
        {closedDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay fechas cerradas configuradas.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {closedDates.map((date) => (
              <div key={date} className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
                <span>{new Date(`${date}T00:00:00`).toLocaleDateString("es-HN")}</span>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveDate(date)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

