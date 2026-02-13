export async function fetchConfig() {
  const response = await fetch("/api/admin/configs")
  if (!response.ok) {
    throw new Error("Failed to fetch config")
  }
  const payload = await response.json()
  return payload.config
}

export async function updateConfig(input: { shippingFee: number; closedDates: string[] }) {
  const response = await fetch("/api/admin/configs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to update config")
  }
  return response.json()
}
