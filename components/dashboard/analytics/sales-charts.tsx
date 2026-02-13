"use client"

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format-price"

export function SalesCharts({ chartData }: { chartData: Array<Record<string, string | number>> }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Ventas por mes (L)</CardTitle>
          <CardDescription>3 líneas: Ecommerce, POS y Total</CardDescription>
        </CardHeader>
        <CardContent className="overflow-visible">
          <div className="h-64 w-full px-4">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={chartData} margin={{ top: 28, right: 32, left: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 16, right: 16 }} />
                <YAxis hide />
                <Tooltip formatter={(value) => formatPrice(Number(value))} />
                <Line type="monotone" dataKey="total" name="Total" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }}>
                  <LabelList dataKey="total" position="top" offset={10} formatter={(value: number) => formatPrice(Number(value))} />
                </Line>
                <Line type="monotone" dataKey="ecommerce" name="Ecommerce" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }}>
                  <LabelList dataKey="ecommerce" position="top" offset={10} formatter={(value: number) => formatPrice(Number(value))} />
                </Line>
                <Line type="monotone" dataKey="pos" name="POS" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }}>
                  <LabelList dataKey="pos" position="top" offset={10} formatter={(value: number) => formatPrice(Number(value))} />
                </Line>
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Ventas por mes (Galletas vs Brownies)</CardTitle>
          <CardDescription>Total Ecommerce + POS</CardDescription>
        </CardHeader>
        <CardContent className="overflow-visible">
          <div className="h-64 w-full px-4">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={chartData} margin={{ top: 28, right: 32, left: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 16, right: 16 }} />
                <YAxis hide />
                <Tooltip formatter={(value) => formatPrice(Number(value))} />
                <Line type="monotone" dataKey="cookies" name="Galletas" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }}>
                  <LabelList dataKey="cookies" position="top" offset={10} formatter={(value: number) => formatPrice(Number(value))} />
                </Line>
                <Line type="monotone" dataKey="brownies" name="Brownies" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }}>
                  <LabelList dataKey="brownies" position="top" offset={10} formatter={(value: number) => formatPrice(Number(value))} />
                </Line>
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

