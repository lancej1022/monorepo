import type { Config } from 'tailwindcss'

import { monorepoTailwindPreset } from '@monorepo/tailwind'

const config: Config = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	darkMode: 'class',
	presets: [monorepoTailwindPreset],
}

export default config
