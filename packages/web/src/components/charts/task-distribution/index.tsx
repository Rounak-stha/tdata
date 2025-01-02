'use client'

import { LabelList, Pie, PieChart } from 'recharts'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
const chartData = [
	{ user: 'User_A', tasks: 275, fill: 'var(--color-User_A)' },
	{ user: 'User_B', tasks: 200, fill: 'var(--color-User_B)' },
	{ user: 'User_C', tasks: 187, fill: 'var(--color-User_C)' },
	{ user: 'User_D', tasks: 173, fill: 'var(--color-User_D)' },
	{ user: 'User_E', tasks: 90, fill: 'var(--color-User_E)' }
]

const chartConfig = {
	tasks: {
		label: 'tasks'
	},
	User_A: {
		label: 'User A',
		color: 'hsl(var(--chart-1))'
	},
	User_B: {
		label: 'User B',
		color: 'hsl(var(--chart-2))'
	},
	User_C: {
		label: 'User C',
		color: 'hsl(var(--chart-3))'
	},
	User_D: {
		label: 'User D',
		color: 'hsl(var(--chart-4))'
	},
	User_E: {
		label: 'User E',
		color: 'hsl(var(--chart-5))'
	}
} satisfies ChartConfig

export function TaskDistribution() {
	return (
		<Card className='flex flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>Pie Chart - Label List</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background'
				>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent nameKey='tasks' hideLabel />} />
						<Pie data={chartData} dataKey='tasks'>
							<LabelList
								dataKey='user'
								className='fill-background'
								stroke='none'
								fontSize={12}
								formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'>
				<div className='flex items-center gap-2 font-medium leading-none'>Open tasks assigned to users</div>
				<div className='leading-none text-muted-foreground'>Showing the workload for each user</div>
			</CardFooter>
		</Card>
	)
}
