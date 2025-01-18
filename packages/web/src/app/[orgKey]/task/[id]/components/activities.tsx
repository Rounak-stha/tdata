import { Comment, CommentBox } from '@/components/comment'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export const TaskActivities = () => {
	return (
		<div>
			<div className='space-y-4'>
				<CommentBox />
				<Comment />
				<Comment />
				{[
					{ type: 'created', time: '4 months ago' },
					{ type: 'label', label: 'labela', time: '10 days ago' },
					{ type: 'label', label: 'ne label', time: '10 days ago' },
					{ type: 'label', label: 'super label', time: '10 days ago' },
					{ type: 'label', label: 'haha', time: '10 days ago' },
					{ type: 'assignee', time: '10 days ago' },
					{ type: 'title', time: '9 days ago' },
					{ type: 'description', time: '9 days ago' }
				].map((activity, i) => (
					<div key={i} className='flex items-start space-x-3 text-sm'>
						<Avatar size='md' src='/placeholder.svg' />
						<div className='flex-1'>
							<div className='flex items-center space-x-2'>
								<span className='font-medium'>rsthaofficial</span>
								{activity.type === 'created' && (
									<span className='text-gray-400'>created the issue</span>
								)}
								{activity.type === 'label' && (
									<>
										<span className='text-gray-400'>added a new label</span>
										<Badge
											variant='outline'
											className='bg-purple-500/10 text-purple-400 border-purple-500/20'
										>
											{activity.label}
										</Badge>
									</>
								)}
								{activity.type === 'assignee' && (
									<span className='text-gray-400'>added a new assignee Rsthaofficial</span>
								)}
								{activity.type === 'title' && (
									<span className='text-gray-400'>set the name to Task Title</span>
								)}
								{activity.type === 'description' && (
									<span className='text-gray-400'>updated the description</span>
								)}
								<span className='text-gray-500'>{activity.time}</span>
							</div>
						</div>
					</div>
				))}
				<Comment />
			</div>
		</div>
	)
}
