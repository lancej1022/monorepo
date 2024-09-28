// TODO: does the name of this file matter, or can it just be renamed to `main.tsx` so its more obviously an entry point?

import { createRouter, RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import { routeTree } from './routeTree.gen'

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	// TODO: add react-query context unless it doesnt wind up being needed in a local-first context
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById('root')
if (!rootElement)
	throw Error(
		'Could not locate root `#root` id on any element. Unable to mount react tree, throwing Error.',
	)

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(<RouterProvider router={router} />)
}
