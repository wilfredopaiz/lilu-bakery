"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ProductReportRow } from "@/lib/dashboard/services/reports"
import { formatPrice } from "@/lib/format-price"

export function ProductsReportTable(props: { rows: ProductReportRow[] }) {
  const { rows } = props
  const totals = rows.reduce(
    (acc, row) => {
      acc.ecommerceRevenue += row.ecommerceRevenue
      acc.ecommerceQty += row.ecommerceQty
      acc.posRevenue += row.posRevenue
      acc.posQty += row.posQty
      acc.manualRevenue += row.manualRevenue
      acc.manualQty += row.manualQty
      acc.totalRevenue += row.totalRevenue
      acc.totalQty += row.totalQty
      return acc
    },
    {
      ecommerceRevenue: 0,
      ecommerceQty: 0,
      posRevenue: 0,
      posQty: 0,
      manualRevenue: 0,
      manualQty: 0,
      totalRevenue: 0,
      totalQty: 0,
    }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle por producto</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin ventas en este rango.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Ecommerce</TableHead>
                  <TableHead className="text-right">POS</TableHead>
                  <TableHead className="text-right">Manual</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={`${row.productId}-${row.productName}`}>
                    <TableCell className="font-medium">{row.productName}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm">{formatPrice(row.ecommerceRevenue)}</span>
                      <span className="block text-xs text-muted-foreground">{row.ecommerceQty} und</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm">{formatPrice(row.posRevenue)}</span>
                      <span className="block text-xs text-muted-foreground">{row.posQty} und</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm">{formatPrice(row.manualRevenue)}</span>
                      <span className="block text-xs text-muted-foreground">{row.manualQty} und</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold">{formatPrice(row.totalRevenue)}</span>
                      <span className="block text-xs text-muted-foreground">{row.totalQty} und</span>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold border-t border-border">Total</TableCell>
                  <TableCell className="text-right border-t border-border">
                    <span className="text-sm font-semibold">{formatPrice(totals.ecommerceRevenue)}</span>
                    <span className="block text-xs text-muted-foreground">{totals.ecommerceQty} und</span>
                  </TableCell>
                  <TableCell className="text-right border-t border-border">
                    <span className="text-sm font-semibold">{formatPrice(totals.posRevenue)}</span>
                    <span className="block text-xs text-muted-foreground">{totals.posQty} und</span>
                  </TableCell>
                  <TableCell className="text-right border-t border-border">
                    <span className="text-sm font-semibold">{formatPrice(totals.manualRevenue)}</span>
                    <span className="block text-xs text-muted-foreground">{totals.manualQty} und</span>
                  </TableCell>
                  <TableCell className="text-right border-t border-border">
                    <span className="text-sm font-bold">{formatPrice(totals.totalRevenue)}</span>
                    <span className="block text-xs text-muted-foreground">{totals.totalQty} und</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
