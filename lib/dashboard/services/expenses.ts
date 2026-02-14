export const EXPENSE_CATEGORIES = [
  "advertising",
  "specialized_baking_supplies",
  "raw_materials",
  "shipping",
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  advertising: "Publicidad",
  specialized_baking_supplies: "Insumos de repostería especializada",
  raw_materials: "Materia Prima (supermercado)",
  shipping: "Gastos de envío",
}

export interface Expense {
  id: string
  expenseDate: string
  amount: number
  category: ExpenseCategory
  description: string
  createdAt: string
  updatedAt: string
}

function mapExpense(expense: any): Expense {
  return {
    id: expense.id,
    expenseDate: expense.expense_date,
    amount: Number(expense.amount ?? 0),
    category: expense.category as ExpenseCategory,
    description: expense.description,
    createdAt: expense.created_at,
    updatedAt: expense.updated_at,
  }
}

export async function fetchExpenses() {
  const response = await fetch("/api/admin/expenses")
  if (!response.ok) {
    throw new Error("Failed to fetch expenses")
  }
  const payload = await response.json()
  return (payload.expenses ?? []).map(mapExpense)
}

export async function createExpense(input: {
  expenseDate: string
  amount: number
  category: ExpenseCategory
  description: string
}) {
  const response = await fetch("/api/admin/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to create expense")
  }
  const payload = await response.json()
  return mapExpense(payload.expense)
}

export async function updateExpense(input: {
  id: string
  expenseDate: string
  amount: number
  category: ExpenseCategory
  description: string
}) {
  const response = await fetch("/api/admin/expenses", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to update expense")
  }
  const payload = await response.json()
  return mapExpense(payload.expense)
}

export async function deleteExpense(id: string) {
  const response = await fetch("/api/admin/expenses", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  if (!response.ok) {
    throw new Error("Failed to delete expense")
  }
}
