"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "An interactive area chart";

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: { date: string; enrollments: number }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber = useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollments for the last 30 days: {totalEnrollmentsNumber}
          </span>
          <span className="@[540px]/card:hidden">
            Last 30 days: {totalEnrollmentsNumber}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pt-4 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="w-full h-[250px] aspect-auto"
        >
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"enrollments"} fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
