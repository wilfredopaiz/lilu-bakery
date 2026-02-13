export function normalizeProduct(product: any) {
  return {
    ...product,
    isSeasonal: product?.is_seasonal ?? product?.isSeasonal ?? false,
    seasonKey: product?.season_key ?? product?.seasonKey ?? null,
  }
}

export function mapOrder(order: any) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    phoneNumber: order.phone_number,
    status: order.status,
    origin: order.origin,
    total: order.total,
    createdAt: order.created_at,
    shippingDate: order.shipping_date,
    shippingFee: order.shipping_fee,
    notes: order.notes,
    items: (order.order_items || []).map((item: any) => ({
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      price: item.unit_price,
      lineTotal: item.line_total,
    })),
  }
}
