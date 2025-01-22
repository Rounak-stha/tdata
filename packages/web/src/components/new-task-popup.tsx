'use client'

import { useRouter } from 'next/navigation'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Editor } from '@tdata/editor'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusSelect } from '@components/selects/status'
import { PrioritySelect } from '@components/selects/priority'
import { AssigneeSelect } from '@components/selects/assignee'
import { Priority } from '@/types/kanban'
import { WorkflowStatus } from '@/types/workflow'
import { ProjectSelect } from './selects/project'
import { ContentRefValue, FormItemContentRefValue } from '@tdata/global'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useOrganizations, useOrganizationStatus, useUser } from '@/hooks'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { toast } from 'sonner'
import { Project } from '@/types/project'
import { createTask } from '@/lib/actions/task'
import { Paths } from '@/lib/constants'

interface NewTaskPopupProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	parentTaskId?: string
	parentTaskTitle?: string
	status?: WorkflowStatus
	priority?: Priority
	project?: Project
}

type FormItem = 'title' | 'project' | 'content' | 'status' | 'priority'
type RequiredFormItem = Extract<FormItem, 'title' | 'project'> // Status is defaulted to `To Do` and Priority is defaulted to `No Priority`

type FormItemValue = {
	assignee: string | undefined // Assignee Id
	content: string
	priority: Priority
	project: Project | undefined
	status: WorkflowStatus
	title: string
	date: Date | undefined
	parentId: string | undefined
}

type FormRef = { [key in FormItem]: FormItemContentRefValue<FormItemValue[key]> | null }

const REQUIRED_FORM_REF_KEYS: RequiredFormItem[] = ['title', 'project']
const ErrorDisplayDuration = 3000

export function NewTaskPopup({
	open,
	onOpenChange,
	parentTaskId,
	parentTaskTitle,
	status,
	priority,
	project
}: NewTaskPopupProps) {
	const [loading, setLoading] = useState(false)
	const formRefs = useRef<FormRef>({} as FormRef)
	const { organization } = useOrganizations()
	const { user } = useUser()
	const router = useRouter()

	console.log(organization)

	const validateForm = () => {
		let hasError = false

		REQUIRED_FORM_REF_KEYS.forEach((key) => {
			const ref = formRefs.current[key]
			if (!ref?.getContent()) {
				ref?.showError()
				hasError = true
			}
		})

		return hasError
	}

	const getTaskData = () => {
		const title = formRefs.current['title']?.getContent() as FormItemValue['title']
		const projectId = (formRefs.current['project']?.getContent() as FormItemValue['project'])?.id || 0
		const content = formRefs.current['content']?.getContent() as FormItemValue['content']
		const statusId = (formRefs.current['status']?.getContent() as FormItemValue['status']).id
		const priority = formRefs.current['priority']?.getContent() as FormItemValue['priority']
		const organizationId = organization.id
		const workflowId = organization.workflow.id
		const createdBy = user.id
		return {
			title,
			organizationId,
			projectId,
			workflowId,
			content,
			statusId,
			priority,
			createdBy,
			taskNumber: 'Dummy'
		}
	}

	const submitForm = async () => {
		try {
			setLoading(true)
			if (validateForm()) return
			const taskData = getTaskData()
			const createdTask = await createTask(taskData)
			// onCreate(createdTask);
			router.push(Paths.task(organization.key, createdTask.taskNumber))
		} catch (error) {
			console.log(error)
			toast.error('Failed to create task')
		} finally {
			setLoading(false)
		}
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<VisuallyHidden>
				<DialogTitle>New Task Dialog</DialogTitle>
			</VisuallyHidden>
			<DialogContent className='sm:max-w-[800px] bg-muted border p-0'>
				<div className='flex flex-col h-[80vh]'>
					<DialogHeader className='p-4 border-b flex-shrink-0'>
						<SelectProjectFormItem
							ref={(val) => {
								formRefs.current['project'] = val
							}}
							project={project}
						/>
						<div className='flex items-center gap-2 mt-2 text-sm text-gray-400'>
							<span>{parentTaskId}</span>
							<span>{parentTaskTitle}</span>
						</div>
					</DialogHeader>

					<ScrollArea className='flex-grow'>
						<div className='p-4 space-y-4'>
							<TitleFormItem
								ref={(val) => {
									formRefs.current['title'] = val
								}}
							/>
							<EditorFormItem
								ref={(val) => {
									formRefs.current['content'] = val
								}}
							/>
						</div>
					</ScrollArea>

					<div className='flex items-center gap-2 p-3 border-t overflow-x-auto flex-shrink-0'>
						<ScrollArea className='w-full'>
							<div className='flex gap-2 p-1'>
								<SelectStatusFormItem
									ref={(val) => {
										formRefs.current['status'] = val
									}}
									status={status}
								/>
								<SelectPriorityFormItem
									ref={(val) => {
										formRefs.current['priority'] = val
									}}
									priority={priority}
								/>
								<AssigneeSelect />
								{/* <Button
									variant='outline'
									size='sm'
									className='h-7 bg-[#2A2A2A] text-gray-100 border hover:bg-gray-800 hover:text-gray-100 whitespace-nowrap'
								>
									{parentTaskId}
								</Button> */}
							</div>
						</ScrollArea>
					</div>

					<DialogFooter className='p-4 border-t flex-shrink-0'>
						<div className='flex items-center gap-2 ml-auto'>
							<Button disabled={loading} variant='ghost' onClick={() => onOpenChange(false)}>
								Discard
							</Button>
							<Button disabled={loading} onClick={submitForm}>
								Save
							</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}

const TitleFormItem = forwardRef<FormItemContentRefValue<FormItemValue['title']>>(function Title(_, ref) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [tooltipOpen, setTooltipOpen] = useState(false)

	useImperativeHandle(ref, () => ({
		getContent: () => inputRef.current?.value || '',
		showError: () => setTooltipOpen(true)
	}))

	useEffect(() => {
		if (tooltipOpen) {
			setTimeout(() => {
				setTooltipOpen(false)
			}, ErrorDisplayDuration)
		}
	}, [tooltipOpen])

	return (
		<TooltipProvider>
			<Tooltip open={tooltipOpen}>
				<TooltipTrigger asChild>
					<Input ref={inputRef} placeholder='Title' className='focus-visible:ring-ring' autoFocus />
				</TooltipTrigger>
				<TooltipContent align='start' sideOffset={10}>
					<p className='text-xs p-1 bg-destructive text-foreground rounded-md'>Title is requried</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
})

const EditorFormItem = forwardRef<FormItemContentRefValue<FormItemValue['content']>>(function ContentEditorFormItem(
	_,
	ref
) {
	const editorRef = useRef<ContentRefValue | null>({} as ContentRefValue)

	useImperativeHandle(ref, () => ({
		getContent: () => editorRef.current?.getContent() || '',
		showError: () => {}
	}))

	return (
		<Editor
			ref={(val) => {
				editorRef.current = val
			}}
		/>
	)
})

const SelectProjectFormItem = forwardRef<FormItemContentRefValue<FormItemValue['project']>, { project?: Project }>(
	function SelectPriorityFormItem({ project: initialProject }, ref) {
		const [project, setProject] = useState<Project | undefined>(initialProject)
		const [tooltipOpen, setTooltipOpen] = useState(false)

		useEffect(() => {
			if (tooltipOpen) {
				setTimeout(() => {
					setTooltipOpen(false)
				}, ErrorDisplayDuration)
			}
		}, [tooltipOpen])

		useImperativeHandle(ref, () => ({
			getContent: () => project,
			showError: () => setTooltipOpen(true)
		}))

		return (
			<TooltipProvider>
				<Tooltip open={tooltipOpen}>
					<TooltipTrigger asChild>
						<div>
							<ProjectSelect project={project} onSelect={setProject} />
						</div>
					</TooltipTrigger>
					<TooltipContent align='start' sideOffset={10}>
						<p className='text-xs p-1 bg-destructive text-foreground rounded-md'>Project is requried</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		)
	}
)

const SelectPriorityFormItem = forwardRef<FormItemContentRefValue<FormItemValue['priority']>, { priority?: Priority }>(
	function SelectPriorityFormItem({ priority: initialPriority }, ref) {
		const [priority, setPriority] = useState<Priority>(initialPriority || 'MEDIUM')

		useImperativeHandle(ref, () => ({
			getContent: () => priority,
			showError: () => {}
		}))

		return (
			<div className='relative'>
				<PrioritySelect priority={priority} onChange={setPriority} />
			</div>
		)
	}
)

const SelectStatusFormItem = forwardRef<FormItemContentRefValue<FormItemValue['status']>, { status?: WorkflowStatus }>(
	function SelectStatusFormItem({ status: initialStatus }, ref) {
		const organizationStatuses = useOrganizationStatus()
		const [status, setStatus] = useState<WorkflowStatus>(initialStatus || organizationStatuses[0])

		useImperativeHandle(ref, () => ({
			getContent: () => status,
			showError: () => {}
		}))

		return (
			<div className='relative'>
				<StatusSelect status={status} allStatus={organizationStatuses} onChange={setStatus} />
			</div>
		)
	}
)
