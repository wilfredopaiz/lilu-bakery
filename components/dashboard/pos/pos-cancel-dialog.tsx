"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function PosCancelDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}) {
  const { open, onOpenChange, onConfirm, onCancel } = props

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar venta POS</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción marcará la venta como cancelada. Puedes reactivarla después si fue un error.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Volver</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar cancelación</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

