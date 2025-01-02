'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
const chartData = [
	{ project: 'Design', tasks: 186 },
	{ project: 'Analytics', tasks: 305 },
	{ project: 'Mobile', tasks: 237 },
	{ project: 'Quality', tasks: 73 },
	{ project: 'Admin', tasks: 209 },
	{ project: 'Support', tasks: 214 }
]

const chartConfig = {
	tasks: {
		label: 'Tasks',
		color: 'hsl(var(--chart-1))'
	}
} satisfies ChartConfig

export function ProjectProgress() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Bar Chart</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='project'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 10)}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Bar dataKey='tasks' fill='var(--color-tasks)' radius={8} />
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<div className='flex gap-2 font-medium leading-none'>Number of completed task by project</div>
				<div className='leading-none text-muted-foreground'>In the last 6 months</div>
			</CardFooter>
		</Card>
	)
}
