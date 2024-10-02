import {
	MutationCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'
import {
	createMemoryHistory,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onSuccess: () => {
			void queryClient.invalidateQueries()
		},
	}),
})

const router = createRouter({
	history: createMemoryHistory(),
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: 'intent',
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
})

// Register things for typesafety
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
	root.render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	)
}
