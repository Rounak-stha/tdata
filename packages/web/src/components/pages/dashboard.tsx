import { ProjectProgress, TaskDistribution, TeamWorkload, UpcomingDeadlinesChart } from '@components/charts'

export default function Dashboard() {
	return (
		<div className='min-h-screen bg-background p-4'>
			<div className='container py-4'>
				<div className='text-4xl font-bold text-accent-foreground'>Dashboard</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4'>
					<ProjectProgress />
					<TaskDistribution />
					<TeamWorkload />
					<UpcomingDeadlinesChart />
				</div>
			</div>
		</div>
	)
}
