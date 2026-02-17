"use client"

import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  createExpense,
  deleteExpense,
  type ExpenseCategory,
  fetchExpenses,
  updateExpense,
  type Expense,
} from "@/lib/dashboard/services/expenses"

export function useExpenses(enabled = true) {
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false)
  const [isSavingExpense, setIsSavingExpense] = useState(false)

  const reloadExpenses = useCallback(async () => {
    setIsLoadingExpenses(true)
    try {
      const data = await fetchExpenses()
      setExpenses(data)
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar los gastos.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingExpenses(false)
    }
  }, [toast])

  useEffect(() => {
    if (enabled) {
      reloadExpenses()
    }
  }, [enabled, reloadExpenses])

  const addExpense = async (input: {
    expenseDate: string
    amount: number
    category: ExpenseCategory
    description: string
  }) => {
    setIsSavingExpense(true)
    try {
      const created = await createExpense(input)
      setExpenses((prev) => [created, ...prev])
      toast({ title: "Gasto creado", description: "El gasto se registró correctamente." })
      return true
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear el gasto.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSavingExpense(false)
    }
  }

  const editExpense = async (input: {
    id: string
    expenseDate: string
    amount: number
    category: ExpenseCategory
    description: string
  }) => {
    setIsSavingExpense(true)
    try {
      const updated = await updateExpense(input)
      setExpenses((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      toast({ title: "Gasto actualizado", description: "Los cambios se guardaron correctamente." })
      return true
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el gasto.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSavingExpense(false)
    }
  }

  const removeExpense = async (id: string) => {
    setIsSavingExpense(true)
    try {
      await deleteExpense(id)
      setExpenses((prev) => prev.filter((item) => item.id !== id))
      toast({ title: "Gasto eliminado", description: "El gasto se eliminó correctamente." })
      return true
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar el gasto.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSavingExpense(false)
    }
  }

  return {
    expenses,
    isLoadingExpenses,
    isSavingExpense,
    reloadExpenses,
    addExpense,
    editExpense,
    removeExpense,
  }
}
