"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SeasonEntry } from "@/lib/rank"

export function SeasonTable({ title, entries }: { title: string; entries: SeasonEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Đang cập nhật</div>
          ) : (
            entries.map((e) => (
              <div key={e.rank} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 text-center font-bold">{e.rank}</div>
                  <div className="font-medium">{e.name}</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-lg font-semibold">ELO: {e.elo}</div>
                  <Badge variant="outline">W/L: {e.wins}/{e.losses}</Badge>
                  <Badge variant="secondary">Ngắt kết nối: {e.disconnects}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}


