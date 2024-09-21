import type { PlopTypes } from '@turbo/gen'

import { spawn } from 'node:child_process'

function didSucceed(code: number | null) {
	if (code == null) return true // TODO: should this be false?
	return code.toFixed() === '0'
}

function pnpmInstall(): Promise<string> {
	return new Promise((resolve, reject) => {
		const pnpmI = spawn('pnpm', ['install'], {
			shell: true,
			stdio: 'inherit',
		})

		pnpmI.on('close', (code) => {
			if (didSucceed(code)) {
				resolve(`pnpm install ran correctly`)
			} else {
				if (code == null) {
					// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- Plop expects a string return, not an `Error`
					reject('pnpm instal exited with an unknown error')
					return
				}
				// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- Plop expects a string return, not an `Error`
				reject(`pnpm install exited with ${code.toFixed()}`)
			}
		})
	})
}

export default function (plop: PlopTypes.NodePlopAPI) {
	plop.setDefaultInclude({ actionTypes: true })
	plop.setActionType('pnpmInstall', pnpmInstall)
}
