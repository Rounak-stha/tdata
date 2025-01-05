import { Avatar } from '@components/ui/avatar'

export const Comment = () => {
	return (
		<div className='flex items-start space-x-3 text-sm'>
			<Avatar size='md' src='/placeholder.svg' />
			<div className='flex-1'>
				<div className='flex items-center space-x-2'>
					<span className='font-medium'>rsthaofficial</span>
					<span className='text-gray-500'>9 days ago</span>
				</div>
				<div className='mt-2 text-gray-300'>
					This is a comment tet. This is a dummy text. This is a comment tet. This is a dummy text. This is a
					comment tet. This is a dummy text.
				</div>
			</div>
		</div>
	)
}
