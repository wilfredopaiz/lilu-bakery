"use client"

import { useCallback, useEffect, useState } from "react"
import { fetchConfig, updateConfig } from "@/lib/dashboard/services/configs"
import { useToast } from "@/hooks/use-toast"

export function useConfig() {
  const { toast } = useToast()
  const [shippingFee, setShippingFee] = useState(120)
  const [closedDates, setClosedDates] = useState<string[]>([])
  const [newClosedDate, setNewClosedDate] = useState("")
  const [isSavingConfig, setIsSavingConfig] = useState(false)

  const reloadConfig = useCallback(async () => {
    try {
      const config = await fetchConfig()
      setShippingFee(Number(config?.shipping_fee ?? 120))
      setClosedDates((config?.closed_dates ?? []) as string[])
    } catch {
      toast({ title: "Error", description: "No se pudo cargar configuración.", variant: "destructive" })
    }
  }, [toast])

  useEffect(() => {
    reloadConfig()
  }, [reloadConfig])

  const addClosedDate = () => {
    if (!newClosedDate) return
    if (closedDates.includes(newClosedDate)) {
      setNewClosedDate("")
      return
    }
    setClosedDates((prev) => [...prev, newClosedDate].sort())
    setNewClosedDate("")
  }

  const removeClosedDate = (date: string) => {
    setClosedDates((prev) => prev.filter((item) => item !== date))
  }

  const saveConfig = async () => {
    setIsSavingConfig(true)
    try {
      await updateConfig({ shippingFee: Number(shippingFee), closedDates })
      toast({ title: "Configuración guardada", description: "Los cambios se aplicaron correctamente.", variant: "success" })
      return true
    } catch {
      toast({ title: "Error al guardar", description: "No se pudo actualizar la configuración.", variant: "destructive" })
      return false
    } finally {
      setIsSavingConfig(false)
    }
  }

  return {
    shippingFee,
    setShippingFee,
    closedDates,
    newClosedDate,
    setNewClosedDate,
    isSavingConfig,
    addClosedDate,
    removeClosedDate,
    saveConfig,
  }
}

