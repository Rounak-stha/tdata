import { Avatar } from '@components/ui/avatar'
import { Editor } from '@tdata/editor'

export const CommentBox = () => {
	return (
		<div className='flex space-x-3'>
			<Avatar size='lg' className='mt-1' src='/placeholder.svg' />
			<Editor className='border rounded-sm py-1 px-4 min-h-16 text-sm' />
		</div>
	)
}
