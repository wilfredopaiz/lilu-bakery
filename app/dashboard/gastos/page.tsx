"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useExpenses } from "@/hooks/dashboard/use-expenses"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  type Expense,
  type ExpenseCategory,
} from "@/lib/dashboard/services/expenses"

export default function DashboardGastosPage() {
  const { expenses, isLoadingExpenses, isSavingExpense, addExpense, editExpense, removeExpense } = useExpenses()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)

  const [newExpenseDate, setNewExpenseDate] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState("")
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0])
  const [newExpenseDescription, setNewExpenseDescription] = useState("")

  const [editExpenseDate, setEditExpenseDate] = useState("")
  const [editExpenseAmount, setEditExpenseAmount] = useState("")
  const [editExpenseCategory, setEditExpenseCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0])
  const [editExpenseDescription, setEditExpenseDescription] = useState("")

  const handleAddExpense = async () => {
    if (!newExpenseDate || !newExpenseAmount || !newExpenseDescription.trim()) return
    const ok = await addExpense({
      expenseDate: newExpenseDate,
      amount: Number(newExpenseAmount),
      category: newExpenseCategory,
      description: newExpenseDescription.trim(),
    })
    if (!ok) return
    setNewExpenseDate("")
    setNewExpenseAmount("")
    setNewExpenseCategory(EXPENSE_CATEGORIES[0])
    setNewExpenseDescription("")
    setIsAddDialogOpen(false)
  }

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setEditExpenseDate(expense.expenseDate)
    setEditExpenseAmount(String(expense.amount))
    setEditExpenseCategory(expense.category)
    setEditExpenseDescription(expense.description)
  }

  const handleSaveEdit = async () => {
    if (!editingExpense) return
    if (!editExpenseDate || !editExpenseAmount || !editExpenseDescription.trim()) return

    const ok = await editExpense({
      id: editingExpense.id,
      expenseDate: editExpenseDate,
      amount: Number(editExpenseAmount),
      category: editExpenseCategory,
      description: editExpenseDescription.trim(),
    })
    if (!ok) return
    setEditingExpense(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Gastos</h1>
          <p className="text-sm text-muted-foreground">Registra y edita gastos por fecha para calcular ingresos netos.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar gasto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar gasto</DialogTitle>
              <DialogDescription>Registra un nuevo gasto operativo.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="expense-date">Fecha</Label>
                <Input id="expense-date" type="date" value={newExpenseDate} onChange={(e) => setNewExpenseDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Monto (L)</Label>
                <Input id="expense-amount" type="number" min={0} step="0.01" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={newExpenseCategory} onValueChange={(value: ExpenseCategory) => setNewExpenseCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {EXPENSE_CATEGORY_LABELS[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-description">Descripción</Label>
                <Input id="expense-description" value={newExpenseDescription} onChange={(e) => setNewExpenseDescription(e.target.value)} placeholder="Ej. Compra de insumos" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddExpense} disabled={isSavingExpense}>{isSavingExpense ? "Guardando..." : "Guardar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{new Date(`${expense.expenseDate}T00:00:00`).toLocaleDateString("es-HN")}</TableCell>
                  <TableCell>{EXPENSE_CATEGORY_LABELS[expense.category]}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-right font-semibold">{formatPrice(expense.amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" className="bg-transparent" onClick={() => openEdit(expense)} aria-label="Editar gasto">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="bg-transparent text-destructive hover:text-destructive" onClick={() => setExpenseToDelete(expense)} aria-label="Eliminar gasto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoadingExpenses && expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No hay gastos registrados.</TableCell>
                </TableRow>
              )}
              {isLoadingExpenses && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Cargando gastos...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(editingExpense)} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar gasto</DialogTitle>
            <DialogDescription>Actualiza la información del gasto.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-expense-date">Fecha</Label>
              <Input id="edit-expense-date" type="date" value={editExpenseDate} onChange={(e) => setEditExpenseDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-amount">Monto (L)</Label>
              <Input id="edit-expense-amount" type="number" min={0} step="0.01" value={editExpenseAmount} onChange={(e) => setEditExpenseAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={editExpenseCategory} onValueChange={(value: ExpenseCategory) => setEditExpenseCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {EXPENSE_CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-description">Descripción</Label>
              <Input id="edit-expense-description" value={editExpenseDescription} onChange={(e) => setEditExpenseDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setEditingExpense(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={isSavingExpense}>{isSavingExpense ? "Guardando..." : "Guardar cambios"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(expenseToDelete)} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!expenseToDelete) return
                const ok = await removeExpense(expenseToDelete.id)
                if (ok) setExpenseToDelete(null)
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

