"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntitySelector } from "@/components/ui/entity-selector";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const allDates = [
  { date: "2023-05-01", tasks: 3 },
  { date: "2023-05-02", tasks: 2 },
  { date: "2023-05-03", tasks: 5 },
  { date: "2023-05-04", tasks: 1 },
  { date: "2023-05-05", tasks: 4 },
  { date: "2023-05-06", tasks: 2 },
  { date: "2023-05-07", tasks: 3 },
];

const dateOptions = allDates.map((d) => ({
  label: new Date(d.date).toLocaleDateString(),
  value: d.date,
}));

export function UpcomingDeadlinesChart() {
  const [selectedDates, setSelectedDates] = useState<string[]>(allDates.map((d) => d.date));

  const filteredData = allDates.filter((d) => selectedDates.includes(d.date));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Upcoming Deadlines</CardTitle>
        <EntitySelector entities={dateOptions} selected={selectedDates} onChange={setSelectedDates} />
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, bottom: 25, left: 20 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis tick={{ fill: "hsl(var(--foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 4 }} activeDot={{ r: 6, fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
