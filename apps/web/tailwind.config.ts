import type { Config } from 'tailwindcss'

import { withUt } from 'uploadthing/tw'

import { monorepoTailwindPreset } from '@monorepo/tailwind'

const config: Config = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/dist/**/*.js'],
	darkMode: 'class',
	presets: [monorepoTailwindPreset],
}

export default withUt(config)
