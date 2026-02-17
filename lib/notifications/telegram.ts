export interface OrderNotificationItem {
  productName: string
  quantity: number
  price: number
  lineTotal: number
}

export interface OrderCreatedNotificationPayload {
  orderNumber: string
  origin: "ecommerce" | "pos" | "manual"
  customerName: string
  phoneNumber: string
  status: string
  currency: string
  total: number
  shippingFee: number
  shippingDate: string
  notes?: string | null
  createdAt?: string
  items: OrderNotificationItem[]
}

interface SendTelegramResult {
  chatId: string
  ok: boolean
  error?: string
}

export interface OrderNotificationResult {
  status: "sent" | "partial" | "skipped"
  successCount: number
  failureCount: number
  failures: Array<{ chatId: string; error: string }>
}

function formatMoney(currency: string, value: number) {
  try {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: currency || "HNL",
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function buildOrderCreatedMessage(payload: OrderCreatedNotificationPayload) {
  const subtotal = payload.items.reduce((sum, item) => sum + item.lineTotal, 0)
  const shippingDate = payload.shippingDate
    ? new Date(`${payload.shippingDate}T00:00:00`).toLocaleDateString("es-HN")
    : "N/A"

  const itemsText = payload.items
    .map((item) => {
      return `• ${escapeHtml(item.productName)} x${item.quantity} = ${escapeHtml(
        formatMoney(payload.currency, item.lineTotal)
      )}`
    })
    .join("\n")

  const notesText = payload.notes?.trim()
    ? `\n📝 <b>Notas</b>: ${escapeHtml(payload.notes.trim())}`
    : ""

  return (
    `🧁 <b>Nueva compra ecommerce</b>\n` +
    `#️⃣ <b>Orden</b>: ${escapeHtml(payload.orderNumber)}\n` +
    `👤 <b>Cliente</b>: ${escapeHtml(payload.customerName)}\n` +
    `📞 <b>Teléfono</b>: ${escapeHtml(payload.phoneNumber)}\n` +
    `📦 <b>Estado</b>: ${escapeHtml(payload.status)}\n` +
    `🚚 <b>Fecha envío</b>: ${escapeHtml(shippingDate)}\n` +
    `\n` +
    `💵 <b>Subtotal</b>: ${escapeHtml(formatMoney(payload.currency, subtotal))}\n` +
    `🚚 <b>Envío</b>: ${escapeHtml(formatMoney(payload.currency, payload.shippingFee))}\n` +
    `✅ <b>Total</b>: ${escapeHtml(formatMoney(payload.currency, payload.total))}\n` +
    `\n` +
    `🧾 <b>Items</b>:\n${itemsText || "• Sin items"}${notesText}`
  )
}

function parseChatIds(csv: string | undefined) {
  if (!csv) return []
  return csv
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
}

async function sendTelegramMessage(params: {
  botToken: string
  chatId: string
  text: string
}): Promise<SendTelegramResult> {
  const { botToken, chatId, text } = params

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })

    if (!response.ok) {
      const raw = await response.text()
      return { chatId, ok: false, error: `HTTP ${response.status}: ${raw.slice(0, 300)}` }
    }

    const payload = (await response.json()) as { ok?: boolean; description?: string }
    if (!payload.ok) {
      return { chatId, ok: false, error: payload.description || "Telegram API error" }
    }

    return { chatId, ok: true }
  } catch (error) {
    return { chatId, ok: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendOrderCreatedNotification(
  payload: OrderCreatedNotificationPayload
): Promise<OrderNotificationResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = parseChatIds(process.env.TELEGRAM_CHAT_IDS)

  if (!botToken || chatIds.length === 0) {
    console.warn("[telegram-notify] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS. Notification skipped.")
    return {
      status: "skipped",
      successCount: 0,
      failureCount: 0,
      failures: [],
    }
  }

  const text = buildOrderCreatedMessage(payload)
  const sendTasks = chatIds.map((chatId) =>
    sendTelegramMessage({
      botToken,
      chatId,
      text,
    })
  )

  const settled = await Promise.allSettled(sendTasks)
  const results = settled.map((entry) =>
    entry.status === "fulfilled"
      ? entry.value
      : { chatId: "unknown", ok: false, error: entry.reason instanceof Error ? entry.reason.message : "Unknown error" }
  )

  const failures = results
    .filter((item) => !item.ok)
    .map((item) => ({ chatId: item.chatId, error: item.error || "Unknown error" }))

  const successCount = results.filter((item) => item.ok).length
  const failureCount = failures.length

  return {
    status: failureCount === 0 ? "sent" : successCount > 0 ? "partial" : "skipped",
    successCount,
    failureCount,
    failures,
  }
}
