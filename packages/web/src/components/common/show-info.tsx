import { FC } from 'react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

type ShowInfoProps = {
	message: string
}

export const ShowInfo: FC<ShowInfoProps> = ({ message }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<InfoIcon className='h-4 w-4 text-muted-foreground hover:text-foreground transition-colors' />
				</TooltipTrigger>
				<TooltipContent>
					<p className='text-sm'>{message}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
