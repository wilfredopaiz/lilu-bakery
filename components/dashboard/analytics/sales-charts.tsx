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
          <CardDescription>4 líneas: Ecommerce, POS, Manual y Total</CardDescription>
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
                <Line type="monotone" dataKey="manual" name="Manual" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }}>
                  <LabelList dataKey="manual" position="top" offset={10} formatter={(value: number) => formatPrice(Number(value))} />
                </Line>
              </ReLineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 px-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
              Total
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#2563eb" }} />
              Ecommerce
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#10b981" }} />
              POS
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />
              Manual
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Ventas por mes (Galletas vs Brownies)</CardTitle>
          <CardDescription>Total Ecommerce + POS + Manual</CardDescription>
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
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 px-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
              Galletas
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#6366f1" }} />
              Brownies
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

