import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

const EXPENSE_CATEGORIES = [
  "advertising",
  "specialized_baking_supplies",
  "raw_materials",
  "shipping",
] as const

function isValidExpenseCategory(value: unknown): value is (typeof EXPENSE_CATEGORIES)[number] {
  return typeof value === "string" && EXPENSE_CATEGORIES.includes(value as (typeof EXPENSE_CATEGORIES)[number])
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("expenses")
    .select("id, expense_date, amount, category, description, created_at, updated_at")
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }

  return NextResponse.json({ expenses: data ?? [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { expenseDate, amount, category, description } = body ?? {}

    if (
      !expenseDate ||
      typeof amount !== "number" ||
      Number.isNaN(amount) ||
      !isValidExpenseCategory(category) ||
      !description
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .insert({
        expense_date: expenseDate,
        amount,
        category,
        description,
      })
      .select("id, expense_date, amount, category, description, created_at, updated_at")
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
    }

    return NextResponse.json({ expense: data })
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, expenseDate, amount, category, description } = body ?? {}

    if (!id) {
      return NextResponse.json({ error: "Missing expense id" }, { status: 400 })
    }

    if (typeof category !== "undefined" && !isValidExpenseCategory(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (typeof expenseDate === "string") updates.expense_date = expenseDate
    if (typeof amount === "number" && !Number.isNaN(amount)) updates.amount = amount
    if (typeof category === "string") updates.category = category
    if (typeof description === "string") updates.description = description

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select("id, expense_date, amount, category, description, created_at, updated_at")
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update expense" }, { status: 500 })
    }

    return NextResponse.json({ expense: data })
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body ?? {}

    if (!id) {
      return NextResponse.json({ error: "Missing expense id" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("expenses").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

