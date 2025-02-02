import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'

import { Label } from '@components/ui/label'
import { TooltipTrigger } from '@components/ui/tooltip'
import { Input } from '@components/ui/input'
import { AssigneeSelect, CustomValueSelect } from '@components/selects'

import { TaskPropertyValue, User, TemplateProperty, ChangeParams } from '@/types'
import { useDebounce } from '@/hooks'
import { DebounceDelay } from '@/lib/constants'

/**
 * **************************NOTE**************************
 * Name: DIV ENCLOSED SELECT COMPONENT
 * 		We need to enclose the Select component used as trigger for the Tooltip to work correctly
 * 		Omitting this will cause the Tooltip to render on the top of the page
 */

type CustomPropertyProps = Omit<TemplateProperty, 'type'> & {
	type: Exclude<TemplateProperty['type'], 'user'>
	size?: 'default' | 'full'
	value?: TaskPropertyValue
	asTooltipTrigger?: boolean
	onChange?: (change: ChangeParams<TaskPropertyValue>) => void
}

type CustomUserPropertyProps = Omit<TemplateProperty, 'type'> & {
	size?: 'default' | 'full'
	value?: User[]
	asTooltipTrigger?: boolean
	onChange?: (val: ChangeParams<User[]>) => void
}

export const CustomProperty: FC<CustomPropertyProps> = ({ asTooltipTrigger, ...rest }) => {
	if (asTooltipTrigger) return <TaskCustomPropertyAsTtTrigger {...rest} />
	return <TaskCustomProperty {...rest} />
}

export const CustomUserProperty: FC<CustomUserPropertyProps> = ({ asTooltipTrigger, ...rest }) => {
	if (asTooltipTrigger) return <TaskCustomUserPropertyAsTtTrigger {...rest} />
	return <TaskCustomUserProperty {...rest} />
}

type TaskCustomPropertyProps = Omit<CustomPropertyProps, 'asTooltipTrigger'>

const TaskCustomProperty: FC<TaskCustomPropertyProps> = ({ type, value, ...rest }) => {
	switch (type) {
		case 'number':
		case 'text':
		case 'date':
			return <TaskCustomInputProperty type={type} value={value as string} {...rest} />
		case 'select':
		case 'multiSelect':
			return <TaskCustomSelectProperty type={type} value={value} {...rest} />
	}
}

type TaskCustomInputProps = Omit<TaskCustomPropertyProps, 'value'> & { value?: string }

const TaskCustomInputProperty: FC<TaskCustomInputProps> = ({ type, name, value: initialValue, onChange }) => {
	const [value, setValue] = useState(initialValue || '')
	const { debouncedValue, previousValue } = useDebounce(value, DebounceDelay)
	const initialRender = useRef<boolean>(true)

	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false
		} else if (onChange) onChange({ newValue: debouncedValue, previousValue: previousValue || '' })
	}, [debouncedValue])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (onChange) setValue(e.target.value)
	}

	switch (type) {
		case 'number':
		case 'text':
			return (
				<div>
					<Label className='peer text-muted-foreground'>{name}</Label>
					<Input className='h-10' type='text' value={value as string} onChange={handleChange} />
				</div>
			)
		case 'date':
			return (
				<div>
					<Label className='text-muted-foreground'>{name}</Label>
					<Input className='h-10' type='date' value={value as string} onChange={handleChange} />
				</div>
			)
		case 'select':
		case 'multiSelect':
			throw 'Invalid use of Component'
	}
}

const TaskCustomSelectProperty: FC<TaskCustomPropertyProps> = ({ type, name, options, value, size, onChange }) => {
	if (type == 'select' || type == 'multiSelect') {
		return (
			<div>
				<Label className='text-muted-foreground'>{name}</Label>
				<CustomValueSelect
					size={size}
					options={options || ['Invalid Property']}
					value={value}
					onChange={onChange}
					multiSelect={type == 'multiSelect'}
				/>
			</div>
		)
	}

	throw 'Invalid use of Component'
}

type TaskCustomUserPropertyProps = Omit<CustomUserPropertyProps, 'asTooltipTrigger'>

const TaskCustomUserProperty: FC<TaskCustomUserPropertyProps> = ({ name, value, size, onChange, singleUser }) => {
	return (
		<div>
			<Label className='text-muted-foreground'>{name}</Label>
			<AssigneeSelect size={size} singleUser={singleUser} assignee={value} onChange={onChange} />
		</div>
	)
}

const TaskCustomPropertyAsTtTrigger: FC<TaskCustomPropertyProps> = ({ type, value, ...rest }) => {
	// NOTE NAME: DIV ENCLOSED SELECT COMPONENT

	switch (type) {
		case 'number':
		case 'text':
		case 'date':
			return <TaskCustomInputPropertyAsTtTrigger type={type} value={value as string} {...rest} />
		case 'select':
		case 'multiSelect':
			return <TaskCustomSelectPropertyAsTTTrigger type={type} value={value} {...rest} />
	}
}

type TaskCustomInputPropertyAsTtTriggerProps = Omit<TaskCustomPropertyProps, 'value'> & { value?: string }

const TaskCustomInputPropertyAsTtTrigger: FC<TaskCustomInputPropertyAsTtTriggerProps> = ({
	type,
	name,
	value: initialValue,
	onChange
}) => {
	const [value, setValue] = useState(initialValue || '')
	const { debouncedValue, previousValue } = useDebounce(value, DebounceDelay)
	const initialRender = useRef<boolean>(true)

	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false
		}
		if (onChange) onChange({ newValue: debouncedValue, previousValue: previousValue || '' })
	}, [debouncedValue])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (onChange) setValue(e.target.value)
	}

	switch (type) {
		case 'number':
		case 'text':
			return (
				<div>
					<Label className='peer text-muted-foreground'>{name}</Label>
					<TooltipTrigger asChild>
						<Input className='h-10' type='text' value={value as string} onChange={handleChange} />
					</TooltipTrigger>
				</div>
			)
		case 'date':
			return (
				<div>
					<Label className='text-muted-foreground'>{name}</Label>
					<TooltipTrigger asChild>
						<Input className='h-10' type='date' value={value as string} onChange={handleChange} />
					</TooltipTrigger>
				</div>
			)
		case 'select':
		case 'multiSelect':
			throw 'Invalid use of Component'
	}
}

const TaskCustomSelectPropertyAsTTTrigger: FC<TaskCustomPropertyProps> = ({
	type,
	name,
	options,
	value,
	size,
	onChange
}) => {
	if (type == 'select' || type == 'multiSelect') {
		return (
			<div>
				<Label className='text-muted-foreground'>{name}</Label>
				<TooltipTrigger asChild>
					<div>
						<CustomValueSelect
							size={size}
							options={options || ['Invalid Property']}
							value={value}
							onChange={onChange}
							multiSelect={type == 'multiSelect'}
						/>
					</div>
				</TooltipTrigger>
			</div>
		)
	}

	throw 'Invalid use of Component'
}

const TaskCustomUserPropertyAsTtTrigger: FC<TaskCustomUserPropertyProps> = ({
	name,
	value,
	size,
	onChange,
	singleUser
}) => {
	return (
		<div>
			<Label className='text-muted-foreground'>{name}</Label>
			<TooltipTrigger asChild>
				{/** NOTE NAME: DIV ENCLOSED SELECT COMPONENT */}
				<div>
					<AssigneeSelect size={size} singleUser={singleUser} assignee={value} onChange={onChange} />
				</div>
			</TooltipTrigger>
		</div>
	)
}
