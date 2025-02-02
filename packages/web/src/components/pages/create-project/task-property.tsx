import { ChevronDownIcon, ChevronUpIcon, PlusIcon, UserIcon, UserPlusIcon, XIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FC, useEffect, useState } from 'react'
import { TemplateProperty, TaskPropertyTypes } from '@/types/template'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Checkbox } from '@/components/ui/checkbox'
import { AttributeTypeSelect } from '@/components/selects/attribute-type'
import { ShowInfo } from '@/components/common/show-info'

type EditTaskPropertiesProps = {
	attributes: TemplateProperty[]
	setAttributes: (taskTypes: TemplateProperty[]) => void
}

const REQUIRED_FIELD_INFO_MESSAGE = 'Required fields are mandatory while creaing a new task'

export const EditTaskProperties: FC<EditTaskPropertiesProps> = ({ attributes, setAttributes }) => {
	const [popoverOpen, setPopoverOpen] = useState(false)

	const addAttribute = (newTaskType: TemplateProperty) => {
		setAttributes([...attributes, newTaskType])
		setPopoverOpen(false)
	}

	const removeAttribute = (index: number) => {
		const newAttributes = [...attributes]
		newAttributes.splice(index, 1)
		setAttributes(newAttributes)
	}

	const updatedAttribute = (index: number, attribute: TemplateProperty) => {
		const newAttributes = [...attributes]
		newAttributes[index] = attribute
		setAttributes(newAttributes)
	}

	return (
		<div>
			<div className='flex items-center justify-between mb-2'>
				<h3 className='text-sm font-medium'>Task Attributes</h3>
				<CreateAttributePopover open={popoverOpen} onOpenChange={setPopoverOpen} onCreate={addAttribute} />
			</div>
			<div className='grid gap-2'>
				{attributes.map((attr, index) => (
					<TaskPropertyEntry
						key={attr.name + attr.type + index}
						attribute={attr}
						onEdit={(attribute: TemplateProperty) => updatedAttribute(index, attribute)}
						onRemove={() => removeAttribute(index)}
					/>
				))}
			</div>
		</div>
	)
}

type CreateAttributePopoverProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	onCreate: (attribute: TemplateProperty) => void
}

const CreateAttributePopover: FC<CreateAttributePopoverProps> = ({ open, onOpenChange, onCreate }) => {
	const [newAttribute, setNewAttribute] = useState<TemplateProperty>({ name: '', type: 'text', required: false })
	const [newOption, setNewOption] = useState('')

	const setName = (name: string) => setNewAttribute({ ...newAttribute, name })
	const setType = (type: TaskPropertyTypes) => setNewAttribute({ ...newAttribute, type })

	const setRequired = (required: boolean) => setNewAttribute({ ...newAttribute, required })

	const addOption = () => {
		if ((newAttribute.type === 'select' || newAttribute.type === 'multiSelect') && newOption.length != 0) {
			if (!newAttribute.options) {
				setNewAttribute({ ...newAttribute, options: [newOption] })
			} else {
				setNewAttribute({ ...newAttribute, options: [...newAttribute.options, newOption] })
			}
			setNewOption('')
		}
	}

	const removeOption = (index: number) => {
		if (newAttribute.type == 'select' && newAttribute.options) {
			const newOptions = [...newAttribute.options]
			newOptions.splice(index, 1)
			setNewAttribute({ ...newAttribute, options: newOptions })
		}
	}

	const handleCreate = () => {
		if (!newAttribute.name || !newAttribute.type) return
		if ((newAttribute.type === 'select' || newAttribute.type === 'multiSelect') && !newAttribute.options?.length)
			return
		onCreate(newAttribute)
	}

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button size='sm' variant='outline'>
					<PlusIcon className='h-3 w-3 mr-1' />
					Add Task Attribute
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-80' align='end' side='top'>
				<div className='grid gap-4'>
					<div className='space-y-2'>
						<div className='flex items-start'>
							<h4 className='flex-1 font-medium leading-none'>New Task Attribute</h4>
							<div className='flex items-center'>
								<Checkbox
									checked={newAttribute.required}
									onCheckedChange={setRequired}
									className='mx-1'
								/>
								<ShowInfo message={REQUIRED_FIELD_INFO_MESSAGE} />
							</div>
						</div>
					</div>
					<div className='grid gap-2'>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label htmlFor='attr-name'>Name</Label>
							<Input
								id='attr-name'
								value={newAttribute.name}
								onChange={(e) => setName(e.target.value)}
								className='col-span-2 h-8'
							/>
						</div>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label>Type</Label>
							<AttributeTypeSelect type={newAttribute.type} onSelect={setType} />
						</div>
						{(newAttribute.type === 'select' || newAttribute.type === 'multiSelect') && (
							<div className='space-y-2'>
								<Label>Options</Label>
								{newAttribute.options?.map((option, index) => (
									<div key={index} className='flex items-center gap-2'>
										<Input value={option} disabled className='h-8' />
										<Button variant='ghost' size='icon' onClick={() => removeOption(index)}>
											<XIcon className='h-4 w-4' />
										</Button>
									</div>
								))}
								<div className='flex items-center gap-2'>
									<Input
										value={newOption}
										onChange={(e) => setNewOption(e.target.value)}
										placeholder='New option'
										className='h-8'
									/>
									<Button variant='outline' size='sm' onClick={addOption}>
										Add
									</Button>
								</div>
							</div>
						)}
					</div>
					<Button size='sm' onClick={handleCreate}>
						Add Attribute
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

type AttrbuteEntryProps = {
	attribute: TemplateProperty
	onEdit: (attribute: TemplateProperty) => void
	onRemove: () => void
}
const TaskPropertyEntry: FC<AttrbuteEntryProps> = ({ attribute: initialAttribute, onRemove, onEdit }) => {
	const [open, setOpen] = useState(false)
	const [attribute, setAttribute] = useState(initialAttribute)
	const [attributeChanged, setAttributeChanged] = useState(false)
	const [saved, setSaved] = useState(false)

	const [newOption, setNewOption] = useState('')

	const addOption = () => {
		if (attribute.type === 'select' || attribute.type === 'multiSelect') {
			if (!attribute.options) {
				setAttribute({ ...attribute, options: [newOption] })
			} else {
				setAttribute({ ...attribute, options: [...attribute.options, newOption] })
			}
			setNewOption('')
		}
	}

	const removeOption = (index: number) => {
		if ((attribute.type == 'select' || attribute.type == 'multiSelect') && attribute.options) {
			const newOptions = [...attribute.options]
			newOptions.splice(index, 1)
			setAttribute({ ...attribute, options: newOptions })
		}
	}

	// NOTE: This will update attributeChanged to true in the initial render
	useEffect(() => {
		if (!attributeChanged) {
			setAttributeChanged(true)
		}
	}, [attribute])

	useEffect(() => {
		if (saved) {
			setSaved(false)
		}
	}, [saved])

	const onOpenChange = (open: boolean) => {
		if (!open && !saved && attributeChanged) {
			setAttribute(initialAttribute)
			setAttributeChanged(false)
		}
		setOpen(open)
	}

	const handelSave = () => {
		setSaved(true)
		onEdit(attribute)
		setOpen(false)
	}

	const setName = (name: string) => setAttribute({ ...attribute, name })
	const setType = (type: TaskPropertyTypes) => setAttribute({ ...attribute, type })
	const setRequired = (required: boolean) => setAttribute({ ...attribute, required })

	const setOptions = (options: string[]) => setAttribute({ ...attribute, options })
	const updateOption = (index: number, value: string) => {
		if (attribute.options) {
			const newOptions = [...attribute.options]
			newOptions[index] = value
			setOptions(newOptions)
		}
	}
	const setMultiUser = (singleUser: boolean) => setAttribute({ ...attribute, singleUser })

	return (
		<Collapsible open={open} onOpenChange={onOpenChange} className='text-sm rounded-md bg-muted'>
			<div className='flex items-center p-2 pl-4 '>
				<div className='flex-1 flex items-center gap-1'>
					<span>{attribute.name}</span>
					<Badge variant='outline'>{attribute.type}</Badge>
					{!open && attribute.singleUser == false && <UserPlusIcon className='h-4 w-4' />}
					{!open && attribute.singleUser == true && <UserIcon className='h-4 w-4' />}

					{open && attribute.singleUser != undefined && (
						<div className='flex items-center gap-1'>
							<Label className='text-xs'>Single</Label>
							<Checkbox checked={attribute.singleUser} onCheckedChange={setMultiUser} />
						</div>
					)}
				</div>
				<CollapsibleTrigger asChild>
					<Button variant='ghost' size='sm' className='h-8 w-8'>
						{open ? <ChevronUpIcon className='h-3 w-3' /> : <ChevronDownIcon className='h-3 w-3' />}
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent>
				<div className='p-4 border-t flex flex-col gap-6'>
					<div className='flex flex-col gap-6'>
						<div className='flex flex-col gap-2'>
							<Label className='text-xs'>Name</Label>
							<Input value={attribute.name} onChange={(e) => setName(e.target.value)} />
						</div>
						<div className='flex flex-col justify-center gap-2'>
							<Label className='text-xs'>Type</Label>
							<AttributeTypeSelect type={attribute.type} onSelect={setType} />
						</div>
						<div className='flex flex-col justify-center gap-2'>
							<div className='flex items-center'>
								<Label className='text-xs mr-1'>Requried</Label>
								<ShowInfo message={REQUIRED_FIELD_INFO_MESSAGE} />
							</div>
							<Checkbox checked={attribute.required} onCheckedChange={setRequired} />
						</div>

						{(attribute.type == 'select' || attribute.type == 'multiSelect') && attribute.options && (
							<div className='space-y-2'>
								<Label className='text-xs'>Options</Label>
								{attribute.options.map((option, index) => (
									<div key={index} className='flex items-center gap-2'>
										<Input value={option} onChange={(e) => updateOption(index, e.target.value)} />
										<Button variant='ghost' size='icon' onClick={() => removeOption(index)}>
											<XIcon className='h-4 w-4' />
										</Button>
									</div>
								))}
								<div className='flex items-center gap-2'>
									<Input
										value={newOption}
										onChange={(e) => setNewOption(e.target.value)}
										placeholder='New option'
									/>
									<Button variant='default' onClick={addOption}>
										Add
									</Button>
								</div>
							</div>
						)}
					</div>
					<div className='flex'>
						<div className='flex-1'></div>
						<div className='flex gap-2'>
							<Button variant='destructive' onClick={() => onRemove()}>
								Remove
							</Button>
							<Button disabled={!attributeChanged} onClick={handelSave}>
								Save
							</Button>
						</div>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}
