"use client"

import { useCallback, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  fetchProductReport,
  type ProductReportRow,
  type ProductReportTotals,
} from "@/lib/dashboard/services/reports"

const EMPTY_TOTALS: ProductReportTotals = {
  ecommerceQty: 0,
  ecommerceRevenue: 0,
  posQty: 0,
  posRevenue: 0,
  manualQty: 0,
  manualRevenue: 0,
  totalQty: 0,
  totalRevenue: 0,
}

export function useProductReport() {
  const { toast } = useToast()
  const [rows, setRows] = useState<ProductReportRow[]>([])
  const [totals, setTotals] = useState<ProductReportTotals>(EMPTY_TOTALS)
  const [isLoading, setIsLoading] = useState(false)

  const generate = useCallback(async (input: { startDate: string; endDate: string }) => {
    setIsLoading(true)
    try {
      const data = await fetchProductReport(input)
      setRows(data.rows)
      setTotals(data.totals)
      return true
    } catch {
      toast({
        title: "Error",
        description: "No se pudo generar el informe de productos.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    rows,
    totals,
    isLoading,
    generate,
  }
}
