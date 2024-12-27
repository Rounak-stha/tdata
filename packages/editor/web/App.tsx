import React from 'react'
import { Editor } from '../src/components/editor'
import './index.css'

function App() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<header className='bg-white border-b border-gray-200 py-4'>
				<div className='max-w-4xl mx-auto px-4'>
					<h1 className='text-xl font-semibold text-gray-800'>ProseMirror Editor</h1>
				</div>
			</header>
			<main className='py-8'>
				<Editor />
			</main>
		</div>
	)
}

export default App
